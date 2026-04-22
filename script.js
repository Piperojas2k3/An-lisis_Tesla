// ==========================================
// 1. NAVEGACIÓN Y TABS
// ==========================================
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.seccion-tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('activo'));
        sections.forEach(s => s.classList.add('oculto'));
        sections.forEach(s => s.classList.remove('activa'));

        tab.classList.add('activo');
        const targetId = tab.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        targetSection.classList.remove('oculto');
        
        setTimeout(() => { targetSection.classList.add('activa'); }, 50);

        // Disparar animaciones/gráficos según la pestaña
        if(targetId === 'tab-datos') { renderRadar(); }
        if(targetId === 'tab-financiero') { renderMargen(); animarNumeros(); }
    });
});

// ==========================================
// 2. LÍNEA DE TIEMPO INTERACTIVA
// ==========================================
const datosTimeline = {
    '2008': { tit: "2008: Dependencia Total", desc: "Tesla fabricaba el Roadster dependiendo del chasis de Lotus y celdas genéricas. Riesgo extremo de mercado." },
    '2014': { tit: "2014: Giga Nevada (Modelo Híbrido)", desc: "Alianza con Panasonic. Primer paso hacia la integración vertical para asegurar el suministro de celdas ante la alta especificidad." },
    '2019': { tit: "2019: Chip FSD (Independencia)", desc: "Ruptura con Nvidia. Tesla diseña su propio chip de IA. Integración hacia atrás para proteger sus cuasi-rentas tecnológicas." },
    '2023': { tit: "2023: Refinería de Litio", desc: "Control total de la cadena (Upstream). Tesla se convierte en el acreedor residual absoluto de su tecnología." }
};

window.mostrarInfoYear = (year, btn) => {
    document.querySelectorAll('.btn-year').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    document.getElementById('year-title').textContent = datosTimeline[year].tit;
    document.getElementById('year-desc').textContent = datosTimeline[year].desc;
};

// ==========================================
// 3. MAPA INTERACTIVO (GIGA-NETWORK)
// ==========================================
document.querySelectorAll('.nodo-mapa').forEach(nodo => {
    nodo.addEventListener('mouseenter', (e) => {
        document.getElementById('info-mapa').textContent = e.target.getAttribute('data-info');
    });
    nodo.addEventListener('mouseleave', () => {
        document.getElementById('info-mapa').textContent = "Pasa el cursor por un nodo...";
    });
});

