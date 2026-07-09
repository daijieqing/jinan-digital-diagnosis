import { Fragment, useEffect, useRef, useState } from "react";

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
    {units.slice(1).map(u => <line key={u.id} x1="48" y1="47" x2={u.x} y2={u.y} />)}
    {units.slice(1).map((u, i) => {
      const next = units[(i + 3) % units.length];
      return <line className="secondary-link" key={`secondary-${u.id}`} x1={u.x} y1={u.y} x2={next.x} y2={next.y} />;
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
    <small>360° 视角</small>
    <button className="joystick" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY }; }}>
      <i style={{ transform: `translate(${Math.sin(view.yaw / 50) * 10}px, ${-view.pitch / 3}px)` }} />
    </button>
    <div><button onClick={() => setView(v => ({ ...v, yaw: v.yaw - 25 }))}>‹</button><button onClick={() => setView({ yaw: 0, pitch: 0 })}>复位</button><button onClick={() => setView(v => ({ ...v, yaw: v.yaw + 25 }))}>›</button></div>
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
    items: ["城市运行指标采集", "城市生命线监测", "重点区域态势感知", "运行异常智能发现", "综合态势分析研判", "领导驾驶舱服务", "跨部门事件受理", "协同任务派发", "处置过程跟踪", "重点任务建账", "任务进度督导", "办理结果评价"]
  },
  govern: {
    blocks: ["城市问题治理", "网格协同监督"],
    units: [["问题主动发现", "闭环处置管理"], ["网格巡查管理", "治理效能监督"]],
    items: ["视频智能巡查", "城市问题上报", "公众诉求接入", "问题分类研判", "责任单位派遣", "处置结果核查", "网格员任务管理", "巡查轨迹管理", "重点区域巡检", "治理指标监测", "超期事项督办", "治理成效评价"]
  },
  service: {
    blocks: ["公共服务响应", "设施运行保障"],
    units: [["民生诉求响应", "服务资源调度"], ["市政设施监测", "保障任务处置"]],
    items: ["热线诉求接收", "诉求智能分类", "高频问题分析", "跨部门协同办理", "服务资源查询", "公共资源调度", "道路设施监测", "桥梁运行监测", "照明设施监测", "设施故障告警", "养护任务派发", "保障结果归档"]
  },
  emergency: {
    blocks: ["风险预警研判", "应急联动处置"],
    units: [["风险综合感知", "预警信息管理"], ["应急预案执行", "多部门协同处置"]],
    items: ["风险信息汇聚", "隐患动态监测", "风险等级评估", "专题风险研判", "预警信息发布", "预警反馈跟踪", "应急事件接报", "预案智能匹配", "应急力量调度", "现场信息回传", "处置过程协同", "事件复盘评估"]
  }
};

