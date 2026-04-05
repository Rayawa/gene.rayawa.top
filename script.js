
let currentStep = 1;
let s2SelectedTools = new Set();
let s3Progress = 'step1'; // step1: 质粒导入, step2: T-DNA导入
let timeElapsed = 0;
let timerId = null;
let isTimerRunning = true;

function showToast(text) {
    const toast = document.getElementById('toast-msg');
    toast.innerText = text;
    toast.style.opacity = "1";
    setTimeout(() => toast.style.opacity = "0", 3000);
}

window.onload = () => {
    timerId = setInterval(() => {
        if (!isTimerRunning) return;
        timeElapsed++;
        const m = Math.floor(timeElapsed / 60);
        const s = timeElapsed % 60;
        document.getElementById('display-time').innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
};

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerId);
}

/* --- STAGE 1 --- */
function extractBt() {
    if (state[1].bt) return;
    const res = document.getElementById('bt-result');
    res.classList.remove('hidden');
    res.classList.add('extract-bt-anim');
    state[1].bt = true;
    checkS1();
}
function extractTi() {
    if (state[1].ti) return;
    const res = document.getElementById('ti-result');
    res.classList.remove('hidden');
    res.classList.add('extract-ti-anim');
    state[1].ti = true;
    checkS1();
}
function checkS1() {
    if (state[1].bt && state[1].ti) document.getElementById('submit-btn').disabled = false;
}

/* --- STAGE 2 --- *//* --- STAGE 2 --- */
const s2SelectedComps = new Set();

// 确保 state 已经定义在全局作用域
let state = {
    1: { bt: false, ti: false },
    2: { inserted: false, validated: false },
    3: { agroConverted: false, plantInfected: false },
    4: { done: false }
};

// 允许拖拽进入
function allowDrop(ev) {
    ev.preventDefault();
}

// 开始拖拽：必须标记类型
function onS2DragStart(ev) {
    ev.dataTransfer.setData("type", "bt-gene");
}

