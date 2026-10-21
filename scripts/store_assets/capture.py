"""Small UI helpers for the actual ModellbauLog app on dedicated screenshot AVDs."""
from pathlib import Path
from datetime import datetime, timezone
import json
import re
import shlex
import subprocess
import time

from device import Device

PACKAGE = "com.appfactory.modellbaulog.dev"


class Capture(Device):
    def __init__(self, serial):
        super().__init__(serial)
        size = self.run("shell", "wm", "size").decode().splitlines()[-1]
        self.width, self.height = map(int, re.findall(r"(\d+)x(\d+)", size)[0])

    def start(self):
        self.run("shell", "am", "force-stop", PACKAGE)
        self.run("shell", "am", "start", "-n", PACKAGE + "/com.appfactory.modellbaulog.MainActivity")
        time.sleep(2)

    def has(self, label):
        return any(label in (n.get("text", ""), n.get("content-desc", ""))
                   and self.visible(n) for n in self.nodes())

    def visible(self, node):
        a, b, c, d = map(int, re.findall(r"\d+", node.get("bounds")))
        return c > a and d - b > 10 and b > 0 and d < self.height

    def back(self):
        self.run("shell", "input", "keyevent", "4")
        time.sleep(.5)

    def swipe(self, up=True):
        x = str(self.width // 2)
        a, b = int(self.height * .78), int(self.height * .28)
        if not up:
            a, b = b, a
        self.run("shell", "input", "swipe", x, str(a), x, str(b), "400")
        time.sleep(.4)

    def reveal(self, label):
        for _ in range(10):
            if self.has(label):
                return
            self.swipe()
        raise ValueError(f"Could not reveal {label}")

    def field(self, label, value, clear=True, dismiss=True):
        self.reveal(label)
        for attempt in range(4):
            self.tap(label)
            focused = [n for n in self.nodes() if n.get("class") == "android.widget.EditText"
                       and n.get("focused") == "true"]
            if any(label in (n.get("text", ""), n.get("content-desc", "")) for n in focused):
                break
            if attempt == 3:
                raise ValueError(f"Could not focus input: {label}")
        if clear:
            self.run("shell", "input", "keycombination", "113", "29")
            self.run("shell", "input", "keyevent", "KEYCODE_DEL")
            time.sleep(.35)  # Let the controlled React Native input apply the deletion.
        self.run("shell", "input", "text", shlex.quote(value.replace(" ", "%s")))
        time.sleep(.35)
        inputs = [n for n in self.nodes() if n.get("class") == "android.widget.EditText"
                  and n.get("focused") == "true"]
        if not any(n.get("text") == value or n.get("password") == "true" for n in inputs):
            raise ValueError(f"Input did not accept expected value: {label}")
        if dismiss:
            self.back()

    def capture(self, path):
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        time.sleep(1.5)
        path.write_bytes(self.run("exec-out", "screencap", "-p"))
        subprocess.run(["convert", str(path), f"PNG24:{path}"], check=True)
        path.with_suffix(".json").write_text(json.dumps({
            "capturedAt": datetime.now(timezone.utc).isoformat(),
            "serial": self.serial,
            "avd": self.run("emu", "avd", "name").decode().splitlines()[0],
            "size": self.run("shell", "wm", "size").decode().strip(),
            "density": self.run("shell", "wm", "density").decode().strip(),
            "locale": self.run("shell", "getprop", "persist.sys.locale").decode().strip(),
            "package": PACKAGE,
        }, indent=2) + "\n")
        print(path, flush=True)

    def align(self, label, target=.20):
        self.reveal(label)
        for _ in range(4):
            matches = [n for n in self.nodes() if label in (n.get("text"), n.get("content-desc"))
                       and self.visible(n)]
            if not matches:
                self.run("shell", "input", "swipe", str(self.width // 2), str(int(self.height * .3)),
                         str(self.width // 2), str(int(self.height * .45)), "650")
                time.sleep(.5)
                continue
            node = matches[0]
            top = int(re.findall(r"\d+", node.get("bounds"))[1])
            delta = top - int(self.height * target)
            if abs(delta) < 45:
                return
            start = int(self.height * (.76 if delta > 0 else .30))
            end = max(int(self.height * .20), min(int(self.height * .76), start - delta))
            self.run("shell", "input", "swipe", str(self.width // 2), str(start),
                     str(self.width // 2), str(end), "650")
            time.sleep(.5)

    def top(self):
        for _ in range(5):
            self.swipe(False)

    def dump(self):
        for node in self.nodes():
            label = node.get("text") or node.get("content-desc")
            if label:
                print(node.get("bounds"), repr(label), flush=True)

    def set_date(self, date, hour="20", minute="15"):
        self.reveal("Datum auswählen")
        self.tap("Datum auswählen")
        self.tap("Datum eingeben")
        self.field("Datum", date, dismiss=False)
        self.tap("OK")
        self.tap("Uhrzeit eingeben")
        self.field("Stunde", hour, dismiss=False)
        self.field("Minute", minute, dismiss=False)
        self.tap("OK")

    def save_entry(self):
        self.reveal("Bauschritt speichern")
        self.tap("Bauschritt speichern")
        time.sleep(3)
        if self.has("Bauschrittinformationen"):
            self.back()

    def create_project(self, name, model_type, material):
        self.start()
        self.tap("Projekt anlegen")
        self.field("Modelltyp (optional)", model_type)
        self.field("Projektname *", name)
        self.field("Hersteller (optional)", "Eigenbau")
        self.field("Material (optional)", material)
        self.tap("Projekt speichern")
        time.sleep(3)
        if self.has("Projekt speichern"):
            self.tap("Projekt speichern")
            time.sleep(2)
        if not self.has("Bauschritt erfassen"):
            raise ValueError("Project was not saved")

    def manual_step(self, number, title, date, note, hour="19", minute="00"):
        self.tap("Bauschritt erfassen")
        self.tap("Ohne Foto erfassen")
        self.field("Aktueller Bauschritt *", str(number))
        self.field("Titel (optional)", title)
        self.set_date(date, hour, minute)
        self.field("Notiz", note)
        self.save_entry()
