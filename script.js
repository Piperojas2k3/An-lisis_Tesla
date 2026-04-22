// ==========================================
// 1. BASE DE DATOS DEL GLOSARIO (Zero-Dudas)
// =========================================
const glosarioData = {
    "racionalidad": {
        titulo: "Racionalidad Limitada",
        definicion: "Premisa que establece que los actores económicos son intencionalmente racionales, pero limitados por su capacidad cerebral y la información disponible.",
        ejemplo: "En 2010, los ingenieros de Tesla no podían prever todas las fallas futuras de las baterías. Al no poder firmar un contrato que cubra 'todo lo que pueda salir mal', es más seguro fabricar la batería internamente."
    },
    "especificidad": {
        titulo: "Especificidad de Activos",
        definicion: "Inversiones que pierden gran parte de su valor si se utilizan en una transacción o industria diferente a la original.",
        ejemplo: "El código de Inteligencia Artificial (FSD) de Tesla está hecho a la medida de sus cámaras y sensores. Si un proveedor externo lo desarrolla y la relación se rompe, ese software es inútil para un Ford."
    },
    "holdup": {
        titulo: "Problema del Asalto (Hold-Up)",
        definicion: "Ocurre cuando una parte de un contrato depende tanto de la otra (debido a inversiones muy específicas) que queda vulnerable a extorsión o renegociaciones abusivas.",
        ejemplo: "Si Panasonic fuera el único dueño de las máquinas que hacen las celdas de batería, podría amenazar a Tesla con detener la producción para exigir que le paguen el doble."
    },
    "cuasirentas": {
        titulo: "Cuasi-Rentas",
        definicion: "Es el valor adicional o ganancia que se obtiene de un activo específico en comparación con su segundo mejor uso alternativo.",
        ejemplo: "Ese margen de ganancia gigante que logra Tesla por vender autos tecnológicos. Los proveedores externos siempre intentarán 'robarse' una parte de ese margen inflando sus precios."
    },
    "pathdependency": {
        titulo: "Dependencia de Sendero",
        definicion: "Situación donde las decisiones pasadas (y la infraestructura construida) limitan severamente las opciones disponibles en el presente.",
        ejemplo: "Tesla decidió crear Gigafábricas gigantes para lograr economías de escala. Ahora, si la demanda de autos cae, están 'atrapados' pagando los altísimos costos fijos de mantener esas fábricas abiertas."
    },
    "monopsonio": {
        titulo: "Monopsonio de Facto",
        definicion: "Estructura de mercado donde hay un solo gran comprador (o un pequeño grupo que controla el mercado), dándole poder absoluto sobre los proveedores.",
        ejemplo: "China controla el refinamiento de la gran mayoría de los minerales críticos (litio, cobalto). Tesla, a pesar de ser gigante, debe someterse a las reglas chinas porque no hay otro proveedor de ese tamaño."
    }
};

// ==========================================
// 2. NAVEGACIÓN SINGLE PAGE APP (SPA)
// ==========================================
function abrirSeccion(idSeccion) {
    // Ocultar menú
    document.getElementById('pantalla-menu').classList.remove('activa');
    setTimeout(() => { document.getElementById('pantalla-menu').classList.add('oculto'); }, 500);
    
    // Mostrar Nav Global y Sección
    document.getElementById('nav-global').classList.remove('oculto');
    const seccion = document.getElementById(idSeccion);
    seccion.classList.remove('oculto');
    setTimeout(() => { seccion.classList.add('activa'); }, 50);

    // Si abrimos la de Riesgos, animar los datos
    if(idSeccion === 'sec-riesgos') animarDatos();
    
    // Si abrimos simulador, dibujar gráfico
    if(idSeccion === 'sec-simulador') updateCostos();

    window.scrollTo(0, 0);
}

function volverAlMenu() {
    // Ocultar todas las secciones y Nav
    document.getElementById('nav-global').classList.add('oculto');
    document.querySelectorAll('.pantalla').forEach(p => {
        p.classList.remove('activa');
        setTimeout(() => { p.classList.add('oculto'); }, 500);
    });

    // Mostrar Menú
    const menu = document.getElementById('pantalla-menu');
    menu.classList.remove('oculto');
    setTimeout(() => { menu.classList.add('activa'); }, 50);
    cerrarGlosario();
}

// ==========================================
// 3. GLOSARIO LATERAL INTERACTIVO
// ==========================================
const panelGlosario = document.getElementById('panel-glosario');
const titGlosario = document.getElementById('glosario-titulo');
const defGlosario = document.getElementById('glosario-definicion');
const ejGlosario = document.getElementById('glosario-ejemplo-texto');

document.querySelectorAll('.termino-glosario').forEach(item => {
    item.addEventListener('click', event => {
        const termKey = event.target.getAttribute('data-term');
        const data = glosarioData[termKey];
        
        titGlosario.textContent = data.titulo;
        defGlosario.innerHTML = data.definicion;
        ejGlosario.innerHTML = data.ejemplo;
        
        panelGlosario.classList.add('abierto');
    });
});

function cerrarGlosario() {
    panelGlosario.classList.remove('abierto');
}

