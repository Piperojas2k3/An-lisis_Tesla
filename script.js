// Obtener elementos del DOM (HTML)
const ctx = document.getElementById('graficoCostos').getContext('2d');
const sliderBurocracia = document.getElementById('burocracia');
const sliderFriccion = document.getElementById('friccion');
const valBurocracia = document.getElementById('val-burocracia');
const valFriccion = document.getElementById('val-friccion');

let chart;

// Función para calcular los datos matemáticos
function calcularDatos() {
    const multBurocracia = parseInt(sliderBurocracia.value);
    const baseFriccion = parseInt(sliderFriccion.value);
    
    const etiquetas = [];
    const datosCC = []; // Costos de Coordinación
    const datosCT = []; // Costos de Transacción
    const datosTotal = []; // Costo Total

    // n = Grado de integración (de 0 a 5)
    for (let n = 0; n <= 5; n += 0.5) {
        etiquetas.push(n.toFixed(1));
        
        // Ecuaciones del libro
        let cc = 100 + (multBurocracia * Math.pow(n, 2));
        let ct = Math.max(0, baseFriccion - (400 * n)); // Truncar a 0 si es negativo
        let total = cc + ct;

        datosCC.push(cc);
        datosCT.push(ct);
        datosTotal.push(total);
    }

    return { etiquetas, datosCC, datosCT, datosTotal };
}

// Función para dibujar y actualizar el gráfico
function actualizarGrafico() {
    // Actualizar los textos numéricos al lado de los deslizadores
    valBurocracia.textContent = sliderBurocracia.value;
    valFriccion.textContent = sliderFriccion.value;

    const datos = calcularDatos();

    if (chart) {
        // Si el gráfico ya existe, solo actualizamos sus datos
        chart.data.labels = datos.etiquetas;
        chart.data.datasets[0].data = datos.datosCC;
        chart.data.datasets[1].data = datos.datosCT;
        chart.data.datasets[2].data = datos.datosTotal;
        chart.update();
    } else {
        // Crear el gráfico por primera vez
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.etiquetas,
                datasets: [
                    {
                        label: 'Costos de Coordinación (CC)',
                        data: datos.datosCC,
                        borderColor: '#e74c3c', // Rojo
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Costos de Transacción (CT)',
                        data: datos.datosCT,
                        borderColor: '#3498db', // Azul
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Costo Total (CT + CC)',
                        data: datos.datosTotal,
                        borderColor: '#2ecc71', // Verde
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Grado de Integración Vertical (n)',
                            font: { weight: 'bold' }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Costo ($)',
                            font: { weight: 'bold' }
                        },
                        min: 0
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    }
}

// Escuchar los cambios en los deslizadores para mover el gráfico en vivo
sliderBurocracia.addEventListener('input', actualizarGrafico);
sliderFriccion.addEventListener('input', actualizarGrafico);

// Iniciar el gráfico al cargar la página
actualizarGrafico();