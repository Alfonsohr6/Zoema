// assets/js/catalog-engine.js

let listaPropiedadesGlobal = [];
let filtrosActivos = {
    operacion: null,
    inmueble: null,
    distrito: null
};

// Convierte texto plano CSV a un Arreglo de Objetos JSON respetando las cabeceras del SRS
function parsearCSV(textoCSV) {
    const lineas = textoCSV.split(/\r\n|\n/);
    if (lineas.length < 2) return [];

    const cabeceras = lineas[0].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const resultado = [];

    for (let i = 1; i < lineas.length; i++) {
        if (!lineas[i].trim()) continue;
        
        // Regex para respetar comas dentro de textos entre comillas
        const valores = lineas[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lineas[i].split(',');
        const objeto = {};

        cabeceras.forEach((cabecera, indice) => {
            let val = valores[indice] ? valores[indice].trim() : "";
            val = val.replace(/^"|"$/g, ''); // Limpiar comillas
            objeto[cabecera] = val;
        });

        resultado.push(objeto);
    }
    return resultado;
}

// Renderiza las tarjetas dinámicas recibidas desde la Hoja de Cálculo
function renderizarTarjetas(propiedades) {
    const contenedor = document.getElementById('properties-container');
    if (!contenedor) return;

    // Mantenemos la tarjeta fija VCP (Joker)
    const tarjetaVCP = contenedor.querySelector('.card-vcp');
    contenedor.innerHTML = '';

    propiedades.forEach(item => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'property-card';
        tarjeta.setAttribute('data-operacion', (item.Operacion || '').toLowerCase());
        tarjeta.setAttribute('data-inmueble', (item.Inmueble || '').toLowerCase());
        tarjeta.setAttribute('data-distrito', (item.Distrito || '').toLowerCase());

        const tieneVideo = item.Link_Video && item.Link_Video.trim() !== '' && item.Link_Video !== '-';
        const botonVideoHTML = tieneVideo ? 
            `<a href="${item.Link_Video}" target="_blank" rel="noopener noreferrer" class="card-btn modal-video-btn">🎬 Ver Video</a>` : '';

        tarjeta.innerHTML = `
            <div class="card-image-box">
                <img src="${item.URL_Foto_Port || '../assets/images/proximamente.jpg'}" alt="${item.Titulo}" class="card-img">
            </div>
            <div class="card-content">
                <span class="card-badge">${item.Operacion || 'Inmueble'}</span>
                <h3 class="card-title">${item.Titulo || 'Sin título'}</h3>
                <p class="card-location">📍 ${item.Distrito || ''} - ${item.Direccion || ''}</p>
                <div class="card-footer-info">
                    <span class="card-price">${item.Precio || 'Consultar'}</span>
                    <div class="card-actions">
                        <button type="button" class="card-btn btn-secondary btn-ver-detalle" data-id="${item.ID}">Detalles</button>
                        ${botonVideoHTML}
                    </div>
                </div>
            </div>
        `;

        // Evento para abrir el Modal con los datos completos del inmueble
        tarjeta.querySelector('.btn-ver-detalle').addEventListener('click', () => {
            abrirModalDetalles(item);
        });

        contenedor.appendChild(tarjeta);
    });

    // Reinsertamos la tarjeta fija VCP al final
    if (tarjetaVCP) {
        contenedor.appendChild(tarjetaVCP);
    }
}

// Genera automáticamente botones para los distritos que existen en la hoja de datos
function generarBotonesDistritosDinamicos(listaPropiedades) {
    const contenedorFiltros = document.querySelector('.filter-container');
    if (!contenedorFiltros || listaPropiedades.length === 0) return;

    const distritosSucios = listaPropiedades.map(p => p.Distrito ? p.Distrito.trim().toLowerCase() : "");
    const distritosUnicos = [...new Set(distritosSucios)].filter(d => d !== "");
    distritosUnicos.sort();

    distritosUnicos.forEach(distrito => {
        const nuevoBoton = document.createElement('button');
        nuevoBoton.type = "button";
        nuevoBoton.className = "filter-btn";
        nuevoBoton.setAttribute('data-filter-group', 'distrito');
        nuevoBoton.setAttribute('data-filter', distrito);
        nuevoBoton.textContent = distrito.charAt(0).toUpperCase() + distrito.slice(1);
        contenedorFiltros.appendChild(nuevoBoton);
    });
}

// Configuración de los eventos de clic en los botones de filtrado
function configurarEventosFiltros() {
    const contenedorFiltros = document.querySelector('.filter-container');
    const btnTodos = document.querySelector('.filter-btn[data-filter="todos"]');
    if (!contenedorFiltros) return;

    contenedorFiltros.addEventListener('click', (e) => {
        const boton = e.target.closest('.filter-btn');
        if (!boton) return;

        const filtroVal = boton.getAttribute('data-filter');
        const grupo = boton.getAttribute('data-filter-group');

        if (filtroVal === 'todos') {
            filtrosActivos = { operacion: null, inmueble: null, distrito: null };
            contenedorFiltros.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btnTodos.classList.add('active');
        } else {
            if (boton.classList.contains('active')) {
                boton.classList.remove('active');
                filtrosActivos[grupo] = null;
            } else {
                contenedorFiltros.querySelectorAll(`.filter-btn[data-filter-group="${grupo}"]`).forEach(h => h.classList.remove('active'));
                boton.classList.add('active');
                filtrosActivos[grupo] = filtroVal;
            }

            const hayFiltros = filtrosActivos.operacion || filtrosActivos.inmueble || filtrosActivos.distrito;
            if (hayFiltros) btnTodos.classList.remove('active');
            else btnTodos.classList.add('active');
        }

        ejecutarFiltradoVisual();
    });
}

// Filtra las tarjetas visibles según las opciones seleccionadas
function ejecutarFiltradoVisual() {
    const tarjetas = document.querySelectorAll('#properties-container .property-card');

    tarjetas.forEach(tarjeta => {
        if (tarjeta.classList.contains('card-vcp')) {
            tarjeta.style.display = 'flex';
            return;
        }

        const op = tarjeta.getAttribute('data-operacion');
        const inm = tarjeta.getAttribute('data-inmueble');
        const dis = tarjeta.getAttribute('data-distrito');

        const pasaOp = !filtrosActivos.operacion || op === filtrosActivos.operacion;
        const pasaInm = !filtrosActivos.inmueble || inm === filtrosActivos.inmueble;
        const pasaDis = !filtrosActivos.distrito || dis === filtrosActivos.distrito;

        if (pasaOp && pasaInm && pasaDis) {
            tarjeta.style.display = 'flex';
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

// Carga asíncrona principal
async function cargarCatalogoSede() {
    if (typeof SEDE_CONFIG === 'undefined' || !SEDE_CONFIG.csvUrl) {
        console.error("SEDE_CONFIG no está definido.");
        return;
    }

    try {
        const respuesta = await fetch(SEDE_CONFIG.csvUrl);
        const textoCSV = await respuesta.text();
        listaPropiedadesGlobal = parsearCSV(textoCSV);
        
        generarBotonesDistritosDinamicos(listaPropiedadesGlobal);
        configurarEventosFiltros();
        renderizarTarjetas(listaPropiedadesGlobal);
    } catch (error) {
        console.error("Error cargando datos del catálogo:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogoSede();
});