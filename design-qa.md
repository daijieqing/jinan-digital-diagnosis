# Design QA — 系统业务支撑底图

## 2026-07-14 “业务流向洞察”桑基图复刻

- Source visual truth: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-fbf63b60-2c0f-4b83-9556-d15f44aedca1.png`
- Previous implementation evidence: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-8b84c83e-1074-4cbf-a368-067d3a402eac.png`
- Implementation screenshot: `D:\codex\济南数字化诊断\原型项目\sankey-reference-rebuild.png`
- Normalized comparison evidence: `D:\codex\济南数字化诊断\原型项目\sankey-reference-comparison.png`
- Viewport: 参考图按 668px 宽度归一；实现使用当前应用内浏览器 668 × 552，并裁切同等高度的桑基主体区域。
- State: 单位全景 / 桑基图。
- Focused region: 完整桑基主体已足以检查节点、颜色、光带、交叉汇聚与文字层级，无需额外局部裁切。

**Findings**

- 无 P0/P1/P2 问题。实现已从平行细条关系图改为参考图的“主线—模块—单元—核心事项—数字化能力”五列结构。
- Typography：主线、模块、单元、核心事项与能力卡片均使用白色文字，通过字号和透明度区分层级；在当前窄视口仍可识别主列和主线名称。
- Spacing and layout：四条主线纵向分区与参考图一致，模块节点数量分别为 3 / 4 / 3 / 3；中段保留足够空间展示交叉光带。
- Colors and tokens：四条主线分别使用高亮青、蓝、紫、品红，颜色从左侧主线持续贯穿至右侧能力卡片，中段不再衰减为暗直线。
- Image and asset fidelity：本次核心对象是代码原生数据流图，无外部图片资产；参考图中的装饰性业务图标没有用近似符号替代，作为 P3 后续视觉增强保留。
- Copy and content：使用城市运行管理、城市治理监督、公共服务保障、应急联动处置四条真实业务主线，并提供数字化能力与覆盖度示例。
- Interaction：主线悬浮可聚焦完整流向，非当前主线降亮；点击主线继续打开业务详情。

**Comparison History**

1. P1：旧版为等宽平行线，缺少参考图的宽光带、分流汇聚和交叉关系；已重构为五列曲线桑基结构。
2. P1：旧版颜色在中段偏暗且连线存在感不足；已提高青蓝紫红色带中段透明度、增加光晕与粒子流线。
3. P2：首次复刻的主线间交叉关系偏少；已补充跨主线的双向交叉光带，使中段网络密度更接近参考图。

**Implementation Checklist**

- [x] 四条主线和五阶段业务结构。
- [x] 青 / 蓝 / 紫 / 品红独立色带。
- [x] 宽半透明曲线、发光边缘与移动粒子。
- [x] 跨节点、跨主线交叉汇聚。
- [x] 悬浮聚焦与点击详情。
- [x] 页面构建与应用内浏览器展示检查通过。

**Follow-up Polish**

- P3：如后续需要完全复刻大屏装饰，可再为四类主线与数字化能力补充统一图标资产。

final result: passed

## 2026-07-16 首页星图式空间关系连线