function DenseBusinessFlow({ onSelect, onDrill, view }) {
  const [hoverBranch, setHoverBranch] = useState(null);
  const palettes = {
    run: { start: "#00F0FF", end: "#0072FF", glow: "rgba(0, 240, 255, 0.25)" },
    govern: { start: "#00F5D4", end: "#01949A", glow: "rgba(0, 245, 212, 0.2)" },
    service: { start: "#A855F7", end: "#6366F1", glow: "rgba(168, 85, 247, 0.2)" },
    emergency: { start: "#FF9F0A", end: "#FF3B30", glow: "rgba(255, 159, 10, 0.25)" }
  };
  const colors = Object.fromEntries(Object.entries(palettes).map(([key, value]) => [key, value.start]));
  const layout = tree.flatMap((line, branchIndex) => {
    const source = flowNames[line.id];
    const startY = 35 + branchIndex * 205;
    const itemRows = source.items.map((name, i) => {
      const unitGlobal = Math.floor(i / 3), itemIndex = i % 3;
      const blockIndex = Math.floor(unitGlobal / 2), unitIndex = unitGlobal % 2;
      return { id: `${line.id}-item-${i}`, name, branch: line.id, blockIndex, unitIndex, x: 930, y: startY + blockIndex * 102 + unitIndex * 46 + itemIndex * 19 + 6 };
    });
    const unitRows = source.units.flatMap((pair, blockIndex) => pair.map((name, unitIndex) => ({
      id: `${line.id}-unit-${blockIndex}-${unitIndex}`, name, branch: line.id, blockIndex, unitIndex,
      x: 620, y: startY + blockIndex * 102 + unitIndex * 46 + 25
    })));
    const blockRows = source.blocks.map((name, blockIndex) => ({ id: `${line.id}-block-${blockIndex}`, name, branch: line.id, blockIndex, x: 360, y: startY + blockIndex * 102 + 48 }));
    return [{ id: line.id, name: line.name, branch: line.id, type: "mainline", x: 112, y: startY + 96 }, ...blockRows, ...unitRows, ...itemRows];
  });
  const nodeById = Object.fromEntries(layout.map(n => [n.id, n]));
  const links = tree.flatMap(line => {
    const source = flowNames[line.id];
    const result = [];
    source.blocks.forEach((_, b) => {
      result.push({ branch: line.id, from: line.id, to: `${line.id}-block-${b}` });
      source.units[b].forEach((_, u) => {
        result.push({ branch: line.id, from: `${line.id}-block-${b}`, to: `${line.id}-unit-${b}-${u}` });
        const base = b * 6 + u * 3;
        for (let i = 0; i < 3; i++) result.push({ branch: line.id, from: `${line.id}-unit-${b}-${u}`, to: `${line.id}-item-${base + i}` });
      });
    });
    return result;
  });
  const curve = link => {
    const a = nodeById[link.from], b = nodeById[link.to];
    const distance = b.x - a.x;
    const c1 = a.x + distance * .42;
    const c2 = a.x + distance * .64;
    return `M ${a.x} ${a.y} C ${c1} ${a.y}, ${c2} ${b.y}, ${b.x} ${b.y}`;
  };
  return <div className="dense-flow">
    <div className="flow-ambient" aria-hidden="true">{tree.map(line => <i key={line.id} className={`ambient-${line.id}`} />)}</div>
    <div className="flow-legend">{tree.map(line => <span key={line.id} style={{ "--flow-start": palettes[line.id].start, "--flow-end": palettes[line.id].end }}><i />{line.name}</span>)}</div>
    <div className="flow-world" style={{ transform: `rotateX(${Math.max(6, 30 - view.pitch * .58)}deg) rotateZ(${view.yaw * .18}deg) scale(1.03)` }}>
    <svg viewBox="0 0 1100 850" preserveAspectRatio="xMidYMid meet" onPointerLeave={() => setHoverBranch(null)}>
      <defs>
        {tree.map(line => <Fragment key={line.id}>
          <linearGradient id={`branch-${line.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={palettes[line.id].start} />
            <stop offset="1" stopColor={palettes[line.id].end} />
          </linearGradient>
          <linearGradient id={`card-${line.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#10264A" stopOpacity=".66" />
            <stop offset=".58" stopColor="#0A1932" stopOpacity=".5" />
            <stop offset="1" stopColor={palettes[line.id].end} stopOpacity=".12" />
          </linearGradient>
        </Fragment>)}
        <linearGradient id="card-sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".1" /><stop offset=".5" stopColor="#ffffff" stopOpacity=".015" /><stop offset="1" stopColor="#000814" stopOpacity=".08" /></linearGradient>
      </defs>
      <g className="flow-links">{links.map((link, i) => <path key={i} d={curve(link)} stroke={`url(#branch-${link.branch})`} className={hoverBranch && hoverBranch !== link.branch ? "muted" : hoverBranch === link.branch ? "active" : ""} />)}</g>
      <g className="flow-nodes">{layout.map(node => {
        const isItem = node.id.includes("-item-"), isUnit = node.id.includes("-unit-"), isBlock = node.id.includes("-block-");
        const muted = hoverBranch && hoverBranch !== node.branch;
        const cardWidth = isItem ? 202 : isUnit ? 184 : isBlock ? 190 : 184;
        const cardHeight = isItem ? 18 : isUnit ? 32 : isBlock ? 36 : 44;
        return <g key={node.id} className={`${isItem ? "flow-item" : isUnit ? "flow-unit" : isBlock ? "flow-block" : "flow-mainline"} ${muted ? "muted" : ""}`} style={{ "--card-color": colors[node.branch], "--card-glow": palettes[node.branch].glow }} transform={`translate(${node.x} ${node.y})`} onPointerEnter={() => setHoverBranch(node.branch)} onClick={() => {
          const payload = { type: isItem ? "business" : node.type || "business", name: node.name, line: tree.find(t => t.id === node.branch)?.name };
          if (isItem) onDrill({ ...payload, axis: "vertical" }); else onSelect(payload);
        }}>
          {!isItem && <rect className="flow-card-shadow" x={-cardWidth / 2 + 3} y={-cardHeight / 2 + 5} width={cardWidth} height={cardHeight} rx="4" fill={colors[node.branch]} />}
          <rect className="flow-card-face" x={-cardWidth / 2} y={-cardHeight / 2} width={cardWidth} height={cardHeight} rx={isItem ? "2" : "4"} fill={isItem ? "rgba(255,255,255,.03)" : `url(#card-${node.branch})`} stroke={`url(#branch-${node.branch})`} />
          {!isItem && <rect className="flow-card-sheen" x={-cardWidth / 2 + 1.5} y={-cardHeight / 2 + 1.5} width={cardWidth - 3} height={cardHeight - 3} rx="3" fill="url(#card-sheen)" />}
          <path className="flow-card-accent" d={isItem ? `M ${-cardWidth / 2} ${-cardHeight / 2 + 2} V ${cardHeight / 2 - 2}` : `M ${-cardWidth / 2 + 7} ${-cardHeight / 2} H ${cardWidth / 2 - 7}`} stroke={`url(#branch-${node.branch})`} />
          {!isItem && <circle className="flow-card-dot" cx={-cardWidth / 2 + 12} cy="0" r="2.2" fill={colors[node.branch]} />}
          <text x="0" y="1" textAnchor="middle" dominantBaseline="middle">{node.name}</text>
          {isItem && <title>{node.name} · 点击纵向穿透</title>}
        </g>;
      })}</g>
    </svg>
    <div className="flow-columns"><span>业务主线</span><span>业务板块</span><span>业务单元</span><span>业务事项</span></div>
    </div>
    <div className="flow-tip">悬浮节点，高亮同一主线的完整关联链路 · 点击事项纵向穿透</div>
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

function SystemTerrain({ grain, setSelected }) {
  const depth = grainOrder.indexOf(grain);
  const [terrainView, setTerrainView] = useState({ yaw: -8, pitch: 18 });
  const [terrainZoom, setTerrainZoom] = useState(1);
  const [sliceTarget, setSliceTarget] = useState(null);
  const drag = useRef(null);
  const demoSystemPool = ["城市数据中台", "统一身份认证平台", "视频资源共享平台", "协同办公平台"];

  const project = point => {
    const angle = terrainView.yaw * Math.PI / 180;
    const dx = point.x - 50, dy = point.y - 50;
    const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
    const compression = .58 + terrainView.pitch / 100;
    return { x: 50 + rotatedX * terrainZoom, y: 52 + rotatedY * compression * terrainZoom };
  };

  const rawTargets = tree.flatMap((line, lineIndex) => {
    const source = flowNames[line.id];
    const baseColumn = lineIndex % 2 === 0 ? 0 : 11;
    const baseRow = lineIndex < 2 ? 0 : 7;
    const gridPoint = (column, row) => ({ x: 12 + (baseColumn + column) * 3.72, y: 10 + (baseRow + row) * 5.82 });
    if (depth === 0) return [{
      id: line.id,
      name: line.name,
      color: line.color,
      blocks: line.blocks,
      point: gridPoint(5, 3),
      lineIndex,
    }];
    if (depth === 1) return source.blocks.map((name, blockIndex) => ({
      id: `${line.id}-block-${blockIndex}`, name, color: line.color, blocks: [line.blocks[blockIndex]],
      point: gridPoint(blockIndex ? 8 : 2.5, 3), lineIndex, blockIndex,
    }));
    if (depth === 2) return source.units.flatMap((pair, blockIndex) => pair.map((name, unitIndex) => ({
      id: `${line.id}-unit-${blockIndex}-${unitIndex}`, name, color: line.color, blocks: [line.blocks[blockIndex]],
      point: gridPoint(blockIndex ? 8 : 2.5, unitIndex ? 5.1 : 1.5), lineIndex, blockIndex, unitIndex,
    })));
    return source.items.map((name, itemIndex) => {
      const unitGlobal = Math.floor(itemIndex / 3);
      const blockIndex = Math.floor(unitGlobal / 2);
      const unitIndex = unitGlobal % 2;
      const itemSlot = itemIndex % 3;
      return {
        id: `${line.id}-item-${itemIndex}`, name, color: line.color, blocks: [line.blocks[blockIndex]],
        point: gridPoint(blockIndex * 5.5 + .9 + itemSlot * 1.75, unitIndex * 3.5 + 1.45),
        lineIndex, blockIndex, unitIndex, itemIndex,
      };
    });
  });

  const targets = rawTargets.map((target, index) => {
    const actualSystems = [...new Set(target.blocks.map(block => block.system))];
    const supportPattern = [0, 0, 1, 0, 2, 0, 1, 3];
    const demoExtraCount = depth === 0 ? index % 3 : supportPattern[index % supportPattern.length];
    const systems = [...new Set([...actualSystems, ...demoSystemPool.slice(0, demoExtraCount)])];
    return { ...target, systems, itemCount: target.blocks.length, projected: project(target.point) };
  });
  useEffect(() => setSliceTarget(null), [grain]);

  const cells = [];
  for (let row = 0; row < 14; row += 1) {
    for (let column = 0; column < 22; column += 1) {
      const cornerCut = (row === 0 || row === 13) && (column < 2 || column > 19);
      const edgeCut = (row === 1 || row === 12) && (column === 0 || column === 21);
      if (cornerCut || edgeCut) continue;
      const verticalSplit = 10.5 + ((row % 5) - 2) * .38;
      const horizontalSplit = 6.5 + ((column % 6) - 3) * .2;
      const lineIndex = (row < horizontalSplit ? 0 : 2) + (column < verticalSplit ? 0 : 1);
      const localColumn = column % 11;
      const localRow = row % 7;
      const blockIndex = localColumn < 5.5 ? 0 : 1;
      const unitIndex = localRow < 3.5 ? 0 : 1;
      const itemSlot = Math.min(2, Math.floor((localColumn % 5.5) / 1.84));
      const itemIndex = blockIndex * 6 + unitIndex * 3 + itemSlot;
      const target = depth === 0
        ? targets.find(item => item.lineIndex === lineIndex)
        : depth === 1
          ? targets.find(item => item.lineIndex === lineIndex && item.blockIndex === blockIndex)
          : depth === 2
            ? targets.find(item => item.lineIndex === lineIndex && item.blockIndex === blockIndex && item.unitIndex === unitIndex)
            : targets.find(item => item.lineIndex === lineIndex && item.itemIndex === itemIndex);
      const point = project({ x: 12 + (column + (row % 2) * .5) * 3.72, y: 10 + row * 5.82 });
      cells.push({ id: `${row}-${column}`, row, column, lineIndex, blockIndex, unitIndex, point, target });
    }
  }
  const cellLookup = new Map(cells.map(cell => [`${cell.row}-${cell.column}`, cell]));
  cells.forEach(cell => {
    const offsets = cell.row % 2 === 0
      ? [[-1,0],[1,0],[0,-1],[-1,-1],[0,1],[-1,1]]
      : [[-1,0],[1,0],[0,-1],[1,-1],[0,1],[1,1]];
    const neighbors = offsets.map(([dx, dy]) => cellLookup.get(`${cell.row + dy}-${cell.column + dx}`));
    cell.mainlineEdge = neighbors.some(neighbor => !neighbor || neighbor.lineIndex !== cell.lineIndex);
    cell.blockEdge = neighbors.some(neighbor => !neighbor || `${neighbor.lineIndex}-${neighbor.blockIndex}` !== `${cell.lineIndex}-${cell.blockIndex}`);
    cell.unitEdge = neighbors.some(neighbor => !neighbor || `${neighbor.lineIndex}-${neighbor.blockIndex}-${neighbor.unitIndex}` !== `${cell.lineIndex}-${cell.blockIndex}-${cell.unitIndex}`);
  });

  const moveTerrain = event => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    setTerrainView(view => ({
      yaw: Math.max(-28, Math.min(28, view.yaw + dx * .18)),
      pitch: Math.max(-12, Math.min(32, view.pitch - dy * .12)),
    }));
    drag.current = { x: event.clientX, y: event.clientY };
  };

  return <div className={`system-terrain grain-${depth}`} onPointerDown={event => {
    if (event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
  }} onPointerMove={moveTerrain} onPointerUp={() => drag.current = null} onPointerCancel={() => drag.current = null} onWheel={event => {
    event.preventDefault();
    setTerrainZoom(value => Math.max(.72, Math.min(1.85, value - event.deltaY * .001)));
  }}>
    <div className="terrain-plane" />
    <div className="hex-terrain">
      {cells.map(cell => {
        const uncoveredCell = (cell.row * 5 + cell.column * 3 + cell.lineIndex) % 13 === 0;
        const supportCount = uncoveredCell ? 0 : cell.target?.systems.length || 0;
        const coverage = supportCount >= 4 ? "coverage-high" : supportCount >= 2 ? "coverage-medium" : "coverage-low";
        return <button key={cell.id} aria-label={`${cell.target?.name || "业务事项"}，${supportCount}个支撑系统`} className={`hex-cell territory-${cell.lineIndex} ${coverage} ${sliceTarget?.cellId === cell.id ? "slice-active" : ""}`} style={{ left: `${cell.point.x}%`, top: `${cell.point.y}%`, "--cell-color": tree[cell.lineIndex].color, "--cell-height": `${2 + supportCount * 2}px`, "--cell-scale": `${(.82 + cell.point.y / 420) * terrainZoom}` }} onClick={() => {
          if (supportCount > 0) setSliceTarget({ ...cell.target, cellId: cell.id, point: cell.point });
        }} />;
      })}
    </div>
    {terrainZoom >= 1.18 && targets.map((target, targetIndex) => {
      const supportCount = target.systems.length;
      const compact = depth === 3;
      const showItemLabel = !compact || targetIndex % 2 === 0;
      if (!showItemLabel) return null;
      return <button key={target.id} className={`hex-label ${compact ? "item-label" : ""}`} style={{ left: `${target.projected.x}%`, top: `${target.projected.y}%`, "--label-color": target.color }} onClick={() => {
        if (supportCount === 1) {
          const system = target.systems[0];
          setSelected({ type: "system", name: system, ...systemProfiles[system], business: target.name });
        }
      }}><b>{target.name}</b><span>{supportCount}个系统</span></button>;
    })}
    <div className="beam-field" key={grain}>
      {targets.map((target, targetIndex) =>
        <div key={target.id} className={`support-beam ${target.systems.length >= 4 ? "beam-strong" : target.systems.length >= 2 ? "beam-medium" : ""}`} style={{ left: `${target.projected.x}%`, top: `${target.projected.y}%`, "--delay": `${.18 + targetIndex * .13}s`, "--beam-color": target.color }}>
          <i className="beam-line" /><i className="beam-impact" /><i className="beam-ring" /><i className="beam-particle particle-a" /><i className="beam-particle particle-b" /><i className="beam-particle particle-c" />
        </div>
      )}
    </div>
    <ViewController view={terrainView} setView={setTerrainView} />
    {sliceTarget && <div className="system-slice" style={{ left: `${sliceTarget.point.x}%`, top: `${sliceTarget.point.y}%`, "--slice-color": sliceTarget.color }}>
      <i className="slice-axis" /><i className="slice-base-ring" />
      <button className="slice-close" onClick={() => setSliceTarget(null)}>×</button>
      <div className="slice-caption"><b>{sliceTarget.name}</b><span>{sliceTarget.systems.length}个系统支撑</span></div>
      <div className="slice-stack">
        {sliceTarget.systems.map((system, index) => {
          const profile = systemProfiles[system] || { status: "在用", category: "公共能力", owner: "数字化管理处", users: "跨处室使用", services: "多项业务", data: "共享数据资源", health: 80 + index * 3 };
          return <button key={system} className="slice-system-card" style={{ "--slice-index": index, "--slice-delay": `${index * .08}s` }} onClick={() => setSelected({ type: "system", name: system, ...profile, business: sliceTarget.name })}>
            <i /><b>{system}</b><span>{profile.status} · {profile.category}</span><em>{String(index + 1).padStart(2, "0")}</em>
          </button>;
        })}
      </div>
    </div>}
    <div className="zoom-controls"><button onClick={() => setTerrainZoom(value => Math.min(1.85, value + .15))}>＋</button><b>{Math.round(terrainZoom * 100)}%</b><button onClick={() => setTerrainZoom(value => Math.max(.72, value - .15))}>－</button></div>
    <div className="hex-legend"><span>系统覆盖</span><i className="heat-0" />0<i className="heat-1" />1<i className="heat-2" />2-3<i className="heat-3" />4+</div>
    <div className="terrain-tip">拖动调整视角 · 滚轮缩放 · 放大后显示业务名称</div>
  </div>;
}

function BusinessTree({ activeLayer, selected, setSelected, timeline, lens, view, onDrill, businessView, systemGrain }) {
  if (activeLayer === "业务") return <div className={`business-morph morph-${businessView}`}>
    <div className="morph-layer morph-sphere"><SpatialBusinessSpheres view={view} onSelect={setSelected} onDrill={onDrill} /></div>
    <div className="morph-layer morph-flat"><DenseBusinessFlow onSelect={setSelected} onDrill={onDrill} view={view} /></div>
  </div>;
  if (activeLayer === "系统") return <SystemTerrain grain={systemGrain} setSelected={setSelected} />;
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
  const [activeLayer, setActiveLayer] = useState("业务");
  const [selected, setSelected] = useState(null);
  const [timeline, setTimeline] = useState("现状");
  const [lens, setLens] = useState(false);
  const [view, setView] = useState({ yaw: 0, pitch: 0 });
  const [drill, setDrill] = useState(null);
  const [businessView, setBusinessView] = useState("spatial");
  const [systemGrain, setSystemGrain] = useState("业务事项");
  const enterUnit = () => { setTransitioning(true); setTimeout(() => { setMode("unit"); setTransitioning(false); setSelected(null); }, 680); };
  const back = () => { setTransitioning(true); setTimeout(() => { setMode("city"); setTransitioning(false); setSelected(null); }, 520); };
  const switchLayer = layer => { setActiveLayer(layer); setSelected(null); };

  return <main className={`app ${mode} ${transitioning ? "transitioning" : ""}`}>
    <ParticleField mode={mode} burst={transitioning} /><div className="aurora aurora-a" /><div className="aurora aurora-b" />
    <header className="topbar">
      <div className="brand-mark"><span /><span /><span /></div><div><div className="eyebrow">JINAN DIGITAL GOVERNANCE</div><h1>数字化诊断全景图</h1></div>
      <div className="topbar-right"><div className="mode-switch"><button className={mode === "city" ? "active" : ""}>全景研判</button><button onClick={() => mode === "city" && enterUnit()}>单位全景</button></div><div className="live"><i /> 数据动态映射中</div></div>
    </header>
    <section className="stage">
      {mode === "city" ? <>
        <div className="city-space" style={{ transform: `perspective(1000px) rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` }}><CityConnections />
        <div className="intro"><div className="section-no">01 / 全市全景</div><h2>济南市数字化<br /><strong>业务星系</strong></h2><p>以业务为核心，映射单位、系统与项目的支撑关系</p></div>
        <div className="metrics"><div><b>42</b><span>接入单位</span></div><div><b>268</b><span>业务主线</span></div><div><b>1,036</b><span>业务事项</span></div><div><b>82.6%</b><span>数字化覆盖率</span></div></div>
        <div className="universe">{units.map((unit, index) => <button key={unit.id} className={`star-node ${unit.tone} ${hovered === unit.id ? "hovered" : ""}`} style={{ left: `${unit.x}%`, top: `${unit.y}%`, "--size": `${unit.size}px`, "--float-delay": `${-index * .7}s`, "--float-range": `${5 + index % 4}px` }} onPointerEnter={() => setHovered(unit.id)} onPointerLeave={() => setHovered(null)} onClick={enterUnit}><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="star-core" /><span className="star-label"><b>{unit.name}</b><em>指数 {unit.score}</em></span></button>)}</div></div>
        <ViewController view={view} setView={setView} />
        <div className="legend"><span><i className="dot gold-dot" />重点单位</span><span><i className="dot blue-dot" />市直单位</span><span><i className="line-key" />业务协同关系</span></div><div className="guide">移动鼠标探索 · 点击单位进入全景</div>
      </> : <>
        <button className="back-button" onClick={back}>← 返回全市</button>
        <div className="unit-titlebar"><div><div className="section-no">02 / 单位业务全景</div><h2>济南市城市运行管理局</h2></div><div className="mini-metrics"><span><b>4</b>主线</span><span><b>8</b>板块</span><span><b>16</b>单元</span><span><b>32</b>事项</span></div></div>
        <div className="tree-toolbar">
          <div className="layers">{["业务","系统","项目","诊断"].map(layer => <button key={layer} className={activeLayer === layer ? "active" : ""} onClick={() => switchLayer(layer)}><i />{layer}</button>)}</div>
          {activeLayer === "业务" && <div className="business-view-switch"><button className={businessView === "spatial" ? "active" : ""} onClick={() => setBusinessView("spatial")}>空间球图</button><button className={businessView === "flat" ? "active" : ""} onClick={() => setBusinessView("flat")}>平铺流图</button></div>}
          {activeLayer === "系统" && <div className="grain-switch"><small>底图粒度</small>{grainOrder.map(grain => <button key={grain} className={systemGrain === grain ? "active" : ""} onClick={() => { setSystemGrain(grain); setSelected(null); }}>{grain.replace("业务", "")}</button>)}</div>}
          <div className="timeline">{["现状","建成后","规划目标"].map(t => <button key={t} className={timeline === t ? "active" : ""} onClick={() => setTimeline(t)}>{t}</button>)}</div>
          <button className={`lens-button ${lens ? "active" : ""}`} onClick={() => { setLens(!lens); if (!lens) setActiveLayer("诊断"); }}>诊断透镜</button>
        </div>
        <BusinessTree activeLayer={activeLayer} selected={selected} setSelected={setSelected} timeline={timeline} lens={lens} view={view} onDrill={setDrill} businessView={businessView} systemGrain={systemGrain} />
        {activeLayer !== "系统" && <ViewController view={view} setView={setView} />}
        <div className="tree-hint">点击任一节点查看业务纵向穿透或系统横向剖切</div>
      </>}
    </section>
    <DetailDrawer selected={selected} onClose={() => setSelected(null)} />
    {drill && <DrillPage data={drill} onBack={() => setDrill(null)} />}
    <div className="transition-flare" />
    <footer><span>业务 · 系统 · 项目 · 诊断</span><span>济南市数字化诊断平台 / DEMO 02</span></footer>
  </main>;
}
