// --- 1. SOLUCIÓN AL RECARGO DE PÁGINA ---
// Forzar al navegador a empezar siempre desde arriba y en la portada
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
    document.getElementById('cortina').classList.remove('abierta');
    paginaActual = "portada";
};

// --- NAVEGACIÓN ---
const cortina = document.getElementById('cortina');
const btnIngresar = document.getElementById('btn-ingresar');
const btnVolverPortada = document.getElementById('btn-volver-portada');
const btnIrSimulador = document.getElementById('btn-ir-simulador');
const btnVolverTeoria = document.getElementById('btn-volver-teoria');

let paginaActual = "portada";

btnIngresar.addEventListener('click', () => {
    cortina.classList.add('abierta');
    paginaActual = "teoria";
});

btnVolverPortada.addEventListener('click', () => {
    cortina.classList.remove('abierta');
    paginaActual = "portada";
    // Devolvemos el scroll arriba suavemente por si bajaron al simulador
    setTimeout(() => { window.scrollTo({top: 0, behavior: 'smooth'}); }, 500);
});

btnIrSimulador.addEventListener('click', () => {
    document.getElementById('seccion-simulador').scrollIntoView({ behavior: 'smooth' });
    paginaActual = "simulador";
});

btnVolverTeoria.addEventListener('click', () => {
    document.getElementById('seccion-teoria').scrollIntoView({ behavior: 'smooth' });
    paginaActual = "teoria";
});

// --- MODALES ---
const fondoModal = document.getElementById('fondo-modal');
window.abrirModal = (id) => {
    fondoModal.classList.add('activo');
    document.getElementById(id).classList.add('activa');
};
window.cerrarModal = () => {
    fondoModal.classList.remove('activo');
    document.querySelectorAll('.ventana-modal').forEach(m => m.classList.remove('activa'));
};

// --- MOTOR 3D ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;

const particles = [];
const geometry = new THREE.IcosahedronGeometry(0.5, 0);

for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color: 0x2997ff, metalness: 0.5, roughness: 0.1 }));
    mesh.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*20);
    scene.add(mesh);
    particles.push({ mesh, x: mesh.position.x, y: mesh.position.y, z: mesh.position.z });
}

function animate3D() {
    requestAnimationFrame(animate3D);
    scene.rotation.y += 0.002;

    particles.forEach((p, i) => {
        let tx, ty, tz, color = new THREE.Color();

        if (paginaActual === "portada") {
            tx = p.x; ty = p.y; tz = p.z;
            color.setHex(0x2997ff);
        } else if (paginaActual === "teoria") {
            const r = 5;
            tx = r * Math.sin(i); ty = r * Math.cos(i); tz = 0;
            color.setHex(0x30d158);
        } else {
            tx = (i - 30) * 0.5; ty = Math.sin(Date.now()*0.002 + i)*2; tz = 0;
            color.setHex(0xe82127);
        }

        p.mesh.position.x += (tx - p.mesh.position.x) * 0.05;
        p.mesh.position.y += (ty - p.mesh.position.y) * 0.05;
        p.mesh.position.z += (tz - p.mesh.position.z) * 0.05;
        p.mesh.material.color.lerp(color, 0.05);
    });
    renderer.render(scene, camera);
}
animate3D();

// --- SIMULADOR ---
const ctx = document.getElementById('graficoCostos').getContext('2d');
const b = document.getElementById('burocracia');
const f = document.getElementById('friccion');
const exp = document.getElementById('explicacion'); // Referencia para el texto
let chart;

window.aplicarEscenario = (buro, fric) => { b.value = buro; f.value = fric; update(); };

function update() {
    document.getElementById('val-burocracia').textContent = b.value;
    document.getElementById('val-friccion').textContent = f.value;
    
    let labels = [], dCC = [], dCT = [], dTot = [], min = Infinity, opt = 0;
    for(let x=0; x<=5; x+=0.5){
        let cc = 100 + b.value * x*x, ct = Math.max(0, f.value - 400*x), tot = cc + ct;
        labels.push(x.toFixed(1)); dCC.push(cc); dCT.push(ct); dTot.push(tot);
        if(tot < min) { min = tot; opt = x; }
    }

    const txt = document.getElementById('texto-veredicto');
    
    // Aquí está el texto de explicación restaurado
    if(opt < 1.5) { 
        txt.textContent = "COMPRAR"; 
        txt.style.color = "var(--blue)"; 
        exp.textContent = "Los proveedores son eficientes y baratos. No te desgastes fabricando tú mismo.";
    }
    else if(opt > 3.5) { 
        txt.textContent = "FABRICAR"; 
        txt.style.color = "var(--red)"; 
        exp.textContent = "El mercado es muy riesgoso y abusivo. Debes integrar procesos y controlar tu fábrica.";
    }
    else { 
        txt.textContent = "MIXTO"; 
        txt.style.color = "var(--green)"; 
        exp.textContent = "Equilibrio perfecto. Fabrica las piezas clave y terceriza lo secundario.";
    }

    if(chart) {
        chart.data.labels = labels; chart.data.datasets[0].data = dCC; chart.data.datasets[1].data = dCT; chart.data.datasets[2].data = dTot; chart.update();
    } else {
        chart = new Chart(ctx, {
            type:'line',
            data: { labels, datasets: [
                { label: 'C. Coordinación', data: dCC, borderColor: '#e82127', tension: 0.4 },
                { label: 'C. Transacción', data: dCT, borderColor: '#2997ff', tension: 0.4 },
                { label: 'Costo Total', data: dTot, borderColor: '#30d158', borderWidth: 4, fill: true, backgroundColor: 'rgba(48, 209, 88, 0.1)' }
            ]},
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { 
                    x: { grid: { color: 'rgba(255,255,255,0.1)' } }, // Grillas más sutiles para el nuevo fondo
                    y: { min: 0, grid: { color: 'rgba(255,255,255,0.1)' } } 
                },
                plugins: {
                    legend: { labels: { color: '#f5f5f7' } }
                }
            }
        });
    }
}
b.oninput = update; f.oninput = update; update();