- Source visual truth: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-097165f7-401c-4939-8274-0c41eae9cc41.png`
- Implementation screenshot: `D:\codex\济南数字化诊断\原型项目\constellation-network-implementation.png`
- Full-view comparison evidence: `D:\codex\济南数字化诊断\原型项目\constellation-reference-comparison.png`
- Viewport: 1280 × 720；补充在 1024 × 768 下检查了 SVG 尺寸重算。
- State: 全景研判 / 全市业务星系 / 默认视角。
- Focused region comparison: 右侧节点区域在全景对照图中占主要画幅，球体、标签、主次关系线与背景层次均可直接辨认，因此未另做局部裁切。

**Findings**

- 无 P0/P1/P2 问题。关系线保持在球体与标签下方、星空上方，未改变现有节点文字、球体样式、坐标和页面布局。
- Fonts and typography: 沿用原有字体、字号、字重与透明度；SVG 遮罩为所有节点标签预留透明区，连线不会穿过名称和指数文字。
- Spacing and layout rhythm: 复用 14 个节点的百分比坐标和球体尺寸；17 条关系形成双中心稀疏拓扑，未形成规则网格或高密度蜘蛛网。
- Colors and visual tokens: 主线使用克制的冷蓝/青蓝端点渐亮与中段渐隐，远景线更暗并使用少量断续微光；重点线仅使用轻量高斯辉光。
- Image quality and asset fidelity: 参考图用于星座网络的空间层次与光感方向；本次按用户指定使用原生 SVG 关系层，不新增或替换任何球体、图标或图片资产。
- Copy and content: 页面现有全部文字与示例指标保持不变。
- Interaction: 直接关联线由现有节点 `pointerenter / pointerleave` 状态驱动，非关联线平滑降暗；3 条主关系线使用 4.8–7.2 秒错峰流动微光。页面节点点击链路可正常进入单位全景。
- Responsive: `ResizeObserver` 在容器变化后重新计算实际像素坐标、球体外环半径、曲线路径和文字避让遮罩；1024 × 768 检查中 17 条路径均有效，无 `NaN` 或缺失路径。
- Browser check: 页面在应用内浏览器正常渲染；控制台无 error/warning；SVG 图层 `pointer-events: none`。

**Comparison History**

1. 初次实现即满足本轮 P0/P1/P2 要求，未发现需要返工的布局、层级、亮度或文字遮挡问题。

**Implementation Checklist**

- [x] 双中心稀疏业务关系拓扑。
- [x] 0.5–1px 主次线、双端渐亮和中段渐隐。
- [x] 轻微曲线、远景断续线、端点微光和错峰慢速光脉冲。
- [x] 球体外环端点、文字避让遮罩和背景层级。
- [x] 节点悬停关联聚焦与平滑恢复。
- [x] 响应式重算、构建和浏览器展示检查。

**Follow-up Polish**

- 无阻塞项；后续如节点坐标改为持续大幅运动，可再评估切换到 Canvas 实时逐帧跟随。

final result: passed

## 2026-07-15 业务树叠加节点晶体实体化

- Source visual truth: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-3b22d06e-e3d9-41c2-b533-f1e76579efa6.png`
- Implementation screenshot: `D:\codex\济南数字化诊断\原型项目\business-tree-crystal-overlay.png`
- Focused implementation evidence: `D:\codex\济南数字化诊断\原型项目\business-tree-crystal-overlay-focus.png`
- Viewport: 1280 × 720
- State: 单位业务全景 / 业务树 / 系统叠加 / 扫描完成
- Full-view comparison evidence: 参考图与实现截图已在同一视觉比较输入中并列检查；参考图用于节点材质、色阶和厚度，不作为业务树页面布局来源。
- Focused region comparison evidence: 放大检查左侧主线与板块节点，确认顶部 1px 高光、内部状态色泛光、深色底部厚度和白色文字分离效果可见。

**Findings**

- 无待处理 P0/P1/P2 问题。原有“黑底 + 彩色亮边”已改为深色半透明晶体实体块，状态色由内部渐变和内发光承担，外边缘仅保留低对比中性细线。
- Fonts and typography: 节点沿用现有中文字体、字号和层级；命中节点文字固定纯白，并加入极弱黑色阴影，在橙色、蓝紫色和青色底上均保持清晰。
- Spacing and layout rhythm: 保留业务树原有节点尺寸、层级间距、连接关系与 8° 斜视角；悬浮仅微抬升，不改变画布结构。
- Colors and visual tokens: 系统支撑强度继续使用青蓝 / 蓝紫 / 琥珀橙三档；静态状态由实体渐变表达，扫描峰值才短暂增强外光。
- Image quality and asset fidelity: 本次为现有代码原生节点材质调整，不新增或替换图片资产；顶部高光、内部玻璃光泽与底部暗厚度均在浏览器渲染中清晰可见。
- Copy and content: 节点名称、筛选条件、层级和业务数据未变。
- Interaction: 系统图层切换、5 秒由左到右扫描、连接线点亮、节点悬浮和点击均保留；浏览器控制台无运行错误。

**Comparison History**

1. P2: 原节点主要依靠彩色描边与外发光区分状态，内部接近黑色，视觉偏空洞单薄。
2. Fix: 改为状态色参与的三段深色渐变，加入克制的 inner glow、顶部亮线、底部暗层和接触阴影，并将彩色边框降级为中性边缘。
3. Post-fix evidence: 系统叠加截图同时显示琥珀橙与蓝紫实体节点，材质和状态色可从块体内部直接识别，文字保持纯白可读。

**Implementation Checklist**

- [x] 叠加命中节点改为实体晶体块。
- [x] 颜色通过内部渐变和内发光表达。
- [x] 顶部 1px 高光与底部暗厚度。
- [x] 白色文字与弱黑色文字阴影。
- [x] 保留原业务树视角、结构、扫描与交互。
- [x] 页面构建通过，浏览器系统叠加状态检查通过，控制台错误为 0。

