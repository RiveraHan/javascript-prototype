function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function() {
    
    let cantidad;
    const base = 2000;
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    const diferencia = new Date().getFullYear() - this.year;

    // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /**
     * si el seguro es básico se multiplica por un 30% más
     * si el seguro es completo se multiplica por un 50% más
     */

    this.tipo === 'basico' ? cantidad *= 1.30 : cantidad *= 1.50;

    return cantidad;
    
}

function UI() {}

UI.prototype.llenarOpciones = () => {
    let max = new Date().getFullYear(),
        min = max - 20;

    const selectYear = document.querySelector('#year');

    for(i = max; i > min; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.remove('correcto')
        div.classList.add('error');
    } else {
        div.classList.remove('error');
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (seguro, total) => {

    const {marca, year, tipo} = seguro;
    let nombreMarca;

    switch (marca) {
        case '1':
            nombreMarca = 'Americano'
            break;
        case '2':
            nombreMarca = 'Asiatico'
            break;
        case '3':
            nombreMarca = 'Europeo'
            break;
        default:
            break;
    }

    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${nombreMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;
    const divResultado = document.querySelector('#resultado');
    
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    
    setTimeout(() => {
        spinner.style.display = 'none';
        divResultado.appendChild(div);
    }, 3000);
}

const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
});

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;

    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
        
    } 
    ui.mostrarMensaje('Cotizando...', 'exito');

    // ocultar cotización previa
    const resultados = document.querySelector('#resultado div');
    if(resultados !== null) resultados.remove();

    const seguro = new Seguro(marca, year, tipo);

    const total = seguro.cotizarSeguro();

    ui.mostrarResultado(seguro, total);
}