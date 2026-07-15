import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import systemSupportBasemap from "./assets/system-support-basemap.png";
import systemSupportBasemapEmpty from "./assets/system-support-basemap-empty.png";
import applicationPanoramaDesign from "./assets/application-panorama-design.png";

const units = [
  { id: "city", name: "城市运行管理局", x: 48, y: 47, size: 72, tone: "gold", score: 86 },
  { id: "data", name: "大数据中心", x: 27, y: 31, size: 48, tone: "blue", score: 91 },
  { id: "transport", name: "交通运输局", x: 69, y: 29, size: 52, tone: "blue", score: 78 },
  { id: "water", name: "城乡水务局", x: 74, y: 61, size: 44, tone: "blue", score: 73 },
  { id: "approval", name: "行政审批服务局", x: 23, y: 65, size: 54, tone: "blue", score: 88 },
  { id: "emergency", name: "应急管理局", x: 58, y: 72, size: 42, tone: "blue", score: 80 },
  { id: "housing", name: "住房城乡建设局", x: 39, y: 19, size: 40, tone: "blue", score: 76 },
  { id: "commerce", name: "商务局", x: 83, y: 43, size: 34, tone: "blue", score: 69 },
  { id: "education", name: "教育局", x: 16, y: 43, size: 38, tone: "blue", score: 84 },
  { id: "health", name: "卫生健康委", x: 88, y: 22, size: 42, tone: "blue", score: 87 },
  { id: "culture", name: "文化和旅游局", x: 91, y: 72, size: 33, tone: "blue", score: 71 },
  { id: "market", name: "市场监督管理局", x: 35, y: 82, size: 37, tone: "blue", score: 75 },
  { id: "civil", name: "民政局", x: 10, y: 72, size: 31, tone: "blue", score: 79 },
  { id: "sports", name: "体育局", x: 61, y: 13, size: 28, tone: "blue", score: 68 },
];

const cityBusinessLinks = [
  { from: "data", to: "transport", bend: -8 }, { from: "city", to: "emergency", bend: 7 },
  { from: "water", to: "housing", bend: 8 }, { from: "approval", to: "commerce", bend: -7 },
  { from: "education", to: "health", bend: -5 }, { from: "market", to: "commerce", bend: 6 },
  { from: "civil", to: "health", bend: -4 }, { from: "transport", to: "emergency", bend: 5 },
  { from: "housing", to: "water", bend: -6 }, { from: "data", to: "approval", bend: 5 },
];

const tree = [
  { id: "run", name: "城市运行统筹", y: 18, color: "#50e6ff", blocks: [
    { name: "运行监测", unit: "态势感知", item: "城市运行体征监测", system: "城市运行管理平台", project: "城市生命线提升项目", risk: "数据覆盖待提升" },
    { name: "指挥调度", unit: "协同调度", item: "跨部门事件调度", system: "一体化指挥平台", project: "指挥中心升级项目", risk: "" },
  ]},
  { id: "govern", name: "城市治理监督", y: 38, color: "#7d8cff", blocks: [
    { name: "问题发现", unit: "巡查上报", item: "城市问题主动发现", system: "城市管理综合平台", project: "城市治理精细化项目", risk: "系统功能重叠" },
    { name: "闭环处置", unit: "派遣核查", item: "问题处置闭环", system: "网格化治理平台", project: "基层治理协同项目", risk: "" },
  ]},
  { id: "service", name: "公共服务保障", y: 60, color: "#59c6ff", blocks: [
    { name: "公共服务", unit: "诉求响应", item: "民生诉求快速响应", system: "12345协同平台", project: "热线智能化改造", risk: "接口尚未贯通" },
    { name: "设施保障", unit: "设施监测", item: "市政设施运行保障", system: "市政设施监管平台", project: "物联感知建设项目", risk: "" },
  ]},
  { id: "emergency", name: "应急联动处置", y: 80, color: "#ffa95b", blocks: [
    { name: "预警研判", unit: "风险感知", item: "突发风险综合研判", system: "应急联动平台", project: "应急能力提升项目", risk: "缺少统一模型" },
    { name: "联动处置", unit: "预案执行", item: "多部门应急协同", system: "一体化指挥平台", project: "应急通信保障项目", risk: "" },
  ]},
];

const systemProfiles = {
  "城市运行管理平台": { status: "在用", category: "内部系统", owner: "运行监测处", users: "6个处室", services: "12项业务", data: "28类数据资源", health: 92 },
  "一体化指挥平台": { status: "在用", category: "内部系统", owner: "应急联动处", users: "8个处室", services: "9项业务", data: "19类数据资源", health: 88 },
  "城市管理综合平台": { status: "在用", category: "内部系统", owner: "城市治理处", users: "4个处室", services: "8项业务", data: "16类数据资源", health: 76 },
  "网格化治理平台": { status: "在用", category: "外部系统", owner: "城市治理处", users: "5个处室", services: "6项业务", data: "13类数据资源", health: 82 },
  "12345协同平台": { status: "在用", category: "外部系统", owner: "综合协调处", users: "3个处室", services: "5项业务", data: "11类数据资源", health: 79 },
  "市政设施监管平台": { status: "在建", category: "内部系统", owner: "规划建设处", users: "2个处室", services: "4项业务", data: "9类数据资源", health: 68 },
  "应急联动平台": { status: "已批未建", category: "内部系统", owner: "应急联动处", users: "4个处室", services: "7项业务", data: "规划中", health: 55 },
};

function ParticleField({ mode, burst }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf, width, height, particles = [];
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(185, Math.floor(width / 8)) }, (_, i) => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
        r: Math.random() * 1.4 + .35, a: Math.random() * .55 + .16, warm: i % 23 === 0
      }));
    };
    const onMove = e => mouse.current = { x: e.clientX, y: e.clientY };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y, d = Math.hypot(dx, dy);
        if (d < 150) { const f = (150 - d) / 150; p.vx += dx / (d || 1) * f * .018; p.vy += dy / (d || 1) * f * .018; }
        p.vx *= .994; p.vy *= .994; p.x += p.vx + Math.sin((p.y + performance.now() * .012) * .008) * .035; p.y += p.vy;
        if (p.x < -20) p.x = width + 20; if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20; if (p.y > height + 20) p.y = -20;
        ctx.beginPath(); ctx.fillStyle = p.warm ? `rgba(255,171,82,${p.a})` : `rgba(75,130,255,${p.a})`;
        ctx.shadowBlur = p.r * 7; ctx.shadowColor = p.warm ? "#ff9d4c" : "#376dff";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0; raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", onMove); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [mode]);
  return <canvas ref={canvasRef} className={`particle-field ${burst ? "is-bursting" : ""}`} />;
}

