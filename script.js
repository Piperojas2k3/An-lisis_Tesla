// --- ANIMACIONES DE SCROLL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(element => observer.observe(element));

// --- LÓGICA DE TARJETAS EXPANSIBLES ---
const tarjetas = document.querySelectorAll('.tarjeta');
const overlay = document.getElementById('overlay');

function abrirTarjeta(index) {
    // Cerramos todas primero para evitar errores
    tarjetas.forEach(t => t.classList.remove('expandida'));
    // Abrimos la seleccionada
    tarjetas[index].classList.add('expandida');
    overlay.classList.add('activo');
}

function cerrarTarjetas() {
    tarjetas.forEach(t => t.classList.remove('expandida'));
    overlay.classList.remove('activo');
}

// Evento: Clic en la tarjeta para abrirla
tarjetas.forEach((tarjeta, index) => {
    tarjeta.addEventListener('click', function() {
        if (!this.classList.contains('expandida')) {
            abrirTarjeta(index);
        }
    });
});

// Evento: Clic fuera de la tarjeta para cerrar (en el fondo oscuro)
overlay.addEventListener('click', cerrarTarjetas);

// Botones internos de las tarjetas
document.querySelectorAll('.btn-cerrar').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que la tarjeta se vuelva a abrir
        cerrarTarjetas();
    });
});

document.querySelectorAll('.btn-siguiente').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Si es la última tarjeta, vamos al simulador
        if (index === tarjetas.length - 1) {
            cerrarTarjetas();
            document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
        } else {
            // Pasamos a la siguiente tarjeta
            abrirTarjeta(index + 1);
        }
    });
});

// --- LÓGICA DEL SIMULADOR Y GRÁFICO ---
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
    let labels=[], total=[];
    let min=Infinity, opt=0;

    for(let x=0; x<=5; x+=0.5){
        let cc = 100 + b.value * (x * x);
        let ct = Math.max(0, f.value - (400 * x)); 
        let t = cc + ct;

        labels.push(x.toFixed(1));
        total.push(t);

        if(t < min){ min = t; opt = x; }
    }
    return {labels, total, opt};
}

function update(){
    vb.textContent = b.value;
    vf.textContent = f.value;

    let d = calc();

    if(d.opt < 1.5){
        txt.textContent = "COMPRAR";
        txt.style.color = "var(--blue)";
        exp.textContent = "Los proveedores son eficientes y baratos. No te desgastes fabricando tú mismo.";
        caja.style.borderLeftColor = "var(--blue)";
    }
    else if(d.opt > 3.5){
        txt.textContent = "FABRICAR (Caso Tesla)";
        txt.style.color = "var(--red)";
        exp.textContent = "El mercado es muy riesgoso y abusivo. Debes integrar procesos y controlar tu fábrica.";
        caja.style.borderLeftColor = "var(--red)";
    }
    else{
        txt.textContent = "MODELO MIXTO";
        txt.style.color = "var(--green)";
        exp.textContent = "Equilibrio perfecto. Fabrica las piezas clave y terceriza lo secundario.";
        caja.style.borderLeftColor = "var(--green)";
    }

    caja.style.transform = "scale(1.02)";
    setTimeout(() => caja.style.transform = "scale(1)", 200);

    if(chart){
        chart.data.labels = d.labels;
        chart.data.datasets[0].data = d.total;
        chart.update();
    } else {
        Chart.defaults.color = '#a1a1a6';
        Chart.defaults.font.family = "'Montserrat', sans-serif";

        chart = new Chart(ctx,{
            type:'line',
            data:{
                labels: d.labels,
                datasets:[{
                    label: 'Costo Total de la Empresa',
                    data: d.total,
                    borderColor: '#30d158',
                    backgroundColor: 'rgba(48, 209, 88, 0.1)',
                    borderWidth: 4,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#000',
                    pointBorderColor: '#30d158',
                    pointRadius: 4
                }]
            },
            options:{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Grado de Integración (0 = Comprar | 5 = Fabricar todo)'} },
                    y: { min: 0 }
                }
            }
        });
    }
}

b.addEventListener('input', update);
f.addEventListener('input', update);

update();
