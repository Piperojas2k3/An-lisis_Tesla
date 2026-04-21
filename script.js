/* Variables de color estilo Tesla (Dark Mode) */
:root {
    --bg-color: #0a0a0a;
    --card-bg: #171717;
    --text-main: #f5f5f7;
    --text-muted: #a1a1a6;
    --accent-red: #e82127;
    --accent-blue: #2997ff;
    --accent-green: #30d158;
}

body {
    font-family: 'Montserrat', sans-serif;
    line-height: 1.6;
    color: var(--text-main);
    background-color: var(--bg-color);
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

/* Cabecera / Hero */
.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: radial-gradient(circle at center, #1f1f1f 0%, #0a0a0a 100%);
    border-bottom: 1px solid #333;
}

.hero-content h1 {
    font-size: 5rem;
    letter-spacing: 10px;
    margin: 0;
    font-weight: 700;
    text-transform: uppercase;
}

.subtitle {
    font-size: 1.5rem;
    color: var(--text-muted);
    font-weight: 300;
    margin-bottom: 5px;
}

.tagline {
    font-size: 1rem;
    color: var(--accent-red);
    font-weight: 600;
    margin-bottom: 40px;
}

.btn-scroll {
    display: inline-block;
    padding: 12px 24px;
    border: 2px solid var(--text-main);
    color: var(--text-main);
    text-decoration: none;
    border-radius: 30px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-scroll:hover {
    background: var(--text-main);
    color: var(--bg-color);
}

/* Layout Principal */
main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 20px;
}

.grid-teoria {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 60px;
}

@media (min-width: 768px) {
    .grid-teoria {
        grid-template-columns: 1fr 1fr;
    }
}

.tarjeta {
    background: var(--card-bg);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid #2a2a2a;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    transition: transform 0.3s ease;
}

.tarjeta:hover {
    transform: translateY(-5px);
    border-color: #444;
}

h2 {
    font-size: 1.3rem;
    color: white;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
    margin-top: 0;
}

p, li {
    color: var(--text-muted);
    font-size: 0.95rem;
}

strong { color: white; }

/* Sección Interactiva */
.interactivo {
    background: var(--card-bg);
    padding: 40px;
    border-radius: 16px;
    border: 1px solid #333;
    text-align: center;
}

.controles-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin: 30px 0;
    justify-content: center;
}

.control-grupo {
    flex: 1;
    min-width: 250px;
    text-align: left;
}

.badge {
    background: #333;
    padding: 4px 10px;
    border-radius: 20px;
    color: white;
    font-size: 0.9rem;
    float: right;
}

/* Deslizadores personalizados */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    margin-top: 15px;
}

input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: var(--text-main);
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 0 10px rgba(255,255,255,0.5);
}

input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: #444;
    border-radius: 2px;
}

.grafico-contenedor {
    position: relative;
    height: 450px;
    width: 100%;
    margin-top: 20px;
}

/* Clases de Animación (Scroll Reveal) */
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
