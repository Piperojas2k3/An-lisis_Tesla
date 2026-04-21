// --- 1. LÓGICA DE ANIMACIÓN AL HACER SCROLL ---
// Esto hace que las tarjetas aparezcan suavemente al bajar la página
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// --- 2. LÓGICA DEL GRÁFICO INTERACTIVO ---
const ctx = document.getElementById('graficoCostos').getContext('2d');
const sliderBurocracia = document.getElementById('burocracia');
const sliderFriccion = document.getElementById('friccion');
const valBurocracia = document.getElementById('val-burocracia');
const valFriccion = document.getElementById('val-friccion');

let chart;

// Colores Dark Mode para el gráfico
const colorCC = 'rgba(232, 33, 39, 1)';   // Rojo Tesla
const colorCT = 'rgba(41, 151, 255, 1)';  // Azul tecnológico
const colorTotal = 'rgba(48, 209, 88, 1)'; // Verde neón

function calcularDatos() {
    const multBurocracia = parseInt(sliderBurocracia.value);
    const baseFriccion = parseInt(sliderFriccion.value);
    
    const etiquetas = [];
    const datosCC = []; 
    const datosCT = []; 
    const datosTotal = []; 

    for (let n = 0; n <= 5; n += 0.5) {
        etiquetas.push(n.toFixed(1));
        let cc = 100 + (multBurocracia * Math.pow(n, 2));
        let ct = Math.max(0, baseFriccion - (400 * n)); 
        let total = cc + ct;

        datosCC.push(cc);
        datosCT.push(ct);
        datosTotal.push(total);
    }
    return { etiquetas, datosCC, datosCT, datosTotal };
}

function actualizarGrafico() {
    valBurocracia.textContent = sliderBurocracia.value;
    valFriccion.textContent = sliderFriccion.value;

    const datos = calcularDatos();

    if (chart) {
        chart.data.labels = datos.etiquetas;
        chart.data.datasets[0].data = datos.datosCC;
        chart.data.datasets[1].data = datos.datosCT;
        chart.data.datasets[2].data = datos.datosTotal;
        chart.update();
    } else {
        // Configuración premium para el gráfico en modo oscuro
        Chart.defaults.color = '#a1a1a6';
        Chart.defaults.font.family = "'Montserrat', sans-serif";

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.etiquetas,
                datasets: [
                    {
                        label: 'C. Coordinación (Internos)',
                        data: datos.datosCC,
                        borderColor: colorCC,
                        backgroundColor: colorCC,
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 3
                    },
                    {
                        label: 'C. Transacción (Mercado)',
                        data: datos.datosCT,
                        borderColor: colorCT,
                        backgroundColor: colorCT,
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 3
                    },
                    {
                        label: 'Costo Total (Punto Óptimo)',
                        data: datos.datosTotal,
                        borderColor: colorTotal,
                        backgroundColor: 'rgba(48, 209, 88, 0.1)',
                        borderWidth: 4,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#000',
                        pointBorderColor: colorTotal
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: { color: '#333' },
                        title: { display: true, text: 'Grado de Integración Vertical (n)', color: '#fff' }
                    },
                    y: {
                        grid: { color: '#333' },
                        title: { display: true, text: 'Costos ($)', color: '#fff' },
                        min: 0
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#f5f5f7', padding: 20 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#ccc',
                        borderColor: '#444',
                        borderWidth: 1
                    }
                }
            }
        });
    }
}

sliderBurocracia.addEventListener('input', actualizarGrafico);
sliderFriccion.addEventListener('input', actualizarGrafico);
actualizarGrafico();