// ==========================================
// 4. ANIMACIONES DE PERIODISMO DE DATOS
// ==========================================
let datosAnimados = false;
function animarDatos() {
    if(datosAnimados) return; // Solo animar una vez
    
    // Animar Barras de Progreso
    setTimeout(() => {
        document.querySelectorAll('.barra-fill').forEach(barra => {
            barra.style.width = barra.getAttribute('data-target') + '%';
        });
    }, 500);

    // Animar Contadores Numéricos
    const animarContador = (el, max, decimales = false) => {
        let val = 0;
        const speed = max / 60; // 60 frames
        const update = () => {
            val += speed;
            if(val < max) {
                el.innerText = decimales ? val.toFixed(2) : Math.floor(val).toLocaleString();
                requestAnimationFrame(update);
            } else {
                el.innerText = decimales ? max.toFixed(2) : max.toLocaleString();
            }
        };
        update();
    };

    setTimeout(() => {
        document.querySelectorAll('.kpi-valor, #counter-riesgo').forEach(el => {
            let target = parseFloat(el.getAttribute('data-num') || el.getAttribute('data-target'));
            let isDecimal = target % 1 !== 0;
            animarContador(el, target, isDecimal);
            if(el.id !== 'counter-riesgo') el.innerText = (isDecimal ? target.toFixed(2) : target.toLocaleString()) + (el.id ? "" : "");
        });
    }, 800);

    datosAnimados = true;
}


// ==========================================
// 5. SIMULADOR FINAL (SALA DEL CEO)
// ==========================================
const ctxCostos = document.getElementById('graficoCostos').getContext('2d');
const b = document.getElementById('burocracia');
const f = document.getElementById('friccion');
const exp = document.getElementById('explicacion');
let chartCostos;

window.aplicarEscenario = (buro, fric) => { b.value = buro; f.value = fric; updateCostos(); };

function updateCostos() {
    let buroActual = parseInt(b.value);
    let fricActual = parseInt(f.value);
    document.getElementById('val-burocracia').textContent = buroActual;
    document.getElementById('val-friccion').textContent = fricActual;
    
    const descBuro = document.getElementById('desc-burocracia');
    if(buroActual >= 160) { descBuro.textContent = "Costos Fijos Asfixiantes (Capacidad ociosa)."; }
    else { descBuro.textContent = "Jerarquía Operativa Eficiente."; }

    const descFric = document.getElementById('desc-friccion');
    if(fricActual >= 1600) { descFric.textContent = "Alerta: Monopsonio y Alto riesgo de Hold-up."; }
    else { descFric.textContent = "Mercado estable y proveedores confiables."; }

    let labels = [], dCC = [], dCT = [], dTot = [], min = Infinity, opt = 0;
    for(let x=0; x<=5; x+=0.5){
        let cc = 100 + buroActual * x*x, ct = Math.max(0, fricActual - 400*x), tot = cc + ct;
        labels.push(x.toFixed(1)); dCC.push(cc); dCT.push(ct); dTot.push(tot);
        if(tot < min) { min = tot; opt = x; }
    }

    const txt = document.getElementById('texto-veredicto');
    if(opt < 1.5) { 
        txt.textContent = "USAR EL MERCADO (COMPRAR)"; txt.style.color = "var(--blue)"; 
        exp.innerHTML = "Subcontratar es óptimo. La integración generaría dependencia de sendero y costos fijos inútiles.";
    } else if(opt > 3.5) { 
        txt.textContent = "JERARQUÍA INTERNA (CASO TESLA)"; txt.style.color = "var(--red)"; 
        exp.innerHTML = "Integración obligatoria para proteger las cuasi-rentas de la extorsión de proveedores.";
    } else { 
        txt.textContent = "MODELO HÍBRIDO"; txt.style.color = "var(--green)"; 
        exp.innerHTML = "Mantener control del software (FSD) pero externalizar ensamblaje secundario.";
    }

    if(chartCostos) {
        chartCostos.data.labels = labels; chartCostos.data.datasets[0].data = dCC; chartCostos.data.datasets[1].data = dCT; chartCostos.data.datasets[2].data = dTot; chartCostos.update();
    } else {
        Chart.defaults.color = '#a1a1a6';
        Chart.defaults.font.family = "'Montserrat', sans-serif";
        chartCostos = new Chart(ctxCostos, {
            type:'line',
            data: { labels, datasets: [
                { label: 'C. Coordinación (Internos)', data: dCC, borderColor: '#e82127', tension: 0.4 },
                { label: 'C. Transacción (Mercado)', data: dCT, borderColor: '#2997ff', tension: 0.4 },
                { label: 'Costo Total', data: dTot, borderColor: '#30d158', borderWidth: 4, fill: true, backgroundColor: 'rgba(48, 209, 88, 0.1)' }
            ]},
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: 'rgba(255,255,255,0.1)' } }, y: { min: 0, grid: { color: 'rgba(255,255,255,0.1)' } } } }
        });
    }
}
b.oninput = updateCostos; f.oninput = updateCostos;


// --- 6. MOTOR 3D DE FONDO ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;

const particles = [];
const geometry = new THREE.IcosahedronGeometry(0.5, 0);
for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color: 0x2997ff, metalness: 0.8, roughness: 0.2 }));
    mesh.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*20);
    scene.add(mesh);
    particles.push({ mesh, x: mesh.position.x, y: mesh.position.y, z: mesh.position.z });
}

function animate3D() {
    requestAnimationFrame(animate3D);
    scene.rotation.y += 0.001;
    particles.forEach(p => {
        p.mesh.position.y += Math.sin(Date.now()*0.001 + p.x)*0.01;
    });
    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