**Follow-up Polish**

- P3: 若后续希望更接近参考图的高能量芯片块，可只在选中节点上再提高约 8% 的内部高光，不建议恢复大面积彩色外描边。

final result: passed

## 2026-07-14 单位全景交互重构与桑基图

- Problem-state toolbar reference: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-435545ae-b2ad-4db1-8086-4983b4eae5d5.png`
- Target controller reference: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-e31a9aaf-56f5-469e-b33e-4365933f7073.png`
- Business-tree implementation: `D:\codex\济南数字化诊断\原型项目\interaction-redesign-business.png`
- Sankey implementation: `D:\codex\济南数字化诊断\原型项目\interaction-redesign-sankey.png`
- Combined comparison evidence: `D:\codex\济南数字化诊断\原型项目\interaction-redesign-comparison.png`
- Viewport: 668 × 552（当前应用内浏览器可见区域）
- State: 单位全景 / 业务树默认态，以及单位全景 / 桑基图
- Focused comparison: 工具条与三维控制器使用参考局部和实现局部直接对照；参考资料未提供完整页面，因此全页只用于验证整体层级和遮挡。

**Findings**

- 无 P0/P1/P2 问题。原单行混合工具条已拆为“底图视图”和“叠加图层 / 展示层级”两层，主模式与筛选动作不再竞争同一视觉层级。
- Typography：全部控件文字保持白色体系，一级模式高对比，辅助组通过透明度降级；当前窄视口未出现模式文字断行。
- Spacing and layout：主要模式单独居中，第二行按图层和层级分组；业务画布从工具条下方保持可见，控制器与右侧图层面板互不遮挡。
- Colors and tokens：继续使用现有深蓝黑背景和青蓝选中态，没有新增不一致的颜色体系。
- Image and asset fidelity：三维控制器直接复用原型现有圆盘组件与加减、全局、复位动作，没有使用新的近似图标或占位资产。
- Copy and content：平铺流正式更名为“桑基图”，图内明确展示业务主线、板块、单元、事项以及 5 / 20 / 40 / 80 的数据规模。
- Interaction：浏览器已验证业务树、桑基图、系统棋盘三种模式可切换；业务树默认倾斜降为 8°，圆盘交互限制在可读范围内。

**Comparison History**

1. P1：原工具条把底图、图层、层级和视角混在一行，主次不清；已拆成两级工具条。
2. P1：自定义三维操纵区与历史交互不一致且大角度倾斜影响文字阅读；已恢复历史圆盘控制器并把默认倾斜降至 8°。
3. P1：旧平铺流仍是卡片关系图，不满足桑基图表达；已替换为四阶段带状流向图，并保留悬浮聚焦和点击详情。

**Implementation Checklist**

- [x] 两级工具条与三种主模式切换。
- [x] 旧圆盘视角控制器、缩放、全局与复位。
- [x] 默认微倾斜并限制旋转范围。
- [x] 四阶段桑基图及交互状态。
- [x] 页面构建通过，应用内浏览器核心模式检查通过。

final result: passed

- Source visual truth: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-82c3134e-e4b3-457a-a2dc-c35d91603d78.png`
- Material close-up reference: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-5ee09533-99bc-486c-9556-23b8298b6e5a.png`
- Implementation screenshot: `D:\codex\济南数字化诊断\原型项目\system-support-basemap-final.png`
- Combined comparison evidence: `D:\codex\济南数字化诊断\原型项目\system-support-basemap-comparison.png`
- Viewport: 1664 × 948
- State: 单位全景 / 系统 / 业务事项粒度 / 默认视角

## Findings

- No actionable P0/P1/P2 findings remain for the requested central basemap scope.
- Fonts and typography: unchanged; surrounding page copy was explicitly out of scope.
- Spacing and layout rhythm: the central board fills the available system canvas and remains behind the existing side statistics and controls.
- Colors and visual tokens: exactly three illuminated classes are present—cyan blue, violet and amber orange. Tiles within each class use one consistent brightness; dark navy is the only unlit state.
- Image quality and asset fidelity: raised translucent glass top faces, bevel highlights, thick front/right side walls, deep gaps, contact shadows, layered platform edges and blue underglow are visibly present.
- Copy and content: the basemap contains no text, numbers, labels or additional UI.

## Comparison History

1. Earlier implementation used several blue/purple brightness variations and read as a relatively flat neon surface.
2. Rebuilt the raster asset using the close-up reference as the material source of truth.
3. Post-fix evidence shows three discrete illuminated states and materially stronger extrusion, transparency, bevels and layered platform depth.

