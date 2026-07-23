# Prototype Instructions

The homepage unit galaxy displays a restrained constellation-style SVG relationship layer behind the spheres and labels. Keep the network sparse, center it on 城市运行管理局 and 行政审批服务局, fade distant links into the starfield, and emphasize only directly related links on sphere hover. Keep the lower-right controller as a true 3D perspective control with depth, orbit and pitch, not a flat-plan rotation.

The unit panorama opens directly on a clean, oblique, high-density business tree and defaults to the business-item level. Keep the business tree as the persistent basemap; system, project and diagnosis are mutually exclusive overlays that may all be switched off. System status filters are 在用 / 在建 / 规划中. The diagnosis overlay keeps a clickable legend for 无系统支撑 / 系统冗余 / 重复建设 / 数据孤岛 / 支撑薄弱 / 建设滞后.

All prototype text uses white as its hue; distinguish hierarchy with opacity rather than blue-gray text colors. The unit panorama keeps two directly switchable basemap modes: the high-density business tree and the system business matrix.

The unit panorama mode switch uses business-tree and business-matrix basemap modes and does not show a Sankey-view option. Hide the display-level control entirely in business-matrix mode. In business-tree mode, keep the basemap and display-level controls as compact adjacent rows with reduced vertical padding. Use the previous circular 3D view controller with adjacent zoom/reset actions, and keep the business-tree default close to top-down so labels remain readable.

The unit panorama also includes a third business-catalog basemap after business tree and business matrix. Keep six switchable business mainlines in a directory-style left rail; each vertical lane is one business block, and each card combines one business unit with its business-item list.

Keep the business-catalog basemap as large as the surrounding layout allows, with minimal top and bottom margins. Its horizontal scrollbar should sit close to the bottom edge rather than floating noticeably above it.

Use the shared one-row basemap switch names 业务树 / 业务矩阵 / 业务看板. The view-control panel is common across all three basemaps. Business board supports system, project and diagnosis overlays in the same single-select overlay control. All three overlays must resolve to the business-item level: individual事项 rows carry the strongest colors and status labels. Unit cards use subtle derived outlines plus coverage ratios, and business-block headers use lighter aggregate segmented bars plus coverage ratios; do not fill every hierarchy level with equally strong color.

For business-tree overlays, keep the business cards text-only: show the business name without numeric badges or quantity labels. Activating an overlay should play a clearly visible 4-5 second left-to-right electrical illumination sequence across the viewport; connectors carry the current and nodes flash before settling. For the system overlay, the associated system count drives the same low cyan-blue, medium blue-violet, and high amber-orange colors as the system board, but the count itself is not displayed. Keep neighboring horizontal tree-cluster roots slightly closer together without tightening sibling or level spacing.

For the system business tree, use a large continuous canvas with independent, staggered tree clusters rather than aligned rows or a fixed three-column layout. Keep each cluster internally clear from block to unit to item, use right-angle connector lines, and let partial surrounding clusters remain outside the visible frame as in the supplied reference.

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

The business layer keeps its existing spatial/flat views. The system layer uses a continuous adjustable oblique top-down hexagonal business territory rather than geography or floating cards, with business mainlines separated by boundaries and a selectable minimum granularity: business mainline, business block, business unit, or business item. Lower levels are aggregated when a higher granularity is selected. System support is visualized by a unified blue heat scale, tile height, and thin vertical light beams that strike the current minimum-level business nodes; the beams play once on entry or granularity change and do not remain as stars. Reuse the existing circular 360-degree view controller for rotation, tilt, and reset.

When an overlay is active on the business tree, render matched nodes as solid translucent crystal blocks rather than black cards with colored luminous outlines. Carry system/project/diagnosis colors through an internal gradient and restrained inner glow, keep a neutral faint outer edge, add a 1px top highlight plus dark lower depth, and preserve pure-white readable labels with a subtle dark text shadow.

For the system terrain, use polished luminous gradients derived from the homepage star palette: cyan-blue for low coverage, blue-violet for medium coverage, and sparse warm amber-orange for high coverage. Keep the starfield background; do not use a geographic map texture. Mainline, block, and unit boundaries must all remain visible at every granularity and follow the irregular outer edges of their hex-cell groups rather than rectangular frames. Keep labels hidden at the default zoom and reveal them only after zooming in. Support wheel/button zoom so cells and labels scale together.

The system layer also provides a `业务矩阵 / 业务树` presentation switch. Every business-matrix cell reveals its business-item name on hover. The business tree is a horizontal business block → business unit → business item relationship view with luminous connector lines, uses the same cyan/blue-violet/amber support scale as the matrix, and shares rotation, tilt, zoom, reset and scan states. On entry and rescan, cards and connectors illuminate progressively from left to right; card details become available after scanning completes. Do not add a full-height white scan line over the business tree.

Clicking a system card from the business matrix opens the existing full-screen application-panorama screenshot view. Do not open the system-profile side drawer for that action.

Side drawers must remain visually distinct from the main canvas: use an obvious dimming scrim, a luminous left boundary, deeper shadow separation, and a more opaque drawer surface. Drawer copy must stay clearly readable with white-hue typography, stronger opacity, and no undersized low-contrast auxiliary text.

The unit panorama should avoid a near-black or heavily vignetted backdrop. Use a brighter luminous blue/cyan/violet spatial field with restrained nebula and grid glow, and keep the business cards, connectors, metrics, and glass controls visually vivid enough to feel integrated with that background rather than floating on a black void.

Keep the original dark-glass fill for both unit-panorama tool surfaces. The lower-left perspective/zoom controller should occupy about 60% of its former visual area while retaining the same functions.

The pure business-tree cards should not rely on a uniformly bright fill. Use staggered low/high luminance cycles, moving prismatic highlights, briefly intensified top edges, glowing indicators, and gently breathing connectors so the dark canvas produces a flowing, iridescent technology feel similar to illuminated wireframe cubes.

Keep the unit-panorama basemap closer to deep blue-black than saturated blue, with sparse star points and low-contrast dark grid lines. Business cards should not use a diagonal prism sweep; fine white edge highlights and hover outlines may remain alongside the cyan/blue/violet luminance animation.

Do not show a regular grid on the unit-panorama basemap. Use a sparse, non-repeating star field with irregular positions, sizes, brightness, and a few restrained cyan/violet halos.

The unit panorama interaction controls use a compact, ornate floating glass panel in the lower-right with basemap tabs, overlay switches, and inline expandable filters. It has a one-click collapse state that leaves a small glowing launcher. All panel text uses white as its hue; hierarchy is expressed only through opacity, while cyan/violet are reserved for non-text highlights and glow. The system filter expansion omits only-covered and coverage-strength actions and shows low/medium/high using the actual cyan-blue, blue-violet, and amber-orange colors. Keep the circular perspective controller in the lower-left, with the compact zoom/reset/tilt button stack beside it.

Pure business-tree nodes use the earlier technical HUD panel with a dark-blue glass plate, luminous cyan/white frame, calibration ticks, side markers, and directional chevrons. Remove the large concentric energy halo behind the panel, but preserve the other technical ornaments, live labels, staggered reveal, frame breathing, indicator pulse, and connector luminance; do not reintroduce a flat rectangular card treatment.

The overlay filter interaction keeps three compact system modes: 全部系统, 按状态 (在用 / 在建 / 规划中), and 单个系统 with a direct system selector. Place 展示层级 immediately below 底图视图, before overlay filters, using a compact segmented control.

System coverage strength 高 / 中 / 低 is an explanatory legend anchored on the left side of the business canvas, not inside the right operation panel.
