"""Enter fictional projects through the real UI on a fresh phone capture AVD."""
import argparse

from capture import Capture


def seed(c, project):
    if project == "ship":
        c.create_project("Segelboot 1:72", "Schiff", "Holz")
        c.manual_step(4, "Rumpf beplanken", "19.10.2026",
                      "Die ersten Planken sitzen. Danach folgt das Heck.")
    elif project == "car":
        c.create_project("Sportwagen 1:24", "Fahrzeug", "Kunststoff")
        c.manual_step(8, "Karosserie lackieren", "20.10.2026",
                      "Rot lackiert. Die Scheiben werden nach dem Trocknen eingesetzt.")
    else:
        c.create_project("Propellerflugzeug 1:48", "Flugzeug", "Kunststoff")
        for number, title, date, note in [
            (1, "Bauteile vorbereiten", "18.10.2026", "Bauteile sortiert und vorsichtig entgratet."),
            (3, "Cockpit lackieren", "19.10.2026", "Cockpit in mattem Oliv, Instrumententafel in Anthrazit lackiert."),
            (5, "Cockpit montieren", "20.10.2026", "Sitz und Instrumententafel eingesetzt. Danach den Rumpf probeweise anpassen."),
        ]:
            c.manual_step(number, title, date, note)
            print(f"Saved step {number}", flush=True)
    print(f"Saved fictional project: {project}", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("serial")
    parser.add_argument("project", choices=["ship", "car", "aircraft"])
    args = parser.parse_args()
    c = Capture(args.serial)
    if not c.run("emu", "avd", "name").decode().startswith("ml_store_assets_phone_"):
        raise ValueError("Seed data belongs only on the dedicated phone AVD")
    seed(c, args.project)


if __name__ == "__main__":
    main()