## Open Questions

- None for the central basemap scope.

## Implementation Checklist

- [x] Replace the previous basemap asset.
- [x] Preserve existing left/right statistics and navigation.
- [x] Keep existing zoom, drag and tile hotspot behavior.
- [x] Build successfully.
- [x] Check the system screen in the in-app browser.
- [x] Check browser console errors (none).

## Follow-up Polish

- P3: cluster positions remain illustrative rather than data-driven; this is acceptable for the current visual prototype.

final result: passed

## 2026-07-14 单位全景业务底图与图层交互重构

- Visual grammar reference: `D:\codex\济南数字化诊断\原型项目\business-tree-overview.png`
- Implementation screenshot: `D:\codex\济南数字化诊断\原型项目\unit-panorama-final.png`
- Combined comparison evidence: `D:\codex\济南数字化诊断\原型项目\unit-panorama-comparison.png`
- State: 单位全景 / 纯业务底图 / 事项层级 / 默认斜视 32°、旋转 -8°

**Findings**

- 无 P0/P1/P2 问题。实现延续深色星空、低亮蓝灰信息层级和轻量连接关系，同时将原有稀疏空间节点升级为卡片式高密度业务树。
- Layout：默认画面可见业务主线、板块、单元与事项的连续关系；相邻簇沿超大画布错落排布，拖动时由循环坐标消除明显边界。
- Typography：事项层标签采用较高密度，主线与板块保持更大字号和更强对比；工具条文本已锁定单行，避免中文控件断行。
- Color：纯底图不引入业务之外的强色；系统、项目、诊断仅在开启互斥叠层后使用青蓝、蓝紫橙与诊断分类色。
- Interaction：浏览器最小检查覆盖事项默认态、系统状态筛选、诊断六类图例与风险筛选、图层互斥切换。
- Responsiveness：当前原型沿用项目既有的 1180px 桌面最小宽度；窄窗口只作为裁切预览，不纳入移动端适配范围。

**Implementation Checklist**

- [x] 12 主线、48 板块、192 单元、768 事项。
- [x] 板块 / 单元 / 事项层级切换，默认事项。
- [x] 系统 / 项目 / 诊断互斥叠层及各自筛选状态。
- [x] 斜视 / 俯视转换、自由俯仰旋转、拖动、缩放、适配、复位。
- [x] 首页单位球体关联线移除。
- [x] 页面构建通过并完成当前页面最小浏览检查。

final result: passed

## 2026-07-14 系统业务树表现形式

- 系统图层新增“系统棋盘 / 业务树”切换，默认仍为系统棋盘。
- 业务树按业务板块、业务单元、业务事项三层横向展示，沿用系统图层的支撑强度色阶与深色科技感连线。
- 业务树与棋盘共用旋转、倾斜、缩放、双击复位和重新扫描；重扫时卡片与连线按从左至右顺序渐进点亮，扫描完成后开放详情点击。

## 2026-07-13 平铺流图参考图复刻与全宽复核

