/**
 * Motor de Catálogo Inmobiliario - Zoema
 * Lee de forma asíncrona múltiples hojas publicadas en CSV desde Google Sheets.
 */

let listaPropiedadesGlobal = [];
let filtrosActivos = {
    operacion: null,
    inmueble: null,
    distrito: null
};

/**
 * Convierte texto plano en formato CSV a un Arreglo de Objetos JSON.
 * @param {string} textoCSV - Contenido crudo descargado del CSV.
 * @returns {Array<Object>} Arreglo de objetos parseados.
 */
function parsearCSV(textoCSV) {
    if (!textoCSV) return [];
    
    // Divide el archivo en líneas independientes de texto
    const lineas = textoCSV.split(/\r\n|\n/);
    if (lineas.length < 2) return [];

    // Extrae y limpia los nombres de las cabeceras (columnas)
    const cabeceras = lineas[0].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const resultado = [];

    for (let i = 1; i < lineas.length; i++) {
        if (!lineas[i].trim()) continue;
        
        // Expresión regular para mantener texto que contenga comas dentro de comillas
        const valores = lineas[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lineas[i].split(',');
        const objeto = {};

        cabeceras.forEach((cabecera, indice) => {
            let val = valores[indice] ? valores[indice].trim() : "";
            val = val.replace(/^"|"$/g, ''); // Elimina comillas envolventes
            
            // Convertir cadenas booleanas a tipo booleano nativo
            if (val.toUpperCase() === 'TRUE') val = true;
            if (val.toUpperCase() === 'FALSE') val = false;

            objeto[cabecera] = val;
        });

        // Solo incluir si el objeto tiene al menos un ID o Título válido
        if (objeto.ID || objeto.Titulo) {
            resultado.push(objeto);
        }
    }
    return resultado;
}

/**
 * Obtiene el precio formateado según la categoría del inmueble.
 * @param {Object} item - Objeto de propiedad.
 * @returns {string} Cadena de precio con moneda.
 */
function obtenerPrecioFormateado(item) {
    if (item.Precio_USD && item.Precio_USD !== '-' && item.Precio_USD !== '') {
        return `$ ${item.Precio_USD}`;
    }
    if (item.Alquiler_PEN && item.Alquiler_PEN !== '-' && item.Alquiler_PEN !== '') {
        return `S/ ${item.Alquiler_PEN}`;
    }
    if (item.Precio_Base_USD && item.Precio_Base_USD !== '-' && item.Precio_Base_USD !== '') {
        return `$ ${item.Precio_Base_USD} (Base)`;
    }
    return 'Consultar';
}

/**
 * Genera el marcado HTML de las tarjetas del catálogo.
 * @param {Array<Object>} propiedades - Lista de propiedades unificadas.
 */
function renderizarTarjetas(propiedades) {
    const contenedor = document.getElementById('properties-container');
    if (!contenedor) return;

    const tarjetaVCP = contenedor.querySelector('.card-vcp');
    contenedor.innerHTML = '';

    propiedades.forEach(item => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'property-card';
        
        // Atributos para filtrado dinámico en DOM
        tarjeta.setAttribute('data-operacion', (item.operacion || '').toLowerCase());
        tarjeta.setAttribute('data-inmueble', (item.inmueble || '').toLowerCase());
        tarjeta.setAttribute('data-distrito', (item.Distrito || '').toLowerCase());

        const imagenPortada = item.URL_Foto_Port || item.URL_Foto_Int || '../assets/images/proximamente.jpg';
        const precioFormateado = obtenerPrecioFormateado(item);

        const tieneVideo = item.Link_Video && item.Link_Video.trim() !== '' && item.Link_Video !== '-';
        const botonVideoHTML = tieneVideo ? 
            `<a href="${item.Link_Video}" target="_blank" rel="noopener noreferrer" class="card-btn modal-video-btn">🎬 Video</a>` : '';

        tarjeta.innerHTML = `
            <div class="card-image-box">
                <img src="${imagenPortada}" alt="${item.Titulo || 'Inmueble'}" class="card-img" loading="lazy">
                <span class="card-badge">${(item.operacion || 'Inmueble').toUpperCase()}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${item.Titulo || 'Sin título'}</h3>
                <p class="card-location">📍 ${item.Distrito || 'Sin distrito'} ${item.Direccion ? '- ' + item.Direccion : ''}</p>
                <div class="card-footer">
                    <span class="card-price">${precioFormateado}</span>
                    <div class="card-actions" style="display:flex; gap: 0.4rem;">
                        <button type="button" class="card-btn btn-ver-detalle">Detalles</button>
                        ${botonVideoHTML}
                    </div>
                </div>
            </div>
        `;

        tarjeta.querySelector('.btn-ver-detalle').addEventListener('click', () => {
            abrirModalDetalles(item);
        });

        contenedor.appendChild(tarjeta);
    });

    if (tarjetaVCP) {
        contenedor.appendChild(tarjetaVCP);
    }
}