// 正确放置：插入到 T-DNA 区域
// 正确放置 Bt 基因
function handleS2Insertion(ev) {
    ev.preventDefault();
    const dataType = ev.dataTransfer.getData("type");
    
    if (dataType === "bt-gene") {
        // --- 1. 状态和基础视觉更新 ---
        state[2].inserted = true;

        // 隐藏拖拽源
        const btGene = document.getElementById('bt-green-gene');
        if (btGene) btGene.classList.add('invisible');

        // --- 2. 核心视觉修改：实现“留白”插入效果 ---
        const tdnaCore = document.getElementById('tdna-core');
        if (!tdnaCore) return;

        // 获取原 T-DNA 核心的 SVG 命名空间和关键属性
        const svgns = "http://www.w3.org/2000/svg";
        const svgElement = tdnaCore.ownerSVGElement;
        
        // 如果已经插入过，就不重复创建（防止多次拖拽bug）
        if (document.getElementById('bt-inserted-segment')) return;

        // 获取原橙色弧线的 dash 属性 (格式为 "实线长度 虚线长度")
        const originalDashArray = tdnaCore.getAttribute('stroke-dasharray').split(' ');
        const originalSolidLength = parseFloat(originalDashArray[0]); // T-DNA 实线总长 (约 139.62)
        const originalDashOffset = parseFloat(tdnaCore.getAttribute('stroke-dashoffset')); // 偏移量 (约 -139.62)

        // 定义绿色基因片段的长度 (比如占 80%)，两头各留 10% 橙色
        const greenPercent = 0.4;
        const greenSolidLength = originalSolidLength * greenPercent;
        
        // 计算绿色的偏移量，使其居中叠加在橙色上面
        // 新偏移量 = 原偏移量 - (橙色长度 - 绿色长度) / 2
        // 注意：因为原 offset 是负数，这里需要做负数加法才能让弧线逆时针移动（看起来居中）
        const greenDashOffset = originalDashOffset - (originalSolidLength - greenSolidLength) / 2;

        // 创建新的绿色 circle 元素来代表 Bt 基因
        const btSegment = document.createElementNS(svgns, "circle");
        
        // 复制原 T-DNA 的坐标和半径
        btSegment.setAttribute("cx", tdnaCore.getAttribute("cx"));
        btSegment.setAttribute("cy", tdnaCore.getAttribute("cy"));
        btSegment.setAttribute("r", tdnaCore.getAttribute("r"));
        
        // 设置新的样式和位置
        btSegment.setAttribute("fill", "none");
        btSegment.setAttribute("stroke", "#22c55e"); // 绿色
        btSegment.setAttribute("stroke-width", "20"); // 保持宽度一致
        
        // 关键：设置新的 dasharray 和 offset
        // 实线部分是计算出的短绿色，虚线部分必须足够长以填满圆周 (originalSolidLength * 5 是个安全值)
        btSegment.setAttribute("stroke-dasharray", `${greenSolidLength} ${originalSolidLength * 5}`);
        btSegment.setAttribute("stroke-dashoffset", greenDashOffset.toString());
        
        // 设置 ID 以便管理，并添加脉冲动画
        btSegment.setAttribute("id", "bt-inserted-segment");
        btSegment.classList.add('animate-pulse');

        // 将绿色片段插入到 SVG 中，它会自动叠加在橙色上面
        svgElement.appendChild(btSegment);

        // 原橙色 tdnaCore 保持原样不用动，它会自动露出两头

        // --- 3. 后续阶段引导 ---
        const guide = document.getElementById('s2-guide');
        if (guide) {
            guide.classList.remove('hidden', 'text-red-600');
            guide.classList.add('text-green-600', 'font-bold');
            guide.innerHTML = "✅ 成功！Bt基因片段已整合至 T-DNA 核心区域";
        }

        setTimeout(() => {
            if (typeof initS2Components === 'function') {
                initS2Components();
            }
            const phase2 = document.getElementById('s2-phase-2');
            if (phase2) {
                phase2.classList.remove('hidden');
                phase2.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
    }
}

// 错误放置：逻辑反馈
function handleS2WrongDrop(ev) {
    ev.preventDefault();
    const dataType = ev.dataTransfer.getData("type");
    
    if (dataType === "bt-gene") {
        const guide = document.getElementById('s2-guide');
        guide.classList.remove('hidden', 'text-green-600');
        guide.classList.add('text-red-600', 'font-bold', 'animate-bounce');
        guide.innerHTML = "❌ 放置位置不正确。Bt 基因必须整合在 T-DNA 核心区才能进入植物细胞！";
        
        // 500ms 后移除抖动动画，方便下次触发
        setTimeout(() => guide.classList.remove('animate-bounce'), 500);
    }
}

function initS2Components() {
    const comps = ["启动子", "终止子", "标记基因", "复制原点", "内含子", "起始密码子"];
    const container = document.getElementById('comp-container');
    container.innerHTML = '';
    comps.forEach(c => {
        const btn = document.createElement('button');
        btn.className = "component-btn";
        btn.innerText = c;
        btn.onclick = () => {
            if (s2SelectedComps.has(c)) {
                s2SelectedComps.delete(c);
                btn.classList.remove('selected');
            } else {
                s2SelectedComps.add(c);
                btn.classList.add('selected');
            }
        };
        container.appendChild(btn);
    });
}

function checkFinalS2() {
    const required = ["启动子", "终止子", "标记基因", "复制原点"];
    // 1. 找出缺少的元件
    const missing = required.filter(x => !s2SelectedComps.has(x));
    // 2. 找出多余的元件
    const extra = Array.from(s2SelectedComps).filter(x => !required.includes(x));
    
    const guide = document.getElementById('s2-guide');
    guide.classList.remove('hidden');

    // 逻辑判定：既不能缺，也不能多
    if (missing.length === 0 && extra.length === 0) {
        guide.innerHTML = "<p class='text-green-700 font-bold'>✅ 载体构建精准无误！Ti质粒已准备就绪。</p>";
        state[2].validated = true;
        
        // 如果有提交按钮，解除禁用
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) submitBtn.disabled = false;
        
    } else if (missing.length > 0) {
        // 情况 A：缺少必要元件
        guide.innerHTML = `<p class='text-red-600 font-bold'>❌ 载体功能不全：还缺少 ${missing.join('、')}</p>`;
        state[2].validated = false;
    } else if (extra.length > 0) {
        // 情况 B：多了不该有的东西（比如插入了两个启动子或无关片段）
        guide.innerHTML = `<p class='text-orange-600 font-bold'>⚠️ 载体构建冗余：${extra.join('、')} 是多余的，这可能导致表达异常或载体过大。</p>`;
        state[2].validated = false;
    }
}
/* --- STAGE 3 (RECONSTRUCTED LOGIC) --- */
function onS3DragPlasmid(ev) {
    if (s3Progress !== 'step1') return;
    ev.dataTransfer.setData("type", "plasmid");
}

function onS3DragTDNA(ev) {
    if (s3Progress !== 'step2') return;
    ev.dataTransfer.setData("type", "tdna");
}

function onS3Drop(ev, target) {
    ev.preventDefault();
    const type = ev.dataTransfer.getData("type");

    // 路径 1: 质粒导入阶段
    if (s3Progress === 'step1' && type === 'plasmid') {
        if (target === 'plant') {
            showS3Guide("Ti质粒能直接穿过植物细胞壁进入其内部吗？<br><br>想一想：在自然界中，农杆菌是如何将基因传递给植物的？它是整个质粒都进入植物细胞，还是只传递其中的一部分？");
        } else if (target === 'agro') {
            state[3].agroConverted = true;
            completeS3Step1();
        }
    }
    // 路径 2: T-DNA 导入阶段
    else if (s3Progress === 'step2' && type === 'tdna') {
        if (target === 'plant') {
            completeS3Step2();
        } else {
            showToast("T-DNA 已经在农杆菌内了，现在需要侵染谁？");
        }
    }
}

function completeS3Step1() {
    document.getElementById('recomb-plasmid-container').classList.add('hidden');
    document.getElementById('agro-plasmid-placeholder').classList.remove('hidden');
    showToast("✅ 转化成功！农杆菌已获得重组质粒。");
    setTimeout(() => {
        s3Progress = 'step2';
        document.getElementById('s3-title').innerText = "第二步：利用农杆菌侵染植物细胞";
        document.getElementById('tdna-only-container').classList.remove('hidden');
        document.getElementById('target-agro').classList.add('ring-4', 'ring-emerald-400');
        showToast("观察：农杆菌中的 T-DNA 已经准备好出发了！");
    }, 1000);
}

function completeS3Step2() {
    document.getElementById('tdna-only-container').classList.add('hidden');
    document.getElementById('plant-nucleus-dna').classList.replace('bg-slate-200', 'bg-green-600');
    document.getElementById('integrated-mark').classList.remove('hidden');
    state[3].plantInfected = true;
    showToast("🎉 成功！T-DNA 已整合进植物基因组。");
    document.getElementById('submit-btn').disabled = false;
}

function showS3Guide(text) {
    document.getElementById('guide-text').innerHTML = text;
    document.getElementById('s3-guide-modal').classList.remove('hidden');
}

function closeGuide() {
    document.getElementById('s3-guide-modal').classList.add('hidden');
}

/* --- STAGE 4 --- */

function runChecks() {
    const c1 = document.getElementById('check-1');
    const c2 = document.getElementById('check-2');

    c1.innerHTML = `
        <p class="text-xs font-bold mb-2">分子水平检测</p>

        <div class="bg-slate-100 rounded p-2 mb-2">
            <p class="text-[10px]">PCR检测</p>
            <p id="pcr-status" class="text-[10px] text-blue-500 mt-1">扩增中...</p>
        </div>

        <div class="bg-slate-100 rounded p-2">
            <p class="text-[10px]">抗原-抗体杂交</p>
            <p id="wb-status" class="text-[10px] text-blue-500 mt-1">检测中...</p>
        </div>
    `;

    setTimeout(() => {
        document.getElementById('pcr-status').innerText =
            "✔ 成功扩增出目的基因条带 → 说明目的基因已导入";
        document.getElementById('pcr-status').classList.replace('text-blue-500', 'text-green-600');
    }, 1200);

    setTimeout(() => {
        document.getElementById('wb-status').innerText =
            "✔ 检测到目的蛋白表达 → 说明目的基因成功表达";
        document.getElementById('wb-status').classList.replace('text-blue-500', 'text-green-600');
        c1.classList.add('done');
    }, 2000);

    setTimeout(() => {
        c2.innerHTML = `
            <p class="text-xs font-bold mb-2">个体水平鉴定（抗虫性）</p>

            <div class="flex justify-around items-center">
                <!-- 对照组 -->
                <div class="flex flex-col items-center">
                    <p class="text-[10px] font-bold text-slate-500 mb-1">对照组</p>
                    <div class="text-4xl">🌱</div>
                    <div id="worm-normal" class="text-2xl mt-1 transition-all">🐛</div>
                    <p id="normal-status" class="text-[10px] mt-1">取食中...</p>
                </div>

                <!-- 实验组 -->
                <div class="flex flex-col items-center">
                    <p class="text-[10px] font-bold text-blue-600 mb-1">实验组（Bt）</p>
                    <div class="text-4xl">🌱</div>
                    <div id="worm-gm" class="text-2xl mt-1 transition-all">🐛</div>
                    <p id="gm-status" class="text-[10px] mt-1">取食中...</p>
                </div>
            </div>
        `;

        c2.classList.add('done');

        const wormNormal = document.getElementById('worm-normal');
        const wormGM = document.getElementById('worm-gm');

        let step = 0;
        const interval = setInterval(() => {
            step += 3;
            const wiggle = Math.sin(step / 5) * 3; // 左右轻微摆动

            wormNormal.style.transform = `translateY(-${step}px) translateX(${wiggle}px)`;
            wormGM.style.transform = `translateY(-${step}px) translateX(${wiggle}px)`;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);

            document.getElementById('normal-status').innerText = "❌ 正常取食";
            document.getElementById('normal-status').classList.add('text-red-500');

            wormGM.innerText = "💀";
            document.getElementById('gm-status').innerText = "✅ 死亡（抗虫性）";
            document.getElementById('gm-status').classList.add('text-green-600');
        }, 2000);

        setTimeout(() => {
            state[4].done = true;
            stopTimer();
            document.getElementById('submit-btn').disabled = false;
            document.getElementById('submit-btn').innerText = "完成实验 (点击答题)";
        }, 2800);

    }, 3200);
}

function nextStage() {
    if (currentStep === 1) jumpTo(2);
    else if (currentStep === 2) jumpTo(3);
    else if (currentStep === 3) jumpTo(4);
    else if (currentStep === 4) document.getElementById('quiz-modal').classList.remove('hidden');
}

function jumpTo(n) {
    currentStep = n;
    document.querySelectorAll('.stage-content').forEach(s => s.classList.add('hidden'));
    document.getElementById('stage-' + n).classList.remove('hidden');
    document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
    document.getElementById('nav-' + n).classList.add('active');
    document.getElementById('submit-btn').disabled = true;

    if (n === 4) {
        const leaf = document.getElementById('p4-leaf');
        const callus = document.getElementById('p4-callus');
        const plantlet = document.getElementById('p4-plantlet');
        const status = document.getElementById('p4-status');

        leaf.style.opacity = "1";
        status.innerText = "外植体接种中...";

        setTimeout(() => {
            leaf.classList.add('hidden');
            callus.classList.remove('hidden');
            status.innerText = "脱分化形成愈伤组织...";
        }, 1200);

        setTimeout(() => {
            callus.style.transform = "scale(1.2)";
            status.innerText = "细胞分裂活跃...";
        }, 2200);

        setTimeout(() => {
            callus.classList.add('hidden');
            plantlet.classList.remove('hidden');
            plantlet.style.transform = "scale(0.7)"; // 🌱变小
            status.innerText = "再分化形成完整植株";
        }, 3200);

        setTimeout(() => {
            document.getElementById('p4-overlay').classList.add('hidden');
            document.getElementById('p4-start-test').classList.remove('hidden');
        }, 4200);
    }
}

function handleQuiz(btn, correct) {
    if (correct) btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
    else btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
}

function finishAll() {
    document.getElementById('quiz-modal').classList.add('hidden');
    document.getElementById('final-modal').classList.remove('hidden');
    document.getElementById('time-stats').innerText = `实验总耗时：${document.getElementById('display-time').innerText}`;
}