// ==========================================
// 4. ANIMACIÓN DE NÚMEROS (FINANCIERO)
// ==========================================
let numerosAnimados = false;
function animarNumeros() {
    if(numerosAnimados) return;
    document.querySelectorAll('.anim-num').forEach(el => {
        let target = parseFloat(el.getAttribute('data-target'));
        let isDecimal = target % 1 !== 0;
        let val = 0;
        let speed = target / 40; 
        let update = () => {
            val += speed;
            if(val < target) {
                el.innerText = isDecimal ? val.toFixed(1) : Math.floor(val);
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        };
        update();
    });
    numerosAnimados = true;
}

// ==========================================
// 5. GRÁFICOS (CHART.JS)
// ==========================================
Chart.defaults.color = '#8b949e';
Chart.defaults.font.family = "'Inter', sans-serif";

// 5.1 Termómetro de Hold-Up
const ctxHoldUp = document.getElementById('chart-holdup').getContext('2d');
const sEspec = document.getElementById('slider-espec');
let chartHoldUp;

function updateHoldUp() {
    let espec = parseInt(sEspec.value);
    document.getElementById('val-espec').textContent = espec;
    let poder = espec;
    let margen = 100 - poder;

    if(chartHoldUp) {
        chartHoldUp.data.datasets[0].data = [poder, margen];
        chartHoldUp.update();
    } else {
        chartHoldUp = new Chart(ctxHoldUp, {
            type: 'doughnut',
            data: { labels: ['Poder del Proveedor', 'Margen de Tesla'], datasets: [{ data: [poder, margen], backgroundColor: ['#ff3b30', '#30d158'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, rotation: -90, circumference: 180, cutout: '70%', plugins: { legend: { position: 'right' } } }
        });
    }
}
sEspec.addEventListener('input', updateHoldUp);
updateHoldUp();

// 5.2 Radar Chart
let chartRadar;
function renderRadar() {
    if(chartRadar) return;
    chartRadar = new Chart(document.getElementById('chart-radar').getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['Software IA', 'Baterías', 'Red Carga', 'Ventas Directas', 'Ensamblaje'],
            datasets: [
                { label: 'Tesla', data: [100, 90, 100, 100, 100], backgroundColor: 'rgba(255, 59, 48, 0.2)', borderColor: '#ff3b30', borderWidth: 2 },
                { label: 'OEM Clásico', data: [20, 10, 10, 0, 70], backgroundColor: 'rgba(10, 132, 255, 0.2)', borderColor: '#0a84ff', borderWidth: 2 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#f0f6fc', font: {size: 10} }, ticks: { display: false } } } }
    });
}

// 5.3 Bar Chart Margen
let chartMargen;
function renderMargen() {
    if(chartMargen) return;
    chartMargen = new Chart(document.getElementById('chart-margen').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Q1-23', 'Q2-23', 'Q3-23', 'Q4-23', 'Q1-24'],
            datasets: [{ label: 'Margen Neto (%)', data: [16.5, 14.2, 11.8, 9.5, 7.26], backgroundColor: '#ff3b30', borderRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
    });
}

// ==========================================
// 6. SIMULADOR GIGANTE (PUNTO ÓPTIMO)
// ==========================================
const ctxSimulador = document.getElementById('chart-simulador').getContext('2d');
const sliderBuro = document.getElementById('slider-burocracia');
const sliderFricc = document.getElementById('slider-friccion');
let chartSimulador;

window.aplicarSimulador = (buro, fric) => { sliderBuro.value = buro; sliderFricc.value = fric; updateSimulador(); };

function updateSimulador() {
    let buro = parseInt(sliderBuro.value);
    let fric = parseInt(sliderFricc.value);
    document.getElementById('val-burocracia').textContent = buro;
    document.getElementById('val-friccion').textContent = fric;

    let labels = [], dCC = [], dCT = [], dTot = [], min = Infinity, opt = 0;
    for(let x=0; x<=5; x+=0.5){
        let cc = 100 + buro * x*x; let ct = Math.max(0, fric - 400*x); let tot = cc + ct;
        labels.push(x.toFixed(1)); dCC.push(cc); dCT.push(ct); dTot.push(tot);
        if(tot < min) { min = tot; opt = x; }
    }

    const txt = document.getElementById('texto-veredicto');
    const exp = document.getElementById('explicacion-veredicto');
    const caja = document.getElementById('caja-veredicto');

    if(opt < 1.5) { 
        txt.textContent = "TERCERIZAR"; txt.style.color = "var(--accent-blue)"; caja.style.borderLeftColor = "var(--accent-blue)";
        exp.textContent = "Fricción baja. Subcontrata para evitar costos fijos.";
    } else if(opt > 3.5) { 
        txt.textContent = "JERARQUÍA (TESLA)"; txt.style.color = "var(--accent-red)"; caja.style.borderLeftColor = "var(--accent-red)";
        exp.textContent = "Alto riesgo de Hold-Up. Internaliza en Gigafactories.";
    } else { 
        txt.textContent = "HÍBRIDO"; txt.style.color = "var(--accent-green)"; caja.style.borderLeftColor = "var(--accent-green)";
        exp.textContent = "Alianzas estratégicas (ej. Tesla + Panasonic).";
    }

    if(chartSimulador) {
        chartSimulador.data.labels = labels; chartSimulador.data.datasets[0].data = dCC; chartSimulador.data.datasets[1].data = dCT; chartSimulador.data.datasets[2].data = dTot; chartSimulador.update();
    } else {
        chartSimulador = new Chart(ctxSimulador, {
            type:'line',
            data: { labels, datasets: [
                { label: 'C. Coordinación (Burocracia)', data: dCC, borderColor: '#ff3b30', tension: 0.4 },
                { label: 'C. Transacción (Mercado)', data: dCT, borderColor: '#0a84ff', tension: 0.4 },
                { label: 'Costo Total de la Empresa', data: dTot, borderColor: '#30d158', borderWidth: 4, fill: true, backgroundColor: 'rgba(48, 209, 88, 0.1)' }
            ]},
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' } }, y: { min: 0, grid: { color: 'rgba(255,255,255,0.05)' } } } }
        });
    }
}
sliderBuro.addEventListener('input', updateSimulador);
sliderFricc.addEventListener('input', updateSimulador);
updateSimulador();

// ==========================================
// 7. MOTOR 3D (BACKGROUND)
// ==========================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;

const particles = [];
const geometry = new THREE.IcosahedronGeometry(0.5, 0);
for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color: 0x0a84ff, metalness: 0.8, roughness: 0.2 }));
    mesh.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*20);
    scene.add(mesh);
    particles.push({ mesh, x: mesh.position.x, y: mesh.position.y, z: mesh.position.z });
}

function animate3D() {
    requestAnimationFrame(animate3D);
    scene.rotation.y += 0.001;
    particles.forEach((p, i) => { p.mesh.position.y += Math.sin(Date.now()*0.001 + i)*0.005; });
    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
