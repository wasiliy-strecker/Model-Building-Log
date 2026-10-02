#!/usr/bin/env python3
"""Render app-local SVG assets with librsvg and Cairo."""
from pathlib import Path
from xml.etree import ElementTree

import cairo
import gi

gi.require_version('Rsvg', '2.0')
from gi.repository import Rsvg

root = Path(__file__).resolve().parent.parent
source = root / 'assets/branding/modellbaulog_icon.svg'
original = source.read_bytes()
tree = ElementTree.fromstring(original)
for child in list(tree):
    if child.get('id') == 'background':
        tree.remove(child)

for filename, contents in [('icon.png', original), ('icon-foreground.png', ElementTree.tostring(tree))]:
    handle = Rsvg.Handle.new_from_data(contents)
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 1024, 1024)
    viewport = Rsvg.Rectangle()
    viewport.x = viewport.y = 0
    viewport.width = viewport.height = 1024
    handle.render_document(cairo.Context(surface), viewport)
    surface.write_to_png(str(root / 'assets' / filename))
print('Generated icon.png and icon-foreground.png.')
