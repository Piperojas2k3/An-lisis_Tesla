// ==========================================
// 1. LÓGICA DE LA CORTINA Y MODALES
// ==========================================
const cortina = document.getElementById('cortina');
const btnIngresar = document.getElementById('btn-ingresar');
const fondoModal = document.getElementById('fondo-modal');
const modales = document.querySelectorAll('.ventana-modal');

// Abrir la Cortina
btnIngresar.addEventListener('click', () => {
    cortina.classList.add('abierta');
    // Para que una vez que suba, no estorbe los clics
    setTimeout(() => { cortina.style.display = 'none'; }, 1200);
});

// Función para abrir una tarjeta en Pantalla Completa
window.abrirModal = function(idModal) {
    fondoModal.classList.add('activo');
    document.getElementById(idModal).classList.add('activa');
    // Bloquear el scroll del fondo mientras se lee
    document.body.style.overflow = 'hidden';
}

// Función para Regresar (Cerrar) con efecto de achique
window.cerrarModal = function() {
    fondoModal.classList.remove('activo');
    modales.forEach(m => m.classList.remove('activa'));
    // Devolver el scroll al cuerpo
    document.body.style.overflow = 'auto';
}


// ==========================================
// 2. MOTOR 3D (Fondo Dinámico)
// ==========================================
const canvas3D = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 15;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const particles = [];
const geometry = new THREE.IcosahedronGeometry(0.5, 0);

for (let i = 0; i < 70; i++) {
    const material = new THREE.MeshPhysicalMaterial({ color: 0x2997ff, metalness: 0.6, roughness: 0.2, flatShading: true });
    const mesh = new THREE.Mesh(geometry, material);
    
    const mX = (Math.random() - 0.5) * 40;
    const mY = (Math.random() - 0.5) * 40;
    const mZ = (Math.random() - 0.5) * 20;
    
    const phi = Math.acos(-1 + (2 * i) / 70);
    const theta = Math.sqrt(70 * Math.PI) * phi;
    const r = 4; 
    const iX = r * Math.cos(theta) * Math.sin(phi);
    const iY = r * Math.sin(theta) * Math.sin(phi);
    const iZ = r * Math.cos(phi);

    mesh.position.set(mX, mY, mZ);
    scene.add(mesh);
    particles.push({ mesh, mX, mY, mZ, iX, iY, iZ });
}

let scrollPercent = 0;
document.body.onscroll = () => {
    // Calculamos el scroll solo si la cortina ya se abrió
    if(cortina.classList.contains('abierta')) {
        let maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollPercent = maxScroll > 0 ? document.documentElement.scrollTop / maxScroll : 0;
    }
};

function animate3D() {
    requestAnimationFrame(animate3D);
    scene.rotation.y += 0.002;
    scene.rotation.x += 0.001;

    particles.forEach((p, index) => {
        let targetX, targetY, targetZ;
        let targetColor = new THREE.Color();

        if(scrollPercent < 0.3) {
            targetX = p.mX; targetY = p.mY; targetZ = p.mZ;
            targetColor.setHex(0x2997ff);
        } else if (scrollPercent < 0.6) {
            targetX = p.iX; targetY = p.iY; targetZ = p.iZ;
            targetColor.setHex(0x30d158);
        } else {
            let factor = (scrollPercent - 0.6) * 4;
            targetX = p.iX * (1 + factor * 0.5) + Math.sin(Date.now()*0.005 + index)*0.5;
            targetY = p.iY * (1 + factor * 0.5) + Math.cos(Date.now()*0.005 + index)*0.5;
            targetZ = p.iZ * (1 + factor * 0.5);
            targetColor.setHex(0xff9900);
        }

        p.mesh.position.x += (targetX - p.mesh.position.x) * 0.05;
        p.mesh.position.y += (targetY - p.mesh.position.y) * 0.05;
        p.mesh.position.z += (targetZ - p.mesh.position.z) * 0.05;
        p.mesh.material.color.lerp(targetColor, 0.05);
    });

    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================
// 3. SIMULADOR ESTRATÉGICO
// ==========================================
const ctx = document.getElementById('graficoCostos').getContext('2d');
const b = document.getElementById('burocracia');
const f = document.getElementById('friccion');
const vb = document.getElementById('val-burocracia');
const vf = document.getElementById('val-friccion');
const txt = document.getElementById('texto-veredicto');
const exp = document.getElementById('explicacion');
const caja = document.getElementById('caja-veredicto');

let chart;

window.aplicarEscenario = function(buro, fric){
    b.value = buro;
    f.value = fric;
    update();
}

function calc(){
    let labels=[], datosCC=[], datosCT=[], datosTotal=[];
    let min=Infinity, opt=0;

    for(let x=0; x<=5; x+=0.5){
        let cc = 100 + b.value * (x * x);
        let ct = Math.max(0, f.value - (400 * x)); 
        let t = cc + ct;
        
        labels.push(x.toFixed(1));
        datosCC.push(cc);
        datosCT.push(ct);
        datosTotal.push(t);
        
        if(t < min){ min = t; opt = x; }
    }
    return {labels, datosCC, datosCT, datosTotal, opt};
}

function update(){
    vb.textContent = b.value;
    vf.textContent = f.value;

    let d = calc();

    if(d.opt < 1.5){
        txt.textContent = "COMPRAR";
        txt.style.color = "var(--blue)";
        exp.textContent = "Los proveedores son eficientes. No te desgastes fabricando tú mismo.";
        caja.style.borderLeftColor = "var(--blue)";
    } else if(d.opt > 3.5){
        txt.textContent = "FABRICAR (Caso Tesla)";
        txt.style.color = "var(--red)";
        exp.textContent = "El mercado es muy riesgoso. Debes integrar procesos y controlar tu fábrica.";
        caja.style.borderLeftColor = "var(--red)";
    } else {
        txt.textContent = "MODELO MIXTO";
        txt.style.color = "var(--green)";
        exp.textContent = "Equilibrio perfecto. Fabrica las piezas clave y terceriza lo secundario.";
        caja.style.borderLeftColor = "var(--green)";
    }

    if(chart){
        chart.data.labels = d.labels;
        chart.data.datasets[0].data = d.datosCC;
        chart.data.datasets[1].data = d.datosCT;
        chart.data.datasets[2].data = d.datosTotal;
        chart.update();
    } else {
        Chart.defaults.color = '#a1a1a6';
        Chart.defaults.font.family = "'Montserrat', sans-serif";
        chart = new Chart(ctx,{
            type:'line',
            data:{
                labels: d.labels,
                datasets:[
                    {
                        label: 'Costos de Coordinación (Burocracia)',
                        data: d.datosCC,
                        borderColor: '#e82127',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Costos de Transacción (Mercado)',
                        data: d.datosCT,
                        borderColor: '#2997ff',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Costo Total (Punto Óptimo)',
                        data: d.datosTotal,
                        borderColor: '#30d158',
                        backgroundColor: 'rgba(48, 209, 88, 0.1)',
                        borderWidth: 4,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#000',
                        pointBorderColor: '#30d158',
                        pointRadius: 4
                    }
                ]
            },
            options:{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Grado de Integración Vertical (n)'} },
                    y: { min: 0 }
                }
            }
        });
    }
}

b.addEventListener('input', update);
f.addEventListener('input', update);
update();