- Source visual truth: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-d4aea0fe-7914-4827-b85f-4822f1fe6547.png`
- Implementation screenshot: `D:\codex\济南数字化诊断\原型项目\flat-flow-reference-rebuild.png`
- Full-view comparison evidence: `D:\codex\济南数字化诊断\原型项目\flat-flow-reference-comparison.png`
- Viewport: 1280 × 720
- State: 单位全景 / 业务 / 平铺流图
- Focused region comparison: 参考图与实现图统一归一到 1280 × 720 后上下拼接对照。

**Findings**

- Layout：复刻为 5 条业务主线、20 个业务板块、40 个业务单元、80 个业务事项的四级密集结构；关系图容器左右各仅约 8px，已基本铺满可用宽度。
- Typography：四级标题、主线卡片、板块、单元及事项均按层级递减；事项列保持双列高密度排布。
- Color：五个业务分区使用青、蓝、紫、紫红的连续高饱和色带，第四层统一使用橙金色。
- Imagery：按用户要求不放图标；没有新增占位图或近似图形资产。
- Polish：连接线为分区渐变三次贝塞尔曲线；静态状态不流动，悬浮或选中分区后才启动对应光点；页面无控制器和底部提示遮挡。
- 参考图是独立全屏关系图，当前实现保留了原系统顶部导航与业务切换工具条；这是既有产品框架中的有意差异，不影响关系图主体复刻。

**Comparison History**

1. 初版完成四级结构，但 SVG 等比适配导致左右出现明显留白。
2. 调整平铺流图专属标题与工具条位置，消除控件重叠并隐藏右侧视角控制器。
3. 将关系图改为全宽非等比铺展，左右空白压缩至约 0.6%，节点列与流线占满整个可用区域。
4. 将逐元素重滤镜改为轻量描边与环境光，保持高饱和效果并避免密集图层截图和交互卡顿。

**Implementation Checklist**

- [x] 5 条一级业务主线。
- [x] 20 个二级业务板块。
- [x] 40 个三级业务单元。
- [x] 80 个四级业务事项。
- [x] 140 条关系连接线。
- [x] 图标数量为 0。
- [x] 静态状态流动动画数量为 0。
- [x] 页面构建通过，浏览器运行错误为 0。

final result: passed

## 2026-07-13 平铺流图高饱和配色与曲线复核

- 设计参考：`C:\Users\46415\.codex\generated_images\019f5981-00f5-7152-ae8f-d6f22e9f5726\exec-9bd263d8-2a5e-45aa-b0dc-4b2a132a4d4f.png`
- 状态：单位全景 / 业务 / 平铺流图。
- 配色：四条主线分别使用高饱和青、蓝、紫、品红卡片，第四层统一使用高亮橙金色。
- 曲线：120 条连接均为带纵向弧度的三次贝塞尔曲线，未保留视觉直线。
- 动效：静态状态光点动画暂停；点击主线后，仅该主线的 30 条关联曲线开始流动。
- 密度：第四层保留 96 个业务事项。
- 页面构建与当前页面展示：通过。

final result: passed

## 2026-07-13 平铺流图视觉复核

- 参考图：`C:\Users\46415\AppData\Local\Temp\codex-clipboard-c8451887-ee6f-44b0-9a16-cf449558d3e4.png`
- 状态：单位全景 / 业务 / 平铺流图。
- 色彩：一级至三级采用高亮青蓝、蓝紫分区；第四层统一暖金色。
- 流线：细束状贝塞尔曲线，分区色向第四层暖金色过渡，并叠加移动光点。
- 数据密度：第四层已渲染 96 个业务事项，较原 48 个翻倍。
- 视角：默认改为接近正视，避免原有大角度俯视压扁信息。
- 页面构建：通过。
- 浏览器运行错误：无。

final result: passed

## 2026-07-13 菱形格选中区域复核

- 参考图：`C:\Users\46415\AppData\Local\Temp\codex-clipboard-ce9fd7ae-ea70-4b7e-8d88-691f5203efcc.png`
- 状态：单位全景 / 系统 / 棋盘格选中
- 检查结果：312 个可点击格子的热区、悬浮区和选中区均裁切为与棋盘一致的菱形。
- 选中反馈：单格高亮、内描边和蓝色外发光均限制在菱形边界内。
- 页面构建：通过。
- 浏览器运行错误：无。

final result: passed

## 2026-07-13 应用全景图接入复核

- Source visual truth: `C:\Users\46415\AppData\Local\Temp\codex-clipboard-7433dcaa-4115-4adf-a675-37fa96b3d085.png`
- Implementation screenshot: `D:\codex\济南数字化诊断\原型项目\application-panorama-implementation.png`
- Full-view comparison evidence: `D:\codex\济南数字化诊断\原型项目\application-panorama-comparison.png`
- Viewport: 1823 × 1430（参考图按页面视口等比归一后对照）
- State: 单位全景 / 系统 / 棋盘格 / 系统卡片 / 应用一张图
- Focused region comparison: 未单独裁切；页面主体为用户提供的完整单张设计图，局部内容未进行代码重绘。

**Findings**

- 无 P0/P1/P2 差异。字体、排版、色彩、图片质量和页面文案均直接来自原设计图；外围容器按用户追加要求改为半透明弹窗。
- 返回按钮使用设计图左上角的原有按钮区域作为透明热区，没有增加额外可见界面。

**Comparison History**

1. 首次接入使用等比适配，较高视口出现上下留白。
2. 调整为全屏铺满，消除留白，并保留完整设计内容与返回热区。
3. 根据追加意见改为居中的半透明玻璃弹窗：设计图作为展示内容，空白底色弱化并透出下层系统棋盘，外围增加模糊遮罩和轻量发光边框。

**Implementation Checklist**

- [x] 点击棋盘格展开系统卡片。
- [x] 点击系统卡片进入应用全景图。
- [x] 点击图内“返回上一页”回到系统棋盘。
- [x] 页面构建通过，浏览器无当前运行错误。

final result: passed
