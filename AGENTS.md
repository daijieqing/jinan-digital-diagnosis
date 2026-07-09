# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

The business layer keeps its existing spatial/flat views. The system layer uses a continuous adjustable oblique top-down hexagonal business territory rather than geography or floating cards, with business mainlines separated by boundaries and a selectable minimum granularity: business mainline, business block, business unit, or business item. Lower levels are aggregated when a higher granularity is selected. System support is visualized by a unified blue heat scale, tile height, and thin vertical light beams that strike the current minimum-level business nodes; the beams play once on entry or granularity change and do not remain as stars. Reuse the existing circular 360-degree view controller for rotation, tilt, and reset.

For the system terrain, use polished luminous gradients derived from the homepage star palette: cyan-blue for low coverage, blue-violet for medium coverage, and sparse warm amber-orange for high coverage. Keep the starfield background; do not use a geographic map texture. Mainline, block, and unit boundaries must all remain visible at every granularity and follow the irregular outer edges of their hex-cell groups rather than rectangular frames. Keep labels hidden at the default zoom and reveal them only after zooming in. Support wheel/button zoom so cells and labels scale together.
