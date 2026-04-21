// Animaciones de scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(element => observer.observe(element));

// Configuración del gráfico
const ctx = document.getElementById('graficoCostos').getContext('2d');
const sliderBurocracia = document.getElementById('burocracia');
const sliderFriccion = document.getElementById('friccion');
const valBurocracia = document.getElementById('val-burocracia');
const valFriccion = document.getElementById('val-friccion');
const textoVeredicto = document.getElementById('texto-veredicto');
const cajaVeredicto = document.getElementById('caja-veredicto');

let chart;

// Botones de escenarios automáticos
window.aplicarEscenario = function(burocracia, friccion) {
    sliderBurocracia.value = burocracia;
    sliderFriccion.value = friccion;
    actualizarGrafico();
}

function calcularDatos() {
    const multBurocracia = parseInt(sliderBurocracia.value);
    const baseFriccion = parseInt(sliderFriccion.value);
    const etiquetas = [], datosCC = [], datosCT = [], datosTotal = []; 
    let costoMinimo = Infinity;
    let nOptimo = 0;

    for (let n = 0; n <= 5; n += 0.5) {
        etiquetas.push(n.toFixed(1));
        let cc = 100 + (multBurocracia * Math.pow(n, 2));
        let ct = Math.max(0, baseFriccion - (400 * n)); 
        let total = cc + ct;

        datosCC.push(cc); datosCT.push(ct); datosTotal.push(total);

        // Encontrar el punto más bajo automáticamente
        if (total < costoMinimo) {
            costoMinimo = total;
            nOptimo = n;
        }
    }
    return { etiquetas, datosCC, datosCT, datosTotal, nOptimo };
}

function actualizarGrafico() {
    valBurocracia.textContent = sliderBurocracia.value;
    valFriccion.textContent = sliderFriccion.value;

    const datos = calcularDatos();

    // Actualizar el Veredicto para la persona que lee
    if (datos.nOptimo <= 1.5) {
        textoVeredicto.textContent = "Te conviene COMPRAR: Usa proveedores externos, tu nivel de integración debe ser bajo.";
        textoVeredicto.style.color = "var(--accent-blue)";
        cajaVeredicto.style.borderLeftColor = "var(--accent-blue)";
    } else if (datos.nOptimo >= 3.5) {
        textoVeredicto.textContent = "Te conviene FABRICAR (Caso Tesla): Integra procesos, el mercado es muy riesgoso.";
        textoVeredicto.style.color = "var(--accent-red)";
        cajaVeredicto.style.borderLeftColor = "var(--accent-red)";
    } else {
        textoVeredicto.textContent = "Punto Intermedio: Fabrica lo clave, terceriza lo secundario.";
        textoVeredicto.style.color = "var(--accent-green)";
        cajaVeredicto.style.borderLeftColor = "var(--accent-green)";
    }

    if (chart) {
        chart.data.labels = datos.etiquetas;
        chart.data.datasets[0].data = datos.datosCC;
        chart.data.datasets[1].data = datos.datosCT;
        chart.data.datasets[2].data = datos.datosTotal;
        chart.update();
    } else {
        Chart.defaults.color = '#a1a1a6';
        Chart.defaults.font.family = "'Montserrat', sans-serif";

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.etiquetas,
                datasets: [
                    { label: 'C. Coordinación (Burocracia)', data: datos.datosCC, borderColor: '#e82127', tension: 0.4 },
                    { label: 'C. Transacción (Proveedores)', data: datos.datosCT, borderColor: '#2997ff', tension: 0.4 },
                    { label: 'Costo Total', data: datos.datosTotal, borderColor: '#30d158', backgroundColor: 'rgba(48, 209, 88, 0.1)', borderWidth: 4, tension: 0.4, fill: true }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Grado de Integración (0 = Comprar todo | 5 = Fabricar todo)', color: '#fff' } },
                    y: { min: 0 }
                }
            }
        });
    }
}

sliderBurocracia.addEventListener('input', actualizarGrafico);
sliderFriccion.addEventListener('input', actualizarGrafico);
actualizarGrafico();
