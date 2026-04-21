const ctx = document.getElementById('graficoCostos');
const b = document.getElementById('burocracia');
const f = document.getElementById('friccion');

const vb = document.getElementById('val-burocracia');
const vf = document.getElementById('val-friccion');

const txt = document.getElementById('texto-veredicto');
const exp = document.getElementById('explicacion');
const caja = document.getElementById('caja-veredicto');

let chart;

function aplicarEscenario(buro, fric){
    b.value = buro;
    f.value = fric;
    update();
}

function calc(){
    let labels=[], total=[];
    let min=Infinity, opt=0;

    for(let x=0;x<=5;x+=0.5){
        let cc = 100 + b.value * x*x;
        let ct = f.value - 400*x;
        let t = cc + ct;

        labels.push(x);
        total.push(t);

        if(t<min){min=t;opt=x;}
    }
    return {labels,total,opt};
}

function update(){
    vb.textContent = b.value;
    vf.textContent = f.value;

    let d = calc();

    if(d.opt<1.5){
        txt.textContent = "COMPRAR";
        exp.textContent = "Los proveedores son eficientes.";
        caja.style.borderColor="var(--blue)";
    }
    else if(d.opt>3.5){
        txt.textContent = "FABRICAR";
        exp.textContent = "El mercado es riesgoso.";
        caja.style.borderColor="var(--red)";
    }
    else{
        txt.textContent = "MIXTO";
        exp.textContent = "Equilibrio óptimo.";
        caja.style.borderColor="var(--green)";
    }

    caja.style.transform="scale(1.05)";
    setTimeout(()=>caja.style.transform="scale(1)",200);

    if(chart){
        chart.data.labels=d.labels;
        chart.data.datasets[0].data=d.total;
        chart.update();
    } else {
        chart = new Chart(ctx,{
            type:'line',
            data:{
                labels:d.labels,
                datasets:[{
                    label:'Costo Total',
                    data:d.total
                }]
            }
        });
    }
}

b.oninput = update;
f.oninput = update;

update();