function CityConnections() {
  return <svg className="connections city-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    {cityBusinessLinks.map(link => {
      const from = units.find(unit => unit.id === link.from);
      const to = units.find(unit => unit.id === link.to);
      return <line className="business-thread" key={`${link.from}-${link.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
    })}
  </svg>;
}

function ViewController({ view, setView }) {
  const drag = useRef(null);
  const move = e => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    setView(v => ({ yaw: v.yaw + dx * .45, pitch: Math.max(-34, Math.min(34, v.pitch - dy * .3)) }));
    drag.current = { x: e.clientX, y: e.clientY };
  };
  return <div className="view-controller" onPointerMove={move} onPointerUp={() => drag.current = null} onPointerLeave={() => drag.current = null}>
    <small>三维视角</small>
    <button className="joystick" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY }; }}>
      <i style={{ transform: `translate(${Math.sin(view.yaw / 50) * 10}px, ${-view.pitch / 3}px)` }} />
    </button>
    <em>环绕 / 俯仰</em>
    <div><button onClick={() => setView(v => ({ ...v, yaw: v.yaw - 25, pitch: -14 }))}>‹</button><button onClick={() => setView({ yaw: 0, pitch: 0 })}>复位</button><button onClick={() => setView(v => ({ ...v, yaw: v.yaw + 25, pitch: -14 }))}>›</button></div>
  </div>;
}

function NodeActions({ onDrill, payload }) {
  return <span className="node-actions">
    <button onClick={e => { e.stopPropagation(); onDrill({ ...payload, axis: "horizontal" }); }}>横切</button>
    <button onClick={e => { e.stopPropagation(); onDrill({ ...payload, axis: "vertical" }); }}>纵切</button>
    <button onClick={e => { e.stopPropagation(); onDrill({ ...payload, axis: "profile" }); }}>画像</button>
  </span>;
}

const flowNames = {
  run: {
    blocks: ["运行监测与分析", "综合指挥调度"],
    units: [["城市体征监测", "运行态势研判"], ["事件协同调度", "重点任务督办"]],
    items: ["城市运行指标采集", "城市生命线监测", "重点区域态势感知", "运行异常智能发现", "综合态势分析研判", "领导驾驶舱服务", "跨部门事件受理", "协同任务派发", "处置过程跟踪", "重点任务建账", "任务进度督导", "办理结果评价", "运行指标校核", "指标异常预警", "专题态势分析", "重大活动保障", "值班信息报送", "指挥资源查询", "事件分级响应", "处置时限预警", "跨层级协同", "督办任务提醒", "办理质效分析", "运行报告生成"]
  },
  govern: {
    blocks: ["城市问题治理", "网格协同监督"],
    units: [["问题主动发现", "闭环处置管理"], ["网格巡查管理", "治理效能监督"]],
    items: ["视频智能巡查", "城市问题上报", "公众诉求接入", "问题分类研判", "责任单位派遣", "处置结果核查", "网格员任务管理", "巡查轨迹管理", "重点区域巡检", "治理指标监测", "超期事项督办", "治理成效评价", "问题智能去重", "问题趋势分析", "部件台账查询", "处置时限预警", "疑难问题会商", "复发问题治理", "网格事件统计", "网格力量调度", "巡查计划管理", "治理专题分析", "责任履职评价", "整改结果归档"]
  },
  service: {
    blocks: ["公共服务响应", "设施运行保障"],
    units: [["民生诉求响应", "服务资源调度"], ["市政设施监测", "保障任务处置"]],
    items: ["热线诉求接收", "诉求智能分类", "高频问题分析", "跨部门协同办理", "服务资源查询", "公共资源调度", "道路设施监测", "桥梁运行监测", "照明设施监测", "设施故障告警", "养护任务派发", "保障结果归档", "诉求情绪识别", "诉求热点分析", "服务事项推荐", "服务资源匹配", "资源预约调度", "跨区域资源协同", "设施台账查询", "设施风险预警", "养护计划管理", "抢修力量调度", "保障过程跟踪", "服务满意度评价"]
  },
  emergency: {
    blocks: ["风险预警研判", "应急联动处置"],
    units: [["风险综合感知", "预警信息管理"], ["应急预案执行", "多部门协同处置"]],
    items: ["风险信息汇聚", "隐患动态监测", "风险等级评估", "专题风险研判", "预警信息发布", "预警反馈跟踪", "应急事件接报", "预案智能匹配", "应急力量调度", "现场信息回传", "处置过程协同", "事件复盘评估", "风险源台账", "风险趋势分析", "预警规则配置", "预警范围研判", "应急预案查询", "应急资源盘点", "应急队伍调度", "物资装备调拨", "现场态势标绘", "协同指令下达", "舆情信息跟踪", "复盘报告生成"]
  }
};

function DenseBusinessFlow({ onSelect, onDrill, view }) {
  const [hoverBranch, setHoverBranch] = useState(null);
  const [activeBranch, setActiveBranch] = useState(null);
  const focusBranch = hoverBranch || activeBranch;
  const flowTree = [
    {
      id: "run", name: "政务运行与决策",
      blocks: ["决策支持与科学治理", "综合指挥与协同联动", "财务与资产管理", "人力与组织管理"],
      units: ["战略规划", "政策研究", "监测评估", "协同办公", "指挥调度", "督办落实", "预算管理", "资产管理"],
      items: ["政策法规制定", "重大决策评估", "运行监测分析", "指挥协同研判", "督查督办管理", "重点任务跟踪", "预算执行管理", "收支核算管理", "国有资产管理", "采购事项管理", "岗位体系管理", "人员信息管理", "人才培养发展", "绩效考核管理", "组织机构管理", "编制岗位管理"]
    },
    {
      id: "govern", name: "社会治理与民生服务",
      blocks: ["公共服务与民生保障", "城市运行与应急管理", "社会治理与平安建设", "基层治理与社区服务"],
      units: ["教育医疗", "就业创业", "社会救助", "公安治安", "信访维稳", "应急指挥", "网格管理", "社区治理"],
      items: ["教育资源服务", "医疗卫生服务", "就业创业服务", "社会保障服务", "困难群众救助", "公共安全治理", "治安防控管理", "信访事项办理", "矛盾纠纷调处", "应急事件接报", "应急力量调度", "网格事件管理", "网格力量管理", "社区服务管理", "基层事项办理", "群众诉求响应"]
    },
    {
      id: "industry", name: "经济发展与产业赋能",
      blocks: ["产业发展与招商促进", "市场监管与营商环境", "创新驱动与科技赋能", "开放合作与区域协同"],
      units: ["企业服务", "项目管理", "知识产权", "质量监管", "市场秩序", "数据服务", "科技创新", "对外合作"],
      items: ["企业诉求服务", "项目储备管理", "重点项目推进", "招商线索管理", "产业政策兑现", "知识产权保护", "市场主体监管", "质量安全监管", "价格秩序监管", "营商环境评价", "惠企政策服务", "产业数据分析", "科技成果转化", "创新平台管理", "区域协同发展", "对外合作管理"]
    },
    {
      id: "urban", name: "城市建设与生态环境",
      blocks: ["国土空间与规划管理", "生态环境与绿色发展", "市政设施与公用服务", "交通管理与出行服务"],
      units: ["国土规划", "生态保护", "污染防治", "能源管理", "市政设施", "交通运行", "停车管理", "城市更新"],
      items: ["国土空间规划", "建设项目审批", "土地资源管理", "生态环境监测", "污染源监管", "大气污染防治", "水环境治理", "能源消耗管理", "道路设施管理", "桥梁设施管理", "照明设施管理", "公共交通服务", "交通运行监测", "停车资源管理", "城市更新管理", "建设工程监管"]
    },
    {
      id: "support", name: "支撑保障与基础安全",
      blocks: ["数字基础与数据资源", "网络安全与可信治理", "制度建设与合规管理", "技术支撑与运维保障"],
      units: ["数据治理", "共享交换", "安全管理", "应急响应", "制度规范", "标准规范", "运维管理", "服务保障"],
      items: ["数据目录管理", "数据资源归集", "数据质量管理", "数据共享交换", "公共数据开放", "网络安全监测", "安全事件响应", "密码应用管理", "制度规范管理", "标准体系管理", "合规审查管理", "应用运行监控", "基础设施运维", "技术服务管理", "用户服务管理", "运行保障管理"]
    }
  ];
  const palettes = {
    run: { start: "#19F1FF", end: "#078BFF", surface: "#07577A", deep: "#062846", glow: "rgba(21, 224, 255, 0.58)" },
    govern: { start: "#27A8FF", end: "#425DFF", surface: "#173D84", deep: "#0B214E", glow: "rgba(45, 126, 255, 0.54)" },
    industry: { start: "#7468FF", end: "#9A46FF", surface: "#352374", deep: "#1E1447", glow: "rgba(126, 77, 255, 0.56)" },
    urban: { start: "#9B50FF", end: "#C54CFF", surface: "#47216F", deep: "#291344", glow: "rgba(174, 71, 255, 0.56)" },
    support: { start: "#BB4EFF", end: "#F15EFF", surface: "#55216D", deep: "#30123F", glow: "rgba(217, 78, 255, 0.56)" }
  };
  const colors = Object.fromEntries(Object.entries(palettes).map(([key, value]) => [key, value.start]));
  const layout = flowTree.flatMap((line, branchIndex) => {
    const startY = 78 + branchIndex * 162;
    const blockRows = line.blocks.map((name, blockIndex) => ({ id: `${line.id}-block-${blockIndex}`, name, branch: line.id, blockIndex, x: 580, y: startY + 8 + blockIndex * 36 }));
    const unitRows = line.units.map((name, unitIndex) => ({ id: `${line.id}-unit-${unitIndex}`, name, branch: line.id, blockIndex: Math.floor(unitIndex / 2), unitIndex, x: 990, y: startY + 4 + unitIndex * 17 }));
    const itemRows = line.items.map((name, itemIndex) => ({ id: `${line.id}-item-${itemIndex}`, name, branch: line.id, blockIndex: Math.floor(itemIndex / 4), unitIndex: Math.floor(itemIndex / 2), x: 1353 + itemIndex % 2 * 138, y: startY + 4 + Math.floor(itemIndex / 2) * 17 }));
    return [{ id: line.id, name: line.name, branch: line.id, type: "mainline", x: 160, y: startY + 62 }, ...blockRows, ...unitRows, ...itemRows];
  });
  const nodeById = Object.fromEntries(layout.map(n => [n.id, n]));
  const links = flowTree.flatMap(line => {
    const result = [];
    line.blocks.forEach((_, b) => {
      result.push({ branch: line.id, from: line.id, to: `${line.id}-block-${b}` });
      for (let u = b * 2; u < b * 2 + 2; u++) result.push({ branch: line.id, from: `${line.id}-block-${b}`, to: `${line.id}-unit-${u}` });
    });
    line.units.forEach((_, u) => {
      result.push({ branch: line.id, itemLink: true, from: `${line.id}-unit-${u}`, to: `${line.id}-item-${u * 2}` });
      result.push({ branch: line.id, itemLink: true, from: `${line.id}-unit-${u}`, to: `${line.id}-item-${u * 2 + 1}` });
    });
    return result;
  });
  const halfWidth = node => node.id.includes("-item-") ? 62 : node.id.includes("-unit-") ? 102 : node.id.includes("-block-") ? 118 : 143;
  const curve = link => {
    const a = nodeById[link.from], b = nodeById[link.to];
    const ax = a.x + halfWidth(a), bx = b.x - halfWidth(b);
    const distance = bx - ax;
    const c1 = ax + distance * (link.itemLink ? .22 : .28);
    const c2 = ax + distance * (link.itemLink ? .78 : .72);
    const seed = [...link.to].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const direction = Math.abs(b.y - a.y) < 8 ? (seed % 2 ? 1 : -1) : Math.sign(b.y - a.y);
    const bend = link.itemLink ? 4 : 8;
    const c1y = a.y + direction * bend;
    const c2y = b.y - direction * bend;
    return `M ${ax} ${a.y} C ${c1} ${c1y}, ${c2} ${c2y}, ${bx} ${b.y}`;
  };
  return <div className="dense-flow">
    <div className="flow-ambient" aria-hidden="true">{flowTree.map(line => <i key={line.id} className={`ambient-${line.id}`} />)}</div>
    <div className="flow-world" style={{ transform: `rotateX(${Math.max(0, 2 - view.pitch * .08)}deg) rotateZ(${view.yaw * .03}deg)` }}>
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" onPointerLeave={() => setHoverBranch(null)}>
      <defs>
        {flowTree.map(line => <Fragment key={line.id}>
          <linearGradient id={`branch-${line.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={palettes[line.id].start} />
            <stop offset="1" stopColor={palettes[line.id].end} />
          </linearGradient>
          <linearGradient id={`item-link-${line.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={palettes[line.id].end} />
            <stop offset=".66" stopColor={palettes[line.id].start} />
            <stop offset="1" stopColor="#FFB65F" />
          </linearGradient>
          <linearGradient id={`card-${line.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={palettes[line.id].surface} stopOpacity="1" />
            <stop offset=".62" stopColor={palettes[line.id].deep} stopOpacity=".98" />
            <stop offset="1" stopColor={palettes[line.id].end} stopOpacity=".72" />
          </linearGradient>
        </Fragment>)}
        <linearGradient id="card-sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".1" /><stop offset=".5" stopColor="#ffffff" stopOpacity=".015" /><stop offset="1" stopColor="#000814" stopOpacity=".08" /></linearGradient>
      </defs>
      <g className="flow-links">{links.map((link, i) => <Fragment key={i}><path d={curve(link)} stroke={`url(#${link.itemLink ? "item-link" : "branch"}-${link.branch})`} className={`${link.itemLink ? "item-link" : "level-link"} ${focusBranch && focusBranch !== link.branch ? "muted" : focusBranch === link.branch ? "active" : ""}`} /><path d={curve(link)} stroke={`url(#${link.itemLink ? "item-link" : "branch"}-${link.branch})`} className={`flow-link-pulse ${focusBranch && focusBranch !== link.branch ? "muted" : focusBranch === link.branch ? "active" : ""}`} /></Fragment>)}</g>
      <g className="flow-nodes">{layout.map(node => {
        const isItem = node.id.includes("-item-"), isUnit = node.id.includes("-unit-"), isBlock = node.id.includes("-block-");
        const muted = focusBranch && focusBranch !== node.branch;
        const cardWidth = isItem ? 124 : isUnit ? 204 : isBlock ? 236 : 286;
        const cardHeight = isItem ? 12 : isUnit ? 15 : isBlock ? 30 : 116;
        const cardColor = isItem ? "#FFB65F" : colors[node.branch];
        return <g key={node.id} className={`${isItem ? "flow-item" : isUnit ? "flow-unit" : isBlock ? "flow-block" : "flow-mainline"} ${muted ? "muted" : ""}`} style={{ "--card-color": cardColor, "--card-glow": isItem ? "rgba(255,182,95,.34)" : palettes[node.branch].glow }} transform={`translate(${node.x} ${node.y})`} onPointerEnter={() => setHoverBranch(node.branch)} onClick={() => {
          setActiveBranch(node.branch);
          const payload = { type: isItem ? "business" : node.type || "business", name: node.name, line: flowTree.find(t => t.id === node.branch)?.name };
          if (isItem) onDrill({ ...payload, axis: "vertical" }); else onSelect(payload);
        }}>
          {!isItem && <rect className="flow-card-shadow" x={-cardWidth / 2 + 3} y={-cardHeight / 2 + 5} width={cardWidth} height={cardHeight} rx="4" fill={colors[node.branch]} />}
          <rect className="flow-card-face" x={-cardWidth / 2} y={-cardHeight / 2} width={cardWidth} height={cardHeight} rx={isItem ? "1" : isBlock || isUnit ? "3" : "7"} fill={isItem ? "rgba(255,164,72,.09)" : `url(#card-${node.branch})`} stroke={isItem ? "#FFB65F" : `url(#branch-${node.branch})`} />
          {!isItem && <rect className="flow-card-sheen" x={-cardWidth / 2 + 1.5} y={-cardHeight / 2 + 1.5} width={cardWidth - 3} height={cardHeight - 3} rx="3" fill="url(#card-sheen)" />}
          <path className="flow-card-accent" d={isItem ? `M ${-cardWidth / 2} ${-cardHeight / 2 + 2} V ${cardHeight / 2 - 2}` : `M ${-cardWidth / 2 + 7} ${-cardHeight / 2} H ${cardWidth / 2 - 7}`} stroke={`url(#branch-${node.branch})`} />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="middle">{node.name}</text>
          {isItem && <title>{node.name} · 点击纵向穿透</title>}
        </g>;
      })}</g>
    </svg>
    <div className="flow-columns"><span>一级 → 业务主线</span><span>二级 → 业务板块</span><span>三级 → 业务单元</span><span>四级 → 业务事项</span></div>
    </div>
  </div>;
}

function SpatialBusinessSpheres({ view, onSelect, onDrill }) {
  const [hoverBranch, setHoverBranch] = useState(null);
  const colors = { run: "#35d8ff", govern: "#7687ff", service: "#a164ff", emergency: "#ff9658" };
  const branches = tree.map((line, branchIndex) => {
    const source = flowNames[line.id], baseY = 17 + branchIndex * 22;
    return {
      line,
      main: { id: line.id, name: line.name, x: 14, y: baseY + 6, z: branchIndex % 2 ? 38 : -12, size: 58 },
      blocks: source.blocks.map((name, b) => ({ id: `${line.id}-b-${b}`, name, x: 37 + b * 2, y: baseY + b * 10, z: b ? -36 : 32, size: 34, b })),
      units: source.units.flatMap((pair, b) => pair.map((name, u) => ({ id: `${line.id}-u-${b}-${u}`, name, x: 59 + u * 2, y: baseY + b * 10 + u * 5 - 2, z: (u ? 48 : -25) + b * 10, size: 21, b, u }))),
      items: source.items.map((name, i) => ({ id: `${line.id}-i-${i}`, name, x: 79 + (i % 3) * 6, y: baseY + (i % 6) * 2.8 + Math.floor(i / 6) * 8 - 3, z: (i % 4 - 2) * 24, size: 8 + i % 3, i }))
    };
  });
  const point = n => ({ x: n.x * 10, y: n.y * 7 });
  const links = branches.flatMap(branch => {
    const out = [];
    branch.blocks.forEach(block => {
      out.push({ a: branch.main, b: block, branch: branch.line.id });
      branch.units.filter(u => u.b === block.b).forEach(unit => {
        out.push({ a: block, b: unit, branch: branch.line.id });
        const base = block.b * 6 + unit.u * 3;
        branch.items.slice(base, base + 3).forEach(item => out.push({ a: unit, b: item, branch: branch.line.id }));
      });
    });
    return out;
  });
  const allNodes = branches.flatMap(b => [b.main, ...b.blocks, ...b.units, ...b.items].map(n => ({ ...n, branch: b.line.id })));
  return <div className="sphere-scene">
    <div className="sphere-world" style={{ transform: `rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` }} onPointerLeave={() => setHoverBranch(null)}>
      <svg className="sphere-links" viewBox="0 0 1000 700" preserveAspectRatio="none">
        {links.map((link, i) => {
          const a = point(link.a), b = point(link.b);
          return <path key={i} d={`M ${a.x} ${a.y} C ${a.x + (b.x-a.x)*.45} ${a.y}, ${a.x + (b.x-a.x)*.58} ${b.y}, ${b.x} ${b.y}`} stroke={colors[link.branch]} className={hoverBranch && hoverBranch !== link.branch ? "muted" : hoverBranch === link.branch ? "active" : ""} />;
        })}
      </svg>
      {allNodes.map(node => {
        const type = node.id === node.branch ? "main" : node.id.includes("-b-") ? "block" : node.id.includes("-u-") ? "unit" : "item";
        return <button key={node.id} className={`sphere-node sphere-${type} ${hoverBranch && hoverBranch !== node.branch ? "muted" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%`, "--sphere-size": `${node.size}px`, "--sphere-color": colors[node.branch], "--z": `${node.z}px` }} onPointerEnter={() => setHoverBranch(node.branch)} onClick={() => {
          const payload = { type: type === "item" ? "business" : type, name: node.name, line: tree.find(t => t.id === node.branch)?.name };
          if (type === "item") onDrill({ ...payload, axis: "vertical" }); else onSelect(payload);
        }}>
          <i /><b>{node.name}</b><span>{type === "main" ? "业务主线" : type === "block" ? "业务板块" : type === "unit" ? "业务单元" : "业务事项"}</span>
        </button>;
      })}
    </div>
    <div className="sphere-key"><span><i className="key-main" />主线</span><span><i className="key-block" />板块</span><span><i className="key-unit" />单元</span><span><i className="key-item" />事项</span></div>
    <div className="flow-tip">拖动右下角操纵杆旋转视角 · 悬浮球体高亮完整业务链</div>
  </div>;
}

const grainOrder = ["业务主线", "业务板块", "业务单元", "业务事项"];

const densityColors = {
  empty: { top: [10, 27, 50], edge: [37, 95, 151], glow: "rgba(31,111,190,0.16)" },
  low: { top: [12, 191, 255], edge: [108, 226, 255], glow: "rgba(19,190,255,0.72)" },
  medium: { top: [116, 66, 255], edge: [188, 151, 255], glow: "rgba(124,76,255,0.72)" },
  high: { top: [255, 143, 62], edge: [255, 218, 142], glow: "rgba(255,135,54,0.78)" },
};

const densityClusters = {
  high: [[3, 4, 1.45], [6, 14, 1.25], [11, 8, 1.45], [13, 16, 1.2]],
  medium: [[2, 9, 1.7], [4, 16, 1.55], [6, 6, 1.65], [8, 12, 1.7], [10, 3, 1.5], [12, 13, 1.7], [14, 7, 1.45]],
  low: [[1, 5, 1.35], [2, 13, 1.3], [4, 10, 1.45], [5, 2, 1.25], [7, 17, 1.35], [8, 7, 1.4], [10, 18, 1.2], [12, 4, 1.35], [13, 10, 1.35], [14, 15, 1.25]],
};

function getDensity(row, column, depth) {
  const hit = ([r, c, radius]) => {
    const irregularity = ((row * 17 + column * 11 + depth * 5) % 7 - 3) * .06;
    return Math.hypot((row - r) * 1.05, (column - c) * .82) <= radius + irregularity;
  };
  if (densityClusters.high.some(hit)) return "high";
  if (densityClusters.medium.some(hit)) return "medium";
  if (densityClusters.low.some(hit)) return "low";
  return "empty";
}

function IsometricGridCanvas({ cells, columns, rows, runKey, selectedId, onSelect, onPhaseChange }) {
  const canvasRef = useRef(null);
  const layoutRef = useRef([]);
  const cellsRef = useRef(cells);
  cellsRef.current = cells;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d", { alpha: true });
    let raf = 0;
    let startAt = 0;
    let width = 1;
    let height = 1;
    let lastPhase = "";
    const holdDuration = 250;
    const travelDuration = 3250;
    const localDuration = 700;
    const totalDuration = 4200;
    const reportPhase = phase => {
      if (phase === lastPhase) return;
      lastPhase = phase;
      onPhaseChange(phase);
    };

    const polygon = (points, fill, stroke, lineWidth = 1) => {
      ctx.beginPath();
      points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
    };
    const rgb = color => `rgb(${color.map(value => Math.round(value)).join(",")})`;
    const rgba = (color, alpha) => `rgba(${color.map(value => Math.round(value)).join(",")},${alpha})`;
    const mix = (from, to, amount) => from.map((value, index) => value + (to[index] - value) * amount);
    const easeOut = value => 1 - Math.pow(1 - Math.max(0, Math.min(1, value)), 3);

    const drawPlatform = (positions, tileW, tileH) => {
      const byId = new Map(positions.map(position => [position.cell.id, position]));
      const p00 = byId.get("0-0") || positions[0];
      const pRight = byId.get(`0-${columns - 1}`) || positions[positions.length - 1];
      const pBottom = byId.get(`${rows - 1}-${columns - 1}`) || positions[positions.length - 1];
      const pLeft = byId.get(`${rows - 1}-0`) || positions[0];
      const base = [
        { x: p00.x, y: p00.y - tileH * .72 },
        { x: pRight.x + tileW * .56, y: pRight.y },
        { x: pBottom.x, y: pBottom.y + tileH * .72 },
        { x: pLeft.x - tileW * .56, y: pLeft.y },
      ];
      ctx.save();
      ctx.shadowBlur = 48;
      ctx.shadowColor = "rgba(20,116,255,.5)";
      [26, 17, 9].forEach((offset, index) => polygon(base.map(point => ({ x: point.x, y: point.y + offset })), `rgba(${4 + index * 3},${18 + index * 6},${42 + index * 12},.94)`, `rgba(42,154,255,${.34 + index * .18})`, index === 2 ? 2 : 1));
      polygon(base, "rgba(4,17,38,.92)", "rgba(85,194,255,.7)", 1.4);
      ctx.restore();
    };

    const drawTile = (position, lift, reveal, flash) => {
      const { cell, x, y, tileW, tileH } = position;
      const finalTone = densityColors[cell.density];
      const darkTone = densityColors.empty;
      const revealed = mix(darkTone.top, finalTone.top, cell.density === "empty" ? 0 : reveal);
      const topColor = cell.density === "empty" ? darkTone.top : mix(revealed, finalTone.top, flash * .18);
      const edgeColor = cell.density === "empty" ? mix(darkTone.edge, [72, 133, 182], flash * .12) : mix(darkTone.edge, finalTone.edge, Math.min(1, reveal + flash * .2));
      const topY = y - lift;
      const depth = 7 + lift;
      const halfW = tileW * .445;
      const halfH = tileH * .445;
      const top = { x, y: topY - halfH };
      const right = { x: x + halfW, y: topY };
      const bottom = { x, y: topY + halfH };
      const left = { x: x - halfW, y: topY };
      const lowerRight = { x: x + halfW, y: y + 7 };
      const lowerBottom = { x, y: y + halfH + 7 };
      const lowerLeft = { x: x - halfW, y: y + 7 };
      const active = cell.density !== "empty" && reveal > .05;

      ctx.save();
      if (active) {
        ctx.shadowBlur = 8 + flash * 16 + reveal * 6;
        ctx.shadowColor = finalTone.glow;
      }
      polygon([left, bottom, lowerBottom, lowerLeft], rgba(mix(topColor, [2, 11, 31], .58), .94), rgba(edgeColor, .78));
      polygon([right, bottom, lowerBottom, lowerRight], rgba(mix(topColor, [1, 8, 27], .7), .96), rgba(edgeColor, .7));
      const gradient = ctx.createLinearGradient(x, top.y, x, bottom.y);
      gradient.addColorStop(0, rgba(mix(topColor, [224, 246, 255], active ? .18 : .06), active ? .96 : .58));
      gradient.addColorStop(.42, rgba(topColor, active || flash ? .94 : .5));
      gradient.addColorStop(1, rgba(mix(topColor, [2, 12, 33], .42), active || flash ? .9 : .58));
      polygon([top, right, bottom, left], gradient, rgba(edgeColor, flash > .05 ? .98 : .78), flash > .05 ? 1.7 : 1.05);
      const inset = .77;
      polygon([
        { x, y: topY - halfH * inset }, { x: x + halfW * inset, y: topY },
        { x, y: topY + halfH * inset }, { x: x - halfW * inset, y: topY },
      ], "rgba(255,255,255,.025)", `rgba(190,238,255,${active ? .23 : .08})`, .7);
      ctx.beginPath();
      ctx.moveTo(left.x + tileW * .08, left.y - tileH * .035);
      ctx.lineTo(top.x, top.y + tileH * .075);
      ctx.lineTo(right.x - tileW * .08, right.y - tileH * .035);
      ctx.strokeStyle = `rgba(225,250,255,${cell.density === "empty" ? .07 + flash * .1 : .12 + flash * .18 + (active ? .12 : 0)})`;
      ctx.lineWidth = .85;
      ctx.stroke();
      ctx.restore();
    };

    const render = now => {
      raf = 0;
      const elapsed = Math.max(0, now - startAt);
      const masterProgress = Math.max(0, Math.min(1, (elapsed - holdDuration) / travelDuration));
      host.style.setProperty("--wave-progress", `${-12 + masterProgress * 124}%`);
      reportPhase(elapsed < holdDuration ? "idle" : elapsed < totalDuration ? "running" : "settled");
      ctx.clearRect(0, 0, width, height);
      const tileW = Math.min(72, width * 1.68 / (columns + rows));
      const tileH = tileW * .48;
      const originX = width * .51;
      const originY = Math.max(72, height * .115);
      const positions = cellsRef.current.map(cell => ({
        cell,
        x: originX + (cell.column - cell.row) * tileW / 2,
        y: originY + (cell.column + cell.row) * tileH / 2,
        tileW,
        tileH,
      })).sort((a, b) => a.y - b.y || a.x - b.x);
      layoutRef.current = positions;
      const minX = Math.min(...positions.map(position => position.x));
      const maxX = Math.max(...positions.map(position => position.x));
      positions.forEach(position => {
        const horizontal = (position.x - minX) / Math.max(1, maxX - minX);
        const curveOffset = Math.sin(position.cell.row * .66 + position.cell.column * .05) * 16 + Math.sin(position.cell.row * .24 + position.cell.column * .31) * 8;
        const noiseOffset = (((position.cell.row * 37 + position.cell.column * 19) % 17) - 8) * 1.45;
        const delay = Math.max(holdDuration, Math.min(holdDuration + travelDuration, holdDuration + horizontal * travelDuration + curveOffset + noiseOffset));
        const local = elapsed - delay;
        let lift = 0;
        let flash = 0;
        let reveal = local > 0 ? 0 : 0;
        if (local < 0) {
          return;
        } else if (local < 240) {
          const progress = Math.sin(local / 240 * Math.PI / 2);
          lift = 3.5 * progress;
          flash = .3 * progress;
          reveal = position.cell.density === "empty" ? 0 : progress;
        } else if (local < 340) {
          const progress = (local - 240) / 100;
          lift = 3.5 - progress * .25;
          flash = .3 - progress * .08;
          reveal = position.cell.density === "empty" ? 0 : 1;
        } else if (local < localDuration) {
          const progress = .5 - Math.cos((local - 340) / 360 * Math.PI) / 2;
          lift = 3.25 * (1 - progress);
          flash = .22 * (1 - progress);
          reveal = position.cell.density === "empty" ? 0 : 1;
        } else {
          return;
        }
        drawTile(position, lift, reveal, flash);
      });
      if (elapsed < totalDuration) raf = requestAnimationFrame(render);
    };

    const measure = () => {
      const bounds = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(() => {
      measure();
      if (!raf) raf = requestAnimationFrame(render);
    });
    measure();
    host.style.setProperty("--wave-progress", "-12%");
    reportPhase("idle");
    startAt = performance.now();
    observer.observe(host);
    raf = requestAnimationFrame(render);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [columns, rows, runKey]);

  const selectTile = event => {
    const bounds = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const match = [...layoutRef.current].reverse().find(position => {
      const dx = Math.abs(x - position.x) / (position.tileW * .45);
      const dy = Math.abs(y - position.y) / (position.tileH * .45);
      return dx + dy <= 1;
    });
    if (match?.cell.density !== "empty") onSelect(match.cell);
  };

  return <canvas ref={canvasRef} className={`system-isometric-canvas ${selectedId ? "has-selection" : ""}`} onClick={selectTile} aria-label="2.5D 业务支撑网格" />;
}

function BasemapRevealTimeline({ runKey, onPhaseChange }) {
  const markerRef = useRef(null);
  useEffect(() => {
    const host = markerRef.current.parentElement;
    const holdDuration = 250;
    const travelDuration = 3250;
    const totalDuration = 4200;
    let raf = 0;
    let lastPhase = "";
    const startAt = performance.now();
    const reportPhase = phase => {
      if (phase === lastPhase) return;
      lastPhase = phase;
      onPhaseChange(phase);
    };
    const render = now => {
      const elapsed = Math.max(0, now - startAt);
      const progress = Math.max(0, Math.min(1, (elapsed - holdDuration) / travelDuration));
      host.style.setProperty("--wave-progress", `${-12 + progress * 124}%`);
      reportPhase(elapsed < holdDuration ? "idle" : elapsed < totalDuration ? "running" : "settled");
      if (elapsed < totalDuration) raf = requestAnimationFrame(render);
    };
    host.style.setProperty("--wave-progress", "-12%");
    reportPhase("idle");
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [runKey, onPhaseChange]);
  return <span ref={markerRef} className="basemap-timeline-marker" aria-hidden="true" />;
}

const holographicTone = {
  low: "#21c8ff",
  medium: "#8358ff",
  high: "#ff994b",
};

function HolographicStack({ target, onClose, onOpenApplication }) {
  const systems = [
    { name: "城市运行监测系统", category: "运行监测", coverage: "28项", status: "在用", tone: "cyan" },
    { name: "事件协同处置系统", category: "协同处置", coverage: "16项", status: "在建", tone: "orange" },
    { name: "数据资源中心", category: "数据支撑", coverage: "34项", status: "在用", tone: "cyan" },
  ];
  const [activeIndex, setActiveIndex] = useState(1);
  const [interactionReady, setInteractionReady] = useState(false);
  useEffect(() => {
    setActiveIndex(1);
    setInteractionReady(false);
    const timer = setTimeout(() => setInteractionReady(true), 860);
    return () => clearTimeout(timer);
  }, [target.id]);
  const changeLevel = delta => setActiveIndex(index => (index + delta + systems.length) % systems.length);
  const panelShift = target.anchorY < 35 ? 280 : target.anchorY < 55 ? 160 : 0;
  return <div className="holographic-projection" style={{ left: `${target.anchorX}%`, top: `${target.anchorY}%`, "--holo-color": holographicTone[target.density], "--panel-shift": `${panelShift}px` }}>
    <div className="holo-anchor-ring" />
    <div className="holo-beam"><i /><i /><i /></div>
    <section className={`holo-stack ${interactionReady ? "is-ready" : ""}`} onWheel={event => { event.preventDefault(); event.stopPropagation(); if (interactionReady) changeLevel(event.deltaY > 0 ? 1 : -1); }}>
      <button className="holo-close" onClick={onClose} aria-label="关闭全息面板">×</button>
      {systems.map((system, index) => {
        return <button key={system.name} className={`holo-card holo-tone-${system.tone} ${activeIndex === index ? "active" : ""}`} style={{ "--card-index": index, "--card-delay": `${index * 110}ms` }} onPointerEnter={() => interactionReady && setActiveIndex(index)} onClick={() => {
          if (!interactionReady) return;
          setActiveIndex(index);
          onOpenApplication({ type: "application", name: system.name, ...system });
        }}>
          <div className="holo-card-copy"><b>{system.name}</b><small>{system.category}<i />关联事项 {system.coverage}</small></div>
          <span>{system.status}</span>
        </button>;
      })}
    </section>
  </div>;
}

function SystemBusinessTree({ grain, scanPhase, scanRun, sliceTarget, setSliceTarget, onOpenApplication }) {
  const depth = grainOrder.indexOf(grain);
  // Oversized coordinate plane: every business tree is a standalone cluster,
  // not a row in a fixed three-column diagram.
  const canvas = { width: 3600, height: 2200 };
  const clusterLayouts = [
    { x: 92, y: 118 }, { x: 1238, y: 392 }, { x: 2465, y: 168 }, { x: 356, y: 980 },
    { x: 1644, y: 1136 }, { x: 2752, y: 1310 }, { x: -244, y: 1694 }, { x: 1058, y: 1818 },
  ];
  const cardWidth = { block: 222, unit: 208, item: 265 };
  const branches = tree.flatMap((line, lineIndex) => {
    const source = flowNames[line.id];
    return source.blocks.slice(0, 2).map((block, blockIndex) => {
      const itemOffset = blockIndex * 4;
      const units = source.units[blockIndex] || [];
      const items = source.items.slice(itemOffset, itemOffset + 4);
      const row = lineIndex * 2 + blockIndex;
      const origin = clusterLayouts[row];
      const makeTarget = (name, level, index, x, y) => ({
      id: `tree-${line.id}-${blockIndex}-${level}-${index}`,
      name,
      lineId: line.id,
      lineIndex,
      block,
      x, y,
      systems: ["城市数据中台", "统一身份认证平台", "视频资源共享平台", "协同办公平台"].slice(0, 2 + ((row + index) % 3)),
      density: ["low", "medium", "high", "low", "medium"][(row * 3 + index + depth) % 5],
      });
      return {
        id: `${line.id}-${blockIndex}`,
        block: makeTarget(block, "block", 0, origin.x, origin.y + 124),
        units: units.map((name, index) => makeTarget(name, "unit", index, origin.x + 326, origin.y + (index ? 204 : 42))),
        items: items.map((name, index) => makeTarget(name, "item", index, origin.x + 676, origin.y + 8 + index * 76)),
      };
    });
  });
  const elbow = (from, fromType, to) => {
    const sourceX = from.x + cardWidth[fromType];
    const turnX = sourceX + Math.max(44, (to.x - sourceX) * .46);
    return `${sourceX} ${from.y}, ${turnX} ${from.y}, ${turnX} ${to.y}, ${to.x} ${to.y}`;
  };
  const targetCard = (target, type) => <button key={target.id} className={`system-tree-card ${type} tone-${target.density} ${sliceTarget?.id === target.id ? "selected" : ""}`} style={{ "--tree-x": `${target.x}px`, "--tree-y": `${target.y}px`, "--tree-w": `${cardWidth[type]}px`, "--scan-delay": `${160 + target.x * .92 + target.y * .045}ms` }} disabled={scanPhase !== "settled"} onClick={() => setSliceTarget(current => current?.id === target.id ? null : target)}>
    <i /><b>{target.name}</b><span>{type === "block" ? "业务板块" : type === "unit" ? "业务单元" : `支撑强度 · ${target.density === "high" ? "高" : target.density === "medium" ? "中" : "低"}`}</span>
  </button>;
  return <div className={`system-business-tree phase-${scanPhase}`} key={`${grain}-${scanRun}`} style={{ "--tree-canvas-w": `${canvas.width}px`, "--tree-canvas-h": `${canvas.height}px` }}>
    <div className="tree-canvas-label">BUSINESS RELATIONSHIP SPACE · CONTINUOUS CANVAS</div>
    <svg className="system-tree-lines" viewBox={`0 0 ${canvas.width} ${canvas.height}`} aria-hidden="true">
      {branches.map(branch => <g key={branch.id} style={{ "--line-delay": `${150 + branch.block.x * .92 + branch.block.y * .045}ms` }}>
        {branch.units.map((unit, unitIndex) => <polyline key={`unit-${unitIndex}`} points={elbow(branch.block, "block", unit)} />)}
        {branch.items.map((item, itemIndex) => <polyline key={`item-${itemIndex}`} points={elbow(branch.units[Math.floor(itemIndex / 2)], "unit", item)} />)}
      </g>)}
    </svg>
    {branches.map((branch, branchIndex) => <Fragment key={branch.id}>
      {targetCard(branch.block, "block")}
      {branch.units.map(target => targetCard(target, "unit"))}
      {branch.items.map(target => targetCard(target, "item"))}
    </Fragment>)}
    {sliceTarget && <HolographicStack target={sliceTarget} onClose={() => setSliceTarget(null)} onOpenApplication={onOpenApplication} />}
  </div>;
}

function SystemTerrain({ grain, onOpenApplication, systemView }) {
  const depth = grainOrder.indexOf(grain);
  const [terrainView, setTerrainView] = useState({ yaw: 0, pitch: 0 });
  const [terrainZoom, setTerrainZoom] = useState(1);
  const [sliceTarget, setSliceTarget] = useState(null);
  const [scanRun, setScanRun] = useState(0);
  const [scanPhase, setScanPhase] = useState("idle");
  const drag = useRef(null);
  const demoSystems = ["城市数据中台", "统一身份认证平台", "视频资源共享平台", "协同办公平台"];
  const targetList = tree.flatMap((line, lineIndex) => {
    const source = flowNames[line.id];
    if (depth === 0) return [{ id: line.id, name: line.name, blocks: line.blocks, lineIndex }];
    if (depth === 1) return source.blocks.map((name, blockIndex) => ({ id: `${line.id}-block-${blockIndex}`, name, blocks: [line.blocks[blockIndex]], lineIndex, blockIndex }));
    if (depth === 2) return source.units.flatMap((pair, blockIndex) => pair.map((name, unitIndex) => ({ id: `${line.id}-unit-${blockIndex}-${unitIndex}`, name, blocks: [line.blocks[blockIndex]], lineIndex, blockIndex, unitIndex })));
    return source.items.map((name, itemIndex) => {
      const itemsPerBlock = Math.ceil(source.items.length / source.blocks.length);
      const blockIndex = Math.min(source.blocks.length - 1, Math.floor(itemIndex / itemsPerBlock));
      return { id: `${line.id}-item-${itemIndex}`, name, blocks: [line.blocks[blockIndex]], lineIndex, blockIndex, itemIndex };
    });
  }).map((target, index) => {
    const base = [...new Set(target.blocks.map(block => block.system))];
    const extras = [0, 0, 1, 0, 2, 0, 1, 3][index % 8];
    return { ...target, systems: [...new Set([...base, ...demoSystems.slice(0, extras)])] };
  });
  const columns = 20, rows = 16;
  const cells = Array.from({ length: columns * rows }, (_, index) => {
    const row = Math.floor(index / columns), column = index % columns;
    const corner = (row < 1 || row > 14) && (column < 2 || column > 17);
    const target = targetList[(row * 3 + column * 5 + depth) % targetList.length];
    const density = getDensity(row, column, depth);
    return { id: `${row}-${column}`, row, column, target, density, corner };
  }).filter(cell => !cell.corner);
  const waveColumns = 28, waveRows = 20;
  const waveCells = Array.from({ length: waveColumns * waveRows }, (_, index) => {
    const row = Math.floor(index / waveColumns), column = index % waveColumns;
    const sourceRow = Math.round(row / (waveRows - 1) * (rows - 1));
    const sourceColumn = Math.round(column / (waveColumns - 1) * (columns - 1));
    const target = targetList[(sourceRow * 3 + sourceColumn * 5 + depth) % targetList.length];
    return { id: `wave-${row}-${column}`, row, column, target, density: getDensity(sourceRow, sourceColumn, depth) };
  });
  const interactiveCells = cells.map(cell => ({
    ...cell.target,
    id: `grid-${cell.id}`,
    cellId: cell.id,
    row: cell.row,
    column: cell.column,
    anchorX: 11 + (cell.column + .5) / columns * 78,
    anchorY: 13 + (cell.row + .5) / rows * 74,
    density: cell.density === "empty" ? "low" : cell.density,
    systems: [...new Set([...cell.target.systems, ...demoSystems])].slice(0, 4),
  }));
  useEffect(() => setSliceTarget(null), [grain]);
  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const tick = now => {
      const elapsed = now - startedAt;
      setScanPhase(elapsed < 250 ? "idle" : elapsed < 4200 ? "running" : "settled");
      if (elapsed < 4200) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [scanRun]);
  const moveTerrain = event => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y;
    setTerrainView(view => ({ yaw: Math.max(-28, Math.min(28, view.yaw + dx * .22)), pitch: Math.max(-25, Math.min(25, view.pitch - dy * .18)) }));
    drag.current = { x: event.clientX, y: event.clientY };
  };
  return <div className="system-grid-scene" onDoubleClick={() => { setTerrainView({ yaw: 0, pitch: 0 }); setTerrainZoom(1); }} onPointerDown={event => {
    if (event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
  }} onPointerMove={moveTerrain} onPointerUp={() => drag.current = null} onPointerCancel={() => drag.current = null} onWheel={event => {
    event.preventDefault(); setTerrainZoom(value => Math.max(.72, Math.min(1.45, value - event.deltaY * .001)));
  }}>
    {systemView === "board" ? <div className={`system-basemap phase-${scanPhase}`} style={{ transform: `translate(-50%, -50%) translateY(${terrainView.pitch * .18}px) rotate(${terrainView.yaw * .08}deg) scale(${terrainZoom})` }}>
      <img className="system-basemap-image system-basemap-image-empty" src={systemSupportBasemapEmpty} alt="业务支撑空态底图" draggable="false" />
      <img className="system-basemap-image system-basemap-image-final" src={systemSupportBasemap} alt="业务支撑密度底图" draggable="false" />
      <img className="system-basemap-image system-basemap-image-ridge" src={systemSupportBasemap} alt="" draggable="false" />
      <BasemapRevealTimeline runKey={`${grain}-${scanRun}`} onPhaseChange={setScanPhase} />
      <div className="system-basemap-hitmap" aria-label="可交互业务矩阵">
        {interactiveCells.map(cell => <div key={cell.id} className="system-basemap-hitcell" style={{ gridColumn: cell.column + 1, gridRow: cell.row + 1, "--node-color": holographicTone[cell.density] }}><button aria-label={`查看${cell.name}`} className={sliceTarget?.id === cell.id ? "selected" : ""} onClick={() => setSliceTarget(current => current?.id === cell.id ? null : cell)} /><span>{cell.name}</span></div>)}
      </div>
      {sliceTarget && <HolographicStack target={sliceTarget} onClose={() => setSliceTarget(null)} onOpenApplication={onOpenApplication} />}
    </div> : <div className="system-tree-stage" style={{ transform: `translateY(${terrainView.pitch * .18}px) rotate(${terrainView.yaw * .08}deg) scale(${terrainZoom})` }}><SystemBusinessTree grain={grain} scanPhase={scanPhase} scanRun={scanRun} sliceTarget={sliceTarget} setSliceTarget={setSliceTarget} onOpenApplication={onOpenApplication} /></div>}
    <aside className="grid-metric-panel">{[["4","主线","梳理核心业务线"],["8","板块","系统功能分类"],["16","单位","业务责任单位"],["32","事项","诊断追踪点"]].map(([value,label,tip]) => <div key={label}><i /><b>{value}</b><span>{label}</span><small>{tip}</small></div>)}</aside>
    <aside className="grid-legend"><small>数据密度图例<br /><em>DATA DENSITY LEGEND</em></small><span><i className="legend-high" />高密度</span><span><i className="legend-medium" />中密度</span><span><i className="legend-low" />低密度</span></aside>
    <aside className="grid-density"><small>系统覆盖度</small><div className="density-ring"><b>78%</b></div><p><span>低密度</span><i style={{ width: "68%" }} />68%</p><p><span>中密度</span><i style={{ width: "24%" }} />24%</p><p><span>高密度</span><i style={{ width: "8%" }} />8%</p></aside>
    <ViewController view={terrainView} setView={setTerrainView} />
    <div className="map-control-stack matrix-map-controls">
      <button onClick={() => setTerrainZoom(value => Math.min(1.45, value + .12))} title="放大" aria-label="放大">＋</button>
      <button onClick={() => setTerrainZoom(value => Math.max(.72, value - .12))} title="缩小" aria-label="缩小">−</button>
      <button onClick={() => { setTerrainView({ yaw: 0, pitch: 0 }); setTerrainZoom(1); }} title="复位" aria-label="复位">↺</button>
      <button className={terrainView.pitch ? "active" : ""} onClick={() => setTerrainView(value => ({ ...value, pitch: value.pitch ? 0 : -18 }))} title="倾斜视角" aria-label="倾斜视角">◇</button>
    </div>
    <div className="grid-hint"><button disabled={scanPhase !== "settled"} onClick={() => { setSliceTarget(null); setScanRun(value => value + 1); }}>{scanPhase === "settled" ? "重新扫描" : scanPhase === "idle" ? "准备点亮" : "扫描中"}</button><span>左 → 右点亮　·　拖动 / 滑轮缩放　·　双击复位</span></div>
  </div>;
}

function BusinessTree({ activeLayer, selected, setSelected, timeline, lens, view, onDrill, businessView, systemGrain, systemView }) {
  if (activeLayer === "业务") return <div className={`business-morph morph-${businessView}`}>
    <div className="morph-layer morph-sphere"><SpatialBusinessSpheres view={view} onSelect={setSelected} onDrill={onDrill} /></div>
    <div className="morph-layer morph-flat"><DenseBusinessFlow onSelect={setSelected} onDrill={onDrill} view={view} /></div>
  </div>;
  if (activeLayer === "系统") return <SystemTerrain grain={systemGrain} onOpenApplication={onDrill} systemView={systemView} />;
  const layerColor = activeLayer === "系统" ? "#a282ff" : activeLayer === "项目" ? "#ffad5b" : activeLayer === "诊断" ? "#ff5f73" : "#52d6ff";
  return <div className="tree-perspective"><div className={`business-tree layer-${activeLayer} ${lens ? "lens-on" : ""}`} style={{ transform: `rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` }}>
    <svg className="tree-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
      {tree.map(line => <g key={line.id}>
        <path d={`M 10 50 C 20 50, 21 ${line.y}, 30 ${line.y}`} />
        {line.blocks.map((b, i) => {
          const by = line.y + (i ? 4.4 : -4.4);
          return <g key={b.name}>
            <path d={`M 30 ${line.y} C 37 ${line.y}, 38 ${by}, 43 ${by}`} />
            <path d={`M 48 ${by} L 58 ${by}`} />
            <path d={`M 63 ${by} L 73 ${by}`} />
            <path d={`M 78 ${by} L 88 ${by}`} />
          </g>;
        })}
      </g>)}
    </svg>
    <button className="tree-root" onClick={() => setSelected({ type: "unit", name: "济南市城市运行管理局" })}>
      <i /><b>城市运行管理局</b><span>单位业务全景</span>
    </button>
    {tree.map(line => <div key={line.id}>
      <button className={`tree-mainline ${selected?.id === line.id ? "selected" : ""}`} style={{ left: "30%", top: `${line.y}%`, "--branch": line.color }} onClick={() => setSelected({ type: "mainline", ...line })}>
        <i /><b>{line.name}</b><span>业务主线</span>
      </button>
      {line.blocks.map((block, i) => {
        const y = line.y + (i ? 4.4 : -4.4);
        const risk = activeLayer === "诊断" && block.risk;
        return <div key={block.name}>
          <button className="tree-node block" style={{ left: "45%", top: `${y}%` }} onClick={() => setSelected({ type: "block", line: line.name, ...block })}><i style={{ background: layerColor }} /><b>{block.name}</b><span>业务板块</span></button>
          <button className="tree-node unit" style={{ left: "60%", top: `${y}%` }} onClick={() => setSelected({ type: "business", line: line.name, block: block.name, ...block })}><i /><b>{block.unit}</b><span>业务单元</span></button>
          <div role="button" tabIndex="0" className={`tree-node item ${risk ? "risk" : ""}`} style={{ left: "75%", top: `${y}%`, "--depth": `${(i + 1) * 8}px` }} onClick={() => setSelected({ type: "business", line: line.name, block: block.name, ...block })}><i /><b>{block.item}</b><span>{risk || "业务事项"}</span><NodeActions onDrill={onDrill} payload={{ type: "business", name: block.item, line: line.name, ...block }} /></div>
          {activeLayer !== "业务" && <div role="button" tabIndex="0" className={`tree-node overlay ${activeLayer} coverage-${Math.min(3, Math.ceil((systemProfiles[block.system]?.health || 60) / 30))}`} style={{ left: "90%", top: `${y}%`, "--thickness": `${Math.max(7, (systemProfiles[block.system]?.health || 60) / 5)}px` }} onClick={() => setSelected(activeLayer === "系统" ? { type: "system", name: block.system, ...systemProfiles[block.system], business: block.item } : activeLayer === "项目" ? { type: "project", name: block.project, business: block.item, timeline } : { type: "diagnosis", name: block.risk || "支撑关系健康", business: block.item, system: block.system })}>
            <i /><b>{activeLayer === "系统" ? block.system : activeLayer === "项目" ? block.project : block.risk || "支撑健康"}</b><span>{activeLayer}{activeLayer === "系统" ? ` · 覆盖${Math.round((systemProfiles[block.system]?.health || 60) / 8)}项` : activeLayer === "项目" ? ` · ${timeline}` : ""}</span><NodeActions onDrill={onDrill} payload={{ type: activeLayer, name: activeLayer === "系统" ? block.system : activeLayer === "项目" ? block.project : block.risk || "支撑健康", business: block.item, ...systemProfiles[block.system] }} />
          </div>}
        </div>;
      })}
    </div>)}
    <div className="tree-depth"><span>单位</span><span>业务主线</span><span>业务板块</span><span>业务单元</span><span>业务事项</span><span>{activeLayer === "业务" ? "关联图层" : activeLayer}</span></div>
  </div></div>;
}

const panoramaLines = [
  "城市运行统筹", "城市治理监督", "公共服务保障", "应急联动处置",
  "数字政府协同", "数据资源治理", "城市安全韧性", "民生服务提升",
  "生态环境治理", "交通运行保障", "城市建设管理", "市场监管服务"
];
const blockSuffixes = ["运行监测", "指挥调度", "协同处置", "评估复盘"];
const unitSuffixes = ["受理分析", "任务编排", "执行协同", "成效反馈"];
const itemSuffixes = ["信息采集", "业务研判", "联动办理", "结果归档"];

function createPanoramaModel() {
  const nodes = [];
  const links = [];
  panoramaLines.forEach((lineName, lineIndex) => {
    const col = lineIndex % 4;
    const row = Math.floor(lineIndex / 4);
    const ox = 180 + col * 1650 + (row % 2) * 150;
    const oy = 180 + row * 2070 + (col % 2) * 90;
    const lineId = `line-${lineIndex}`;
    nodes.push({ id: lineId, parentId: null, level: 0, name: lineName, x: ox, y: oy + 760, width: 196, line: lineName });
    blockSuffixes.forEach((blockSuffix, blockIndex) => {
      const blockId = `${lineId}-block-${blockIndex}`;
      const blockName = `${lineName.slice(0, 4)}·${blockSuffix}`;
      const blockY = oy + blockIndex * 500 + 160;
      nodes.push({ id: blockId, parentId: lineId, level: 1, name: blockName, x: ox + 330, y: blockY, width: 180, line: lineName, block: blockName });
      links.push({ from: lineId, to: blockId });
      unitSuffixes.forEach((unitSuffix, unitIndex) => {
        const unitId = `${blockId}-unit-${unitIndex}`;
        const unitName = `${blockSuffix}${unitSuffix}`;
        const unitY = blockY - 132 + unitIndex * 88;
        nodes.push({ id: unitId, parentId: blockId, level: 2, name: unitName, x: ox + 720, y: unitY, width: 188, line: lineName, block: blockName, unit: unitName });
        links.push({ from: blockId, to: unitId });
        itemSuffixes.forEach((itemSuffix, itemIndex) => {
          const itemId = `${unitId}-item-${itemIndex}`;
          const itemName = `${unitSuffix}${itemSuffix}`;
          const itemY = unitY - 36 + itemIndex * 24;
          nodes.push({ id: itemId, parentId: unitId, level: 3, name: itemName, x: ox + 1120, y: itemY, width: 210, line: lineName, block: blockName, unit: unitName, item: itemName });
          links.push({ from: unitId, to: itemId });
        });
      });
    });
  });
  return { nodes, links };
}

const panoramaModel = createPanoramaModel();
const panoramaItems = panoramaModel.nodes.filter(node => node.level === 3);
const panoramaNodeMap = new Map(panoramaModel.nodes.map(node => [node.id, node]));
const systemNames = ["城市运行一网统管平台", "城市事件协同处置系统", "城市生命线监测平台", "政务数据共享交换平台", "综合指挥调度平台", "公共服务统一门户", "应急资源管理系统", "城市安全风险平台", "生态环境监测系统", "交通运行分析平台", "建设项目监管平台", "市场主体服务平台", "民生诉求办理平台", "视频资源融合平台", "移动协同办公平台", "数据资产管理平台", "统一身份认证平台", "空间信息基础平台", "物联感知接入平台", "城市体征指标平台", "综合执法监管平台", "防汛抗旱指挥系统", "城市部件管理系统", "公共信用信息平台", "项目全生命周期平台", "智能客服平台", "数字档案管理系统", "领导驾驶舱"];
const projectNames = ["城市运行中枢升级", "一网统管能力提升", "城市生命线二期", "数据治理专项工程", "应急指挥融合工程", "政务服务体验提升", "城市安全感知工程", "生态监测联网工程", "交通态势优化工程", "建设监管数字化工程", "市场监管协同工程", "民生热线智能化工程", "视频资源整合工程", "数据资产运营工程", "物联感知补盲工程", "城市体征指标工程", "防汛调度提升工程", "移动协同建设工程"];
const diagnosisCategories = ["无系统支撑", "系统冗余", "重复建设", "数据孤岛", "支撑薄弱", "建设滞后"];
const diagnosisColors = { "无系统支撑": "#ff5f6d", "系统冗余": "#e25aad", "重复建设": "#ff9c4a", "数据孤岛": "#f4c75e", "支撑薄弱": "#7892b8", "建设滞后": "#9a76ff" };
const panoramaSystems = systemNames.map((name, index) => ({
  id: `system-${index}`, name, status: ["在用", "在建", "规划中"][index % 3],
  targetIds: panoramaItems.filter((_, itemIndex) => (itemIndex * 7 + index * 5) % 31 < 5).slice(0, 18 + index % 8).map(node => node.id)
}));
const panoramaProjects = projectNames.map((name, index) => ({
  id: `project-${index}`, name, stage: ["规划", "建设中", "已建成"][index % 3], year: String(2025 + index % 4),
  targetIds: panoramaItems.filter((_, itemIndex) => (itemIndex * 5 + index * 9) % 37 < 4).slice(0, 16 + index % 9).map(node => node.id)
}));
const panoramaDiagnoses = Array.from({ length: 36 }, (_, index) => {
  const category = diagnosisCategories[index % diagnosisCategories.length];
  const target = panoramaItems[(index * 19 + 11) % panoramaItems.length];
  return { id: `diagnosis-${index}`, name: `${target.name}·${category}`, category, severity: ["高", "中", "低"][index % 3], targetIds: [target.id] };
});

function PanoramaLayerControls({ activeOverlay, filters, setFilters }) {
  if (!activeOverlay) return null;
  const current = filters[activeOverlay];
  const update = patch => setFilters(value => ({ ...value, [activeOverlay]: { ...value[activeOverlay], ...patch } }));
  const reset = () => setFilters(value => ({ ...value, [activeOverlay]: activeOverlay === "system" ? { mode: "all", status: "", selectedId: "", search: "", onlyMatched: false, strength: true } : activeOverlay === "project" ? { mode: "all", selectedId: "", stage: "", year: "", search: "", onlyMatched: false } : { mode: "all", selectedId: "", category: "", severity: "", search: "", onlyMatched: false } }));
  if (activeOverlay === "system") return <div className="sidebar-layer-detail system-detail">
    <input value={current.search} onChange={event => update({ search: event.target.value })} placeholder="搜索系统名称" />
    <div className="panel-tabs">{[["all","全部系统"],["status","按状态"]].map(([value,label]) => <button key={value} className={current.mode === value ? "active" : ""} onClick={() => update({ mode: value, status: value === "all" ? "" : current.status })}>{label}</button>)}</div>
    <div className="panel-chips status-tags">{["在用","在建","规划中"].map(value => <button key={value} className={current.mode === "status" && current.status === value ? "active" : ""} onClick={() => update({ mode: "status", status: current.status === value ? "" : value })}>{value}</button>)}</div>
    <div className="coverage-level-legend"><span><i className="low" />低</span><span><i className="medium" />中</span><span><i className="high" />高</span></div>
    <div className="sidebar-detail-footer"><span>28个系统</span><button onClick={reset}>清空</button></div>
  </div>;
  if (activeOverlay === "project") return <div className="sidebar-layer-detail project-detail">
    <div className="panel-tabs">{[["all","全部项目"],["single","单个项目"]].map(([value,label]) => <button key={value} className={current.mode === value ? "active" : ""} onClick={() => update({ mode: value })}>{label}</button>)}</div>
    {current.mode === "single" && <select value={current.selectedId} onChange={event => update({ selectedId: event.target.value })}><option value="">选择一个项目</option>{panoramaProjects.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}
    <div className="panel-chips">{["规划","建设中","已建成"].map(value => <button key={value} className={current.stage === value ? "active" : ""} onClick={() => update({ stage: current.stage === value ? "" : value })}>{value}</button>)}</div>
    <input value={current.search} onChange={event => update({ search: event.target.value })} placeholder="搜索项目名称" />
    <div className="project-legend"><span><i className="planned" />规划</span><span><i className="building" />建设中</span><span><i className="built" />已建成</span></div>
    <div className="sidebar-detail-footer"><span>18个项目</span><button onClick={reset}>清空</button></div>
  </div>;
  return <div className="sidebar-layer-detail diagnosis-detail">
    <div className="panel-tabs">{[["all","全部问题"],["single","单个问题"]].map(([value,label]) => <button key={value} className={current.mode === value ? "active" : ""} onClick={() => update({ mode: value })}>{label}</button>)}</div>
    {current.mode === "single" && <select value={current.selectedId} onChange={event => update({ selectedId: event.target.value })}><option value="">选择一个问题</option>{panoramaDiagnoses.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}
    <div className="diagnosis-legend">{diagnosisCategories.map(value => <button key={value} className={current.category === value ? "active" : ""} style={{ "--legend-color": diagnosisColors[value] }} onClick={() => update({ category: current.category === value ? "" : value })}><i />{value}<b>{6}</b></button>)}</div>
    <div className="panel-chips"><small>风险等级</small>{["高","中","低"].map(value => <button key={value} className={current.severity === value ? "active" : ""} onClick={() => update({ severity: current.severity === value ? "" : value })}>{value}</button>)}</div>
    <input value={current.search} onChange={event => update({ search: event.target.value })} placeholder="搜索问题或业务事项" />
    <div className="sidebar-detail-footer"><span>36条问题</span><button onClick={reset}>清空</button></div>
  </div>;
}

function BusinessSankey({ onSelect }) {
  const [focusLine, setFocusLine] = useState(null);
  const colors = ["#22e4ff", "#328cff", "#655dff", "#9b61ff", "#d954ff", "#ff55d8"];
  const data = panoramaLines.map((name, index) => ({
    id: `sankey-${index}`,
    name,
    blocks: blockSuffixes.map(suffix => `${name.slice(0, 4)}·${suffix}`),
    units: unitSuffixes.map(suffix => `${suffix}组 · 4单元`),
    items: itemSuffixes.map(suffix => `${suffix} · 16事项`)
  }));
  const ribbon = (x1, y1, x2, y2, width) => {
    const bend = (x2 - x1) * .48;
    const half = width / 2;
    return `M ${x1} ${y1 - half} C ${x1 + bend} ${y1 - half}, ${x2 - bend} ${y2 - half}, ${x2} ${y2 - half} L ${x2} ${y2 + half} C ${x2 - bend} ${y2 + half}, ${x1 + bend} ${y1 + half}, ${x1} ${y1 + half} Z`;
  };
  const centerLine = (x1, y1, x2, y2) => { const bend = (x2 - x1) * .48; return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`; };
  const links = data.flatMap((line, lineIndex) => {
    const base = 54 + lineIndex * 68;
    const blockYs = line.blocks.map((_, index) => base + (index - 1.5) * 15);
    const unitYs = line.units.map((_, index) => base + (index - 1.5) * 15);
    const itemYs = line.items.map((_, index) => base + (index - 1.5) * 15);
    const out = [];
    blockYs.forEach((blockY, blockIndex) => {
      out.push({ id: `${line.id}-source-${blockIndex}`, lineId: line.id, colorIndex: lineIndex % colors.length, width: 10, d: ribbon(174, base, 306, blockY, 10), center: centerLine(174, base, 306, blockY) });
      const primaryUnit = unitYs[blockIndex];
      const crossingUnit = unitYs[(blockIndex + lineIndex % 3 + 1) % unitYs.length];
      out.push({ id: `${line.id}-block-${blockIndex}`, lineId: line.id, colorIndex: lineIndex % colors.length, width: 7, d: ribbon(454, blockY, 620, primaryUnit, 7), center: centerLine(454, blockY, 620, primaryUnit) });
      out.push({ id: `${line.id}-cross-${blockIndex}`, lineId: line.id, colorIndex: lineIndex % colors.length, width: 3.5, d: ribbon(454, blockY, 620, crossingUnit, 3.5), center: centerLine(454, blockY, 620, crossingUnit) });
    });
    unitYs.forEach((unitY, unitIndex) => {
      const primaryItem = itemYs[unitIndex];
      const crossingItem = itemYs[(unitIndex + lineIndex % 2 + 1) % itemYs.length];
      out.push({ id: `${line.id}-unit-${unitIndex}`, lineId: line.id, colorIndex: lineIndex % colors.length, width: 6, d: ribbon(762, unitY, 938, primaryItem, 6), center: centerLine(762, unitY, 938, primaryItem) });
      out.push({ id: `${line.id}-item-cross-${unitIndex}`, lineId: line.id, colorIndex: lineIndex % colors.length, width: 2.6, d: ribbon(762, unitY, 938, crossingItem, 2.6), center: centerLine(762, unitY, 938, crossingItem) });
    });
    return out;
  });
  return <div className="business-sankey">
    <div className="sankey-heading"><div><small>BUSINESS FLOW INSIGHT</small><b>业务流向洞察</b></div><span>12条主线 · 48个业务板块 · 192个业务单元 · 768个业务事项</span></div>
    <div className="sankey-columns"><span>业务主线</span><span>业务板块</span><span>业务单元</span><span>业务事项</span></div>
    <svg viewBox="0 0 1320 840" preserveAspectRatio="xMidYMid meet" onPointerLeave={() => setFocusLine(null)}>
      <defs>{colors.map((color, index) => <Fragment key={color}><linearGradient id={`sankey-gradient-${index}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={color} stopOpacity=".84" /><stop offset=".48" stopColor={color} stopOpacity=".4" /><stop offset="1" stopColor={color} stopOpacity=".8" /></linearGradient><filter id={`sankey-glow-${index}`} x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></Fragment>)}</defs>
      <g className="sankey-links">{links.map(link => <Fragment key={link.id}><path className={`sankey-ribbon ${focusLine && focusLine !== link.lineId ? "muted" : focusLine === link.lineId ? "active" : ""}`} d={link.d} fill={`url(#sankey-gradient-${link.colorIndex})`} filter={`url(#sankey-glow-${link.colorIndex})`} /><path className={`sankey-particle-line particle-${link.colorIndex}`} d={link.center} /></Fragment>)}</g>
      {data.map((line, lineIndex) => {
        const color = colors[lineIndex % colors.length];
        const base = 54 + lineIndex * 68;
        const blockYs = line.blocks.map((_, index) => base + (index - 1.5) * 15);
        const unitYs = line.units.map((_, index) => base + (index - 1.5) * 15);
        const itemYs = line.items.map((_, index) => base + (index - 1.5) * 15);
        const muted = focusLine && focusLine !== line.id;
        return <g key={line.id} className={`sankey-branch ${muted ? "muted" : ""}`} onPointerEnter={() => setFocusLine(line.id)} onClick={() => onSelect({ name: line.name, line: line.name })}>
          <rect x="22" y={base - 24} width="152" height="48" rx="6" fill={color} fillOpacity=".14" stroke={color} strokeWidth="1.2" />
          <rect x="22" y={base - 24} width="4" height="48" rx="2" fill={color} />
          <text x="98" y={base + 4} textAnchor="middle" className="sankey-main-name">{line.name}</text>
          {line.blocks.map((block, blockIndex) => <g key={block}><rect x="306" y={blockYs[blockIndex] - 6.5} width="148" height="13" rx="3" fill={color} fillOpacity=".18" stroke={color} strokeWidth=".9" /><text x="380" y={blockYs[blockIndex] + 3} textAnchor="middle" className="sankey-module-name">{block}</text></g>)}
          {line.units.map((unit, unitIndex) => <g key={unit}><rect x="620" y={unitYs[unitIndex] - 6.5} width="142" height="13" rx="3" fill="#06142c" stroke={color} strokeWidth=".9" /><text x="691" y={unitYs[unitIndex] + 3} textAnchor="middle" className="sankey-unit-name">{unit}</text></g>)}
          {line.items.map((item, itemIndex) => <g key={item}><rect x="938" y={itemYs[itemIndex] - 6.5} width="230" height="13" rx="3" fill="#07132b" stroke={color} strokeWidth=".9" /><text x="1053" y={itemYs[itemIndex] + 3} textAnchor="middle" className="sankey-item-name">{item}</text></g>)}
        </g>;
      })}
    </svg>
    <div className="sankey-tip">悬浮主线聚焦完整流向 · 点击主线查看业务详情</div>
  </div>;
}

function UnitBusinessPanorama({ setSelected, onOpenApplication }) {
  const [canvasMode, setCanvasMode] = useState("panorama");
  const [businessGranularity, setBusinessGranularity] = useState("item");
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [overlayScanRun, setOverlayScanRun] = useState(0);
  const [overlayScanning, setOverlayScanning] = useState(false);
  const [controlCollapsed, setControlCollapsed] = useState(false);
  const [viewPreset, setViewPreset] = useState("oblique");
  const [camera, setCamera] = useState({ x: 40, y: -120, zoom: .52, yaw: 0, pitch: 8 });
  const [filters, setFilters] = useState({
    system: { mode: "all", status: "", selectedId: "", search: "", onlyMatched: false, strength: true },
    project: { mode: "all", selectedId: "", stage: "", year: "", search: "", onlyMatched: false },
    diagnosis: { mode: "all", selectedId: "", category: "", severity: "", search: "", onlyMatched: false }
  });
  const dragRef = useRef(null);
  const maxLevel = { block: 1, unit: 2, item: 3 }[businessGranularity];
  const currentFilter = activeOverlay ? filters[activeOverlay] : null;
  const activeEntities = useMemo(() => {
    if (!activeOverlay) return [];
    const collection = activeOverlay === "system" ? panoramaSystems : activeOverlay === "project" ? panoramaProjects : panoramaDiagnoses;
    return collection.filter(entity => {
      if (currentFilter.mode === "single" && currentFilter.selectedId && entity.id !== currentFilter.selectedId) return false;
      if (activeOverlay === "system" && currentFilter.mode === "status" && currentFilter.status && entity.status !== currentFilter.status) return false;
      if (activeOverlay === "project" && currentFilter.stage && entity.stage !== currentFilter.stage) return false;
      if (activeOverlay === "project" && currentFilter.year && entity.year !== currentFilter.year) return false;
      if (activeOverlay === "diagnosis" && currentFilter.category && entity.category !== currentFilter.category) return false;
      if (activeOverlay === "diagnosis" && currentFilter.severity && entity.severity !== currentFilter.severity) return false;
      return !currentFilter.search || entity.name.includes(currentFilter.search);
    });
  }, [activeOverlay, currentFilter]);
  const coverage = useMemo(() => {
    const counts = new Map();
    activeEntities.forEach(entity => entity.targetIds.forEach(targetId => {
      let node = panoramaNodeMap.get(targetId);
      while (node) {
        counts.set(node.id, (counts.get(node.id) || 0) + 1);
        node = node.parentId ? panoramaNodeMap.get(node.parentId) : null;
      }
    }));
    return counts;
  }, [activeEntities]);
  const visibleNodes = useMemo(() => {
    const left = (-camera.x - 520) / camera.zoom;
    const right = (-camera.x + 2480) / camera.zoom;
    const top = (-camera.y - 620) / camera.zoom;
    const bottom = (-camera.y + 1800) / camera.zoom;
    return panoramaModel.nodes.filter(node => node.level <= maxLevel && node.x > left && node.x < right && node.y > top && node.y < bottom);
  }, [camera, maxLevel]);
  const visibleIds = new Set(visibleNodes.map(node => node.id));
  const visibleLinks = panoramaModel.links.filter(link => visibleIds.has(link.from) && visibleIds.has(link.to) && panoramaNodeMap.get(link.to).level <= maxLevel);
  const overlayBase = activeOverlay === "system" ? "#53d7ff" : activeOverlay === "project" ? "#9f80ff" : "#ff7081";
  const scanDelay = worldX => Math.max(.08, Math.min(3.65, ((worldX * camera.zoom + camera.x) / 1500) * 3.65));
  const systemCoverageTone = count => count >= 5 ? "#ff9847" : count >= 3 ? "#706eff" : "#41c9ff";
  const wrapCamera = value => ({ ...value, x: value.x > 600 ? value.x - 7200 * value.zoom : value.x < -7200 * value.zoom ? value.x + 7200 * value.zoom : value.x, y: value.y > 600 ? value.y - 6200 * value.zoom : value.y < -6200 * value.zoom ? value.y + 6200 * value.zoom : value.y });
  const startPan = event => { if (event.button !== 0) return; dragRef.current = { x: event.clientX, y: event.clientY, camera }; event.currentTarget.setPointerCapture(event.pointerId); };
  const movePan = event => { if (!dragRef.current) return; setCamera(wrapCamera({ ...dragRef.current.camera, x: dragRef.current.camera.x + event.clientX - dragRef.current.x, y: dragRef.current.camera.y + event.clientY - dragRef.current.y })); };
  const endPan = () => { dragRef.current = null; };
  const zoom = delta => setCamera(value => ({ ...value, zoom: Math.max(.28, Math.min(1.25, value.zoom + delta)) }));
  const toggleView = () => { const next = viewPreset === "oblique" ? "top" : "oblique"; setViewPreset(next); setCamera(value => ({ ...value, pitch: next === "top" ? 0 : 8, yaw: 0 })); };
  const resetView = () => { setViewPreset("oblique"); setCamera({ x: 40, y: -120, zoom: .52, yaw: 0, pitch: 8 }); };
  const fitView = () => setCamera(value => ({ ...value, x: 40, y: 20, zoom: .28 }));
  const locateNext = () => {
    const targetId = activeEntities[0]?.targetIds[0];
    const target = panoramaNodeMap.get(targetId);
    if (target) setCamera(value => ({ ...value, x: 820 - target.x * value.zoom, y: 360 - target.y * value.zoom }));
  };
  const openNode = node => {
    const seed = Math.abs(Math.round(node.x + node.y));
    const relatedSystem = panoramaSystems.find(entity => entity.targetIds.includes(node.id)) || panoramaSystems[seed % panoramaSystems.length] || panoramaSystems[0];
    const relatedProject = panoramaProjects.find(entity => entity.targetIds.includes(node.id)) || panoramaProjects[seed % panoramaProjects.length] || panoramaProjects[0];
    const relatedIssue = panoramaDiagnoses.find(entity => entity.targetIds.includes(node.id));
    setSelected({ type: "business", name: node.name, line: node.line, block: node.block || "全部业务板块", unit: node.unit || "全部业务单元", system: relatedSystem.name, project: relatedProject.name, risk: relatedIssue?.category || "" });
  };
  const setPanoramaView = update => {
    setViewPreset(typeof update === "object" && update.pitch === 0 && update.yaw === 0 ? "top" : "free");
    setCamera(value => {
      const current = { yaw: value.yaw, pitch: value.pitch };
      const next = typeof update === "function" ? update(current) : update;
      return { ...value, yaw: Math.max(-20, Math.min(20, next.yaw)), pitch: Math.max(0, Math.min(18, Math.abs(next.pitch))) };
    });
  };
  const toggleOverlay = value => {
    if (canvasMode !== "panorama") setCanvasMode("panorama");
    if (activeOverlay === value) {
      setActiveOverlay(null);
      setOverlayScanning(false);
      return;
    }
    setActiveOverlay(value);
    setOverlayScanRun(run => run + 1);
    setOverlayScanning(true);
  };
  useEffect(() => {
    if (!activeOverlay || !overlayScanning) return undefined;
    const timer = window.setTimeout(() => setOverlayScanning(false), 5000);
    return () => window.clearTimeout(timer);
  }, [activeOverlay, overlayScanRun, overlayScanning]);
  const selectLegacyBusiness = payload => setSelected({ type: "business", name: payload.name, line: payload.line || "单位业务全景", block: "业务能力板块", unit: "业务执行单元", system: "城市运行一网统管平台", project: "城市运行中枢升级", risk: "" });
  return <div className={`unit-panorama canvas-${canvasMode}`}>
    {controlCollapsed ? <button className="panorama-control-launcher" onClick={() => setControlCollapsed(false)}><i />视图控制</button> : <aside className="panorama-control-sidebar">
      <div className="sidebar-title"><div><small>VIEW CONTROL</small><h3>视图控制</h3></div><button className="sidebar-collapse" onClick={() => setControlCollapsed(true)} title="收起面板">收起</button></div>
      <section className="sidebar-section"><div className="sidebar-section-heading"><b>底图视图</b></div><div className="sidebar-segment">{[["panorama","业务树"],["flow","桑基图"],["system","业务矩阵"]].map(([value,label]) => <button key={value} className={canvasMode === value ? "active" : ""} onClick={() => { setCanvasMode(value); setSelected(null); }}>{label}</button>)}</div></section>
      <section className="sidebar-section overlay-section"><div className="sidebar-section-heading"><b>叠加图层</b><span>单选</span></div>{[["system","系统"],["project","项目"],["diagnosis","诊断"]].map(([value,label]) => <Fragment key={value}><button className={`layer-toggle-row ${canvasMode === "panorama" && activeOverlay === value ? "active" : ""}`} onClick={() => toggleOverlay(value)}><span><i />{label}</span><em /></button>{canvasMode === "panorama" && activeOverlay === value && <PanoramaLayerControls activeOverlay={activeOverlay} filters={filters} setFilters={setFilters} />}</Fragment>)}</section>
      {canvasMode === "panorama" && <section className="sidebar-section granularity-section"><div className="sidebar-section-heading"><b>展示层级</b></div><div className="sidebar-segment compact">{[["block","板块"],["unit","单元"],["item","事项"]].map(([value,label]) => <button key={value} className={businessGranularity === value ? "active" : ""} onClick={() => setBusinessGranularity(value)}>{label}</button>)}</div></section>}
    </aside>}
    {canvasMode === "panorama" && <div className={`panorama-canvas overlay-${activeOverlay || "none"} ${overlayScanning ? "is-overlay-scanning" : ""}`} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={endPan} onPointerCancel={endPan} onWheel={event => { event.preventDefault(); zoom(event.deltaY < 0 ? .06 : -.06); }}>
      <div className="panorama-grid" />
      <div key={`panorama-world-${overlayScanRun}`} className="panorama-world" style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.zoom}) rotateX(${camera.pitch}deg) rotateZ(${camera.yaw}deg)`, "--overlay-color": overlayBase }}>
        <svg className="panorama-links" viewBox="0 0 7600 6400" preserveAspectRatio="none">{visibleLinks.map(link => {
          const from = panoramaNodeMap.get(link.from); const to = panoramaNodeMap.get(link.to); const hit = coverage.has(to.id); const elbow = from.x + (to.x - from.x) * .54;
          const points = `${from.x + from.width / 2},${from.y} ${elbow},${from.y} ${elbow},${to.y} ${to.x - to.width / 2},${to.y}`;
          const delay = `${scanDelay(to.x)}s`;
          return <Fragment key={`${link.from}-${link.to}`}><polyline className={activeOverlay ? hit ? "matched" : "dimmed" : ""} points={points} pathLength="1" style={{ "--scan-delay": delay }} />{activeOverlay && hit && <polyline className="panorama-energy-line" points={points} pathLength="1" style={{ "--scan-delay": delay }} />}</Fragment>;
        })}</svg>
        {visibleNodes.map(node => {
          const hitCount = coverage.get(node.id) || 0;
          const isDimmed = activeOverlay && !hitCount;
          const diagnosis = activeOverlay === "diagnosis" ? activeEntities.find(entity => entity.targetIds.includes(node.id)) : null;
          const tone = activeOverlay === "system" && hitCount ? systemCoverageTone(hitCount) : diagnosis ? diagnosisColors[diagnosis.category] : overlayBase;
          return <button key={node.id} className={`panorama-node level-${node.level} ${hitCount ? "matched" : ""} ${isDimmed ? "dimmed" : ""} ${currentFilter?.onlyMatched && isDimmed ? "hidden-match" : ""}`} style={{ left: node.x, top: node.y, width: node.width, "--node-overlay": tone, "--coverage": Math.min(1, .34 + hitCount * .13), "--scan-delay": `${scanDelay(node.x) + .35}s` }} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); openNode(node); }}><i /><span><b>{node.name}</b></span></button>;
        })}
      </div>
      <div className="panorama-scale">缩放 {Math.round(camera.zoom * 100)}% · 拖动画布 / 滚轮缩放</div>
    </div>}
    {canvasMode === "flow" && <BusinessSankey onSelect={selectLegacyBusiness} />}
    {canvasMode === "system" && <SystemTerrain grain="业务事项" onOpenApplication={onOpenApplication} systemView="board" />}
    {canvasMode === "panorama" && <><ViewController view={{ yaw: camera.yaw, pitch: camera.pitch }} setView={setPanoramaView} /><div className="map-control-stack panorama-map-controls"><button onClick={() => zoom(.08)} title="放大" aria-label="放大">＋</button><button onClick={() => zoom(-.08)} title="缩小" aria-label="缩小">−</button><button onClick={resetView} title="复位" aria-label="复位">↺</button><button className={viewPreset === "oblique" ? "active" : ""} onClick={toggleView} title="倾斜视角" aria-label="倾斜视角">◇</button></div></>}
  </div>;
}

function DetailDrawer({ selected, onClose }) {
  if (!selected) return null;
  const business = selected.type === "business" || selected.type === "block";
  const system = selected.type === "system";
  const project = selected.type === "project";
  const diagnosis = selected.type === "diagnosis";
  return <aside className="detail-drawer">
    <button className="drawer-close" onClick={onClose}>×</button>
    <div className="drawer-kicker">{system ? "SYSTEM PROFILE / 横向剖切" : business ? "BUSINESS PROFILE / 纵向穿透" : project ? "PROJECT PROFILE" : diagnosis ? "DIAGNOSIS / 智能诊断" : "BUSINESS CONTEXT"}</div>
    <h3>{selected.name}</h3>
    {business && <>
      <div className="path">{selected.line} <i>›</i> {selected.block} <i>›</i> {selected.unit}</div>
      <div className="drawer-grid"><div><span>牵头处室</span><b>运行监测处</b></div><div><span>协同处室</span><b>3个</b></div><div><span>支撑系统</span><b>{selected.system}</b></div><div><span>关联项目</span><b>{selected.project}</b></div></div>
      <h4>支撑关系</h4><div className="support-chain"><span>业务事项</span><i>→</i><span>{selected.system}</span><i>→</i><span>{selected.project}</span></div>
      <div className={`diagnosis-card ${selected.risk ? "warning" : ""}`}><small>数字化诊断</small><b>{selected.risk || "系统支撑充分，业务协同链路完整"}</b><p>{selected.risk ? "建议纳入下一批能力补齐清单，并复用现有数据资源。" : "当前未发现明显支撑缺口，可继续提升跨部门数据复用率。"}</p></div>
    </>}
    {system && <>
      <div className="status-line"><span className={selected.status === "在用" ? "ok" : "warn"}>{selected.status}</span><span>{selected.category}</span></div>
      <div className="health-ring"><b>{selected.health}</b><span>运行健康度</span></div>
      <div className="drawer-list"><p><span>主管处室</span>{selected.owner}</p><p><span>使用范围</span>{selected.users}</p><p><span>支撑业务</span>{selected.services}</p><p><span>数据资源</span>{selected.data}</p><p><span>当前关联</span>{selected.business}</p></div>
      <div className="diagnosis-card"><small>系统画像结论</small><b>核心支撑能力，建议持续复用</b><p>系统承载多条业务主线，可作为单位级公共能力进行统一建设。</p></div>
    </>}
    {project && <>
      <div className="project-progress"><i style={{ width: selected.timeline === "规划目标" ? "92%" : selected.timeline === "建成后" ? "68%" : "38%" }} /></div>
      <div className="drawer-grid"><div><span>项目阶段</span><b>{selected.timeline}</b></div><div><span>投资规模</span><b>1,280万</b></div><div><span>建设周期</span><b>18个月</b></div><div><span>支撑业务</span><b>{selected.business}</b></div></div>
      <div className="diagnosis-card"><small>项目匹配诊断</small><b>项目目标与业务需求基本一致</b><p>建议补充项目交付指标与业务事项成效指标之间的映射。</p></div>
    </>}
    {diagnosis && <><div className="diagnosis-score"><b>76</b><span>综合诊断指数</span></div><div className="diagnosis-card warning"><small>发现问题</small><b>{selected.name}</b><p>影响业务：{selected.business}<br />关联系统：{selected.system}</p></div><div className="action-list"><b>建议动作</b><span>01 统一数据标准</span><span>02 复用现有系统能力</span><span>03 纳入项目建设清单</span></div></>}
  </aside>;
}

function StructurePanel({ onClose }) {
  return <aside className="structure-panel">
    <div className="panel-title"><div><small>UNIT MAPPING</small><h3>单位业务梳理</h3></div><button onClick={onClose}>×</button></div>
    <div className="stepper"><span className="done">1</span><i /><span className="done">2</span><i /><span>3</span><i /><span>4</span></div>
    <div className="edit-card"><small>当前业务主线</small><b>城市运行统筹</b><span>牵头处室：运行监测处</span></div>
    <div className="edit-tree"><div><i />运行监测<b>2个业务单元</b></div><div><i />指挥调度<b>2个业务单元</b></div><div><i />综合分析<b>1个业务单元</b></div></div>
    <button className="add-button">＋ 新增业务板块</button>
    <div className="panel-tip">本阶段展示结构梳理方式，数据保存与审核流程将在后续接入。</div>
  </aside>;
}

function DrillPage({ data, onBack }) {
  if (data.type === "application") return <section className="application-panorama-page" aria-label={`${data.name}应用全景图`}>
    <div className="application-panorama-frame">
      <img src={applicationPanoramaDesign} alt={`${data.name}应用全景图`} draggable="false" />
      <button className="application-panorama-back" onClick={onBack} aria-label="返回上一页" title="返回上一页" />
    </div>
  </section>;
  const axisName = data.axis === "horizontal" ? "横向剖切" : data.axis === "vertical" ? "纵向穿透" : "全景画像";
  return <section className="drill-page">
    <button className="drill-back" onClick={onBack}>← 返回单位全景</button>
    <div className="drill-header"><small>03 / {axisName}</small><h2>{data.name}</h2><p>{data.axis === "horizontal" ? "查看该系统横向覆盖的全部业务主线、业务单元和处室" : data.axis === "vertical" ? "沿业务树向上追溯业务归属，向下穿透系统与项目支撑" : "汇总对象属性、支撑范围、运行状态与诊断建议"}</p></div>
    <div className={`section-model ${data.axis}`}>
      <div className="slice slice-a"><span>业务主线</span></div><div className="slice slice-b"><span>业务板块</span></div><div className="slice slice-c"><span>业务事项</span></div>
      <div className="model-core"><i /><b>{data.name}</b><span>{axisName}</span></div>
      {["城市运行统筹","城市治理监督","公共服务保障","应急联动处置"].map((name, i) => <div key={name} className={`satellite satellite-${i}`}><i />{name}</div>)}
    </div>
    <aside className="drill-insight">
      <small>关联概览</small>
      <div className="insight-score"><b>{data.health || 86}</b><span>数字化支撑指数</span></div>
      <div className="insight-list"><p><span>覆盖业务</span><b>{data.services || "12项"}</b></p><p><span>关联处室</span><b>{data.users || "6个"}</b></p><p><span>数据资源</span><b>{data.data || "28类"}</b></p><p><span>建设状态</span><b>{data.status || "在用"}</b></p></div>
      <div className="diagnosis-card"><small>诊断结论</small><b>具备跨主线复用价值</b><p>当前能力覆盖多个业务板块，建议作为单位级公共能力统一运营。</p></div>
    </aside>
  </section>;
}

export function App() {
  const [mode, setMode] = useState("city");
  const [hovered, setHovered] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState({ yaw: 0, pitch: 0 });
  const [drill, setDrill] = useState(null);
  const openApplicationPanorama = data => {
    setSelected(null);
    setDrill({ ...data, type: "application" });
  };
  const enterUnit = () => { setTransitioning(true); setTimeout(() => { setMode("unit"); setTransitioning(false); setSelected(null); }, 680); };
  const back = () => { setTransitioning(true); setTimeout(() => { setMode("city"); setTransitioning(false); setSelected(null); }, 520); };

  return <main className={`app ${mode} ${transitioning ? "transitioning" : ""}`}>
    <ParticleField mode={mode} burst={transitioning} /><div className="aurora aurora-a" /><div className="aurora aurora-b" />
    <header className="topbar">
      <div className="brand-mark"><span /><span /><span /></div><div><div className="eyebrow">JINAN DIGITAL GOVERNANCE</div><h1>数字化诊断全景图</h1></div>
      <div className="topbar-right"><div className="mode-switch"><button className={mode === "city" ? "active" : ""}>全景研判</button><button onClick={() => mode === "city" && enterUnit()}>单位全景</button></div><div className="live"><i /> 数据动态映射中</div></div>
    </header>
    <section className="stage">
      {mode === "city" ? <>
        <div className="city-space" style={{ transform: `translateZ(-24px) rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` }}>
        <div className="universe">{units.map((unit, index) => <button key={unit.id} className={`star-node ${unit.tone} ${hovered === unit.id ? "hovered" : ""}`} style={{ left: `${unit.x}%`, top: `${unit.y}%`, "--size": `${unit.size}px`, "--star-z": `${[72, -18, 46, -38, 28, 90, -8, 52, -54, 36, 64, -26, 18, -68][index]}px`, "--float-delay": `${-index * .7}s`, "--float-range": `${5 + index % 4}px` }} onPointerEnter={() => setHovered(unit.id)} onPointerLeave={() => setHovered(null)} onClick={enterUnit}><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="star-core" /><span className="star-label"><b>{unit.name}</b><em>指数 {unit.score}</em></span></button>)}</div></div>
        <div className="intro"><div className="section-no">01 / 全市全景</div><h2>济南市数字化<br /><strong>业务星系</strong></h2><p>以业务为核心，映射单位、系统与项目的支撑关系</p></div>
        <div className="metrics"><div><b>42</b><span>接入单位</span></div><div><b>268</b><span>业务主线</span></div><div><b>1,036</b><span>业务事项</span></div><div><b>82.6%</b><span>数字化覆盖率</span></div></div>
        <ViewController view={view} setView={setView} />
        <div className="legend"><span><i className="dot gold-dot" />重点单位</span><span><i className="dot blue-dot" />市直单位</span></div><div className="guide">移动鼠标探索 · 点击单位进入全景</div>
      </> : <>
        <button className="back-button" onClick={back}>← 返回全市</button>
        <div className="unit-titlebar"><div><div className="section-no">02 / 单位业务全景</div><h2>济南市城市运行管理局</h2></div><div className="mini-metrics"><span><b>12</b>主线</span><span><b>48</b>板块</span><span><b>192</b>单元</span><span><b>768</b>事项</span></div></div>
        <UnitBusinessPanorama setSelected={setSelected} onOpenApplication={openApplicationPanorama} />
      </>}
    </section>
    <DetailDrawer selected={selected} onClose={() => setSelected(null)} />
    {drill && <DrillPage data={drill} onBack={() => setDrill(null)} />}
    <div className="transition-flare" />
    <footer><span>业务 · 系统 · 项目 · 诊断</span><span>济南市数字化诊断平台 / DEMO 02</span></footer>
  </main>;
}