/**
 * Renderiza el modal de detalles extrayendo todas las columnas dinámicas.
 * @param {Object} item - Objeto de propiedad seleccionado.
 */
function abrirModalDetalles(item) {
    const modal = document.getElementById('modal-detalles');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalContent = document.getElementById('modal-details-content');

    if (!modal || !modalContent) return;

    modalTitle.textContent = item.Titulo || 'Detalle del Inmueble';
    modalPrice.textContent = `Precio: ${obtenerPrecioFormateado(item)}`;

    let html = '<div class="modal-info-list" style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem;">';

    // Ubicación y mapas
    if (item.Distrito) html += `<p><strong>Distrito:</strong> ${item.Distrito}</p>`;
    if (item.Direccion) html += `<p><strong>Dirección:</strong> ${item.Direccion}</p>`;
    if (item.Google_Maps_Link && item.Google_Maps_Link !== '-') {
        html += `<p><strong>Ubicación GPS:</strong> <a href="${item.Google_Maps_Link}" target="_blank" rel="noopener">Ver en Google Maps 📍</a></p>`;
    }

    // Áreas y Métricas
    if (item.Area_Total && item.Area_Total !== '-') html += `<p><strong>Área Total:</strong> ${item.Area_Total} m²</p>`;
    if (item.Area_Techada && item.Area_Techada !== '-') html += `<p><strong>Área Techada:</strong> ${item.Area_Techada} m²</p>`;
    if (item.Zonificacion && item.Zonificacion !== '-') html += `<p><strong>Zonificación:</strong> ${item.Zonificacion}</p>`;

    // Datos Judiciales (Remates)
    if (item.Valor_Tasacion_USD && item.Valor_Tasacion_USD !== '-') html += `<p><strong>Valor Tasación:</strong> $ ${item.Valor_Tasacion_USD}</p>`;
    if (item.Expediente_Judicial && item.Expediente_Judicial !== '-') html += `<p><strong>Expediente Judicial:</strong> ${item.Expediente_Judicial}</p>`;
    if (typeof item.Ocupado === 'boolean') html += `<p><strong>Ocupado:</strong> ${item.Ocupado ? 'Sí' : 'No'}</p>`;

    // Servicios Básicos
    const servicios = [];
    if (item.Luz === true) servicios.push('Luz');
    if (item.Agua === true) servicios.push('Agua');
    if (item.Gas === true) servicios.push('Gas');
    if (servicios.length > 0) html += `<p><strong>Servicios:</strong> ${servicios.join(', ')}</p>`;

    // Estado legal y atributos
    if (typeof item.SUNARP === 'boolean') html += `<p><strong>Inscrito en SUNARP:</strong> ${item.SUNARP ? 'Sí' : 'No'}</p>`;
    if (typeof item.Libre_Gravamenes === 'boolean') html += `<p><strong>Libre de Gravámenes:</strong> ${item.Libre_Gravamenes ? 'Sí' : 'No'}</p>`;
    if (typeof item.Apto_Hipoteca === 'boolean') html += `<p><strong>Apto para Hipoteca:</strong> ${item.Apto_Hipoteca ? 'Sí' : 'No'}</p>`;
    if (typeof item.Cercado === 'boolean') html += `<p><strong>Cercado:</strong> ${item.Cercado ? 'Sí' : 'No'}</p>`;
    if (typeof item.Amoblado === 'boolean') html += `<p><strong>Amoblado:</strong> ${item.Amoblado ? 'Sí' : 'No'}</p>`;
    if (typeof item.Mascotas_Permitidas === 'boolean') html += `<p><strong>Mascotas Permitidas:</strong> ${item.Mascotas_Permitidas ? 'Sí' : 'No'}</p>`;

    // Descripciones
    const descripcion = item.Descripcion_Int || item.Descripcion_Ter;
    if (descripcion && descripcion !== '-') {
        html += `<div style="margin-top:0.5rem;"><strong>Descripción:</strong><p style="margin-top:0.2rem; color:#555;">${descripcion}</p></div>`;
    }

    // Planos y Multimedia adicionales
    if (item.URL_Planos && item.URL_Planos !== '-') {
        html += `<p style="margin-top:0.5rem;"><a href="${item.URL_Planos}" target="_blank" rel="noopener" class="card-btn">📄 Ver Planos</a></p>`;
    }

    html += '</div>';
    modalContent.innerHTML = html;

    modal.classList.add('modal-visible');
    modal.setAttribute('aria-hidden', 'false');
}

/**
 * Carga de forma asíncrona todas las URLs declaradas en SEDE_CONFIG.csvUrls.
 */
async function cargarCatalogoSede() {
    if (typeof SEDE_CONFIG === 'undefined' || !SEDE_CONFIG.csvUrls) {
        console.error("SEDE_CONFIG.csvUrls no está definido.");
        return;
    }

    listaPropiedadesGlobal = [];
    const claves = Object.keys(SEDE_CONFIG.csvUrls);

    // Iteración asíncrona sobre cada pestaña publicada
    const promesas = claves.map(async (clave) => {
        const url = SEDE_CONFIG.csvUrls[clave];
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) return [];
            
            const textoCSV = await respuesta.text();
            const registros = parsearCSV(textoCSV);

            // Determinar la operación e inmueble según la clave
            let operacion = 'venta';
            if (clave.startsWith('ALQ_')) operacion = 'alquiler';
            if (clave.startsWith('REM_')) operacion = 'remate';

            let inmueble = 'depacasa';
            if (clave.endsWith('_Terreno')) inmueble = 'terreno';

            // Etiquetar cada objeto sin alterar sus columnas originales
            return registros.map(reg => ({
                ...reg,
                operacion,
                inmueble,
                categoriaOrigen: clave
            }));
        } catch (err) {
            console.error(`Error cargando la categoría ${clave}:`, err);
            return [];
        }
    });

    const resultadosArreglos = await Promise.all(promesas);
    
    // Aplanar los resultados de todas las pestañas en un único arreglo global
    listaPropiedadesGlobal = resultadosArreglos.flat();

    generarBotonesDistritosDinamicos(listaPropiedadesGlobal);
    configurarEventosFiltros();
    renderizarTarjetas(listaPropiedadesGlobal);
}

/**
 * Genera botones de filtro para los distritos presentes en la data unificada.
 */
function generarBotonesDistritosDinamicos(listaPropiedades) {
    const contenedorFiltros = document.querySelector('.filter-container');
    if (!contenedorFiltros || listaPropiedades.length === 0) return;

    const distritosSucios = listaPropiedades.map(p => p.Distrito ? p.Distrito.trim().toLowerCase() : "");
    const distritosUnicos = [...new Set(distritosSucios)].filter(d => d !== "" && d !== "-");
    distritosUnicos.sort();

    // Limpiar botones dinámicos antiguos manteniendo el botón "Todos"
    const botonesAntiguos = contenedorFiltros.querySelectorAll('.filter-btn[data-filter-group="distrito"]');
    botonesAntiguos.forEach(b => b.remove());

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

/**
 * Configura los eventos para los botones de filtrado interactivo.
 */
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

/**
 * Muestra u oculta tarjetas según el estado de filtrosActivos.
 */
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

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogoSede();
});