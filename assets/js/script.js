// =========================================================================
// MOTOR 1: CONTROLADOR EXCLUSIVO PARA LA TARJETA PUBLICITARIA VCP (JOKER)
// =========================================================================
function inicializarModalVCP() {
    // Busca únicamente el botón autónomo de tu anuncio fijo
    const botonVCP = document.querySelector('.btn-vcp-modal');
    const modal = document.getElementById('modal-detalles');

    // Contenedores físicos de la ventana modal
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const videoBtn = document.getElementById('modal-video-btn'); // Localizamos al intruso del video

    // Etiquetas de la grilla interna del modal
    const labelArea = document.querySelector('.modal-label-area');
    const labelConst = document.querySelector('.modal-label-const');
    const labelDim = document.querySelector('.modal-label-dim');
    const labelSec = document.querySelector('.modal-label-sec');
    const labelPlus = document.querySelector('.modal-label-plus');
    const labelLegal = document.querySelector('.modal-label-legal');
    const labelLoc = document.querySelector('.modal-label-loc');
    const actionContainer = document.querySelector('.modal-action-container');

    // Si el botón VCP no está en la página, detenemos el script de forma segura
    if (!botonVCP) return;

    botonVCP.addEventListener('click', () => {
        // 1. Inyectar datos de cabecera (Título y Subtítulo corporativo)
        if (modalTitle) modalTitle.textContent = botonVCP.getAttribute('data-titlevcp') || "Beneficios Zoema";
        if (modalPrice) modalPrice.textContent = botonVCP.getAttribute('data-subtitle') || "Asesoría Integral Inmobiliaria";

        // 2. ¡Tu idea unificada! Metemos la etiqueta + emoji + texto juntos
        if (labelArea) labelArea.innerHTML = botonVCP.getAttribute('data-serv1') || "";
        if (labelConst) labelConst.innerHTML = botonVCP.getAttribute('data-serv2') || "";
        if (labelDim) labelDim.innerHTML = botonVCP.getAttribute('data-serv3') || "";
        if (labelPlus) labelPlus.innerHTML = botonVCP.getAttribute('data-serv4') || "";
        if (labelLegal) labelLegal.innerHTML = botonVCP.getAttribute('data-serv5') || "";
        if (labelSec) labelSec.innerHTML = botonVCP.getAttribute('data-serv6') || "";
        
        // Bloque inferior de atención física corporativa
        if (labelLoc) labelLoc.innerHTML = botonVCP.getAttribute('data-serv7') || "";

        // 3. 🎯 ELIMINACIÓN DEL INTRUSO: Escondemos por completo el botón de video para la VCP
        if (videoBtn) {
            videoBtn.style.display = "none";
        }

        // 4. Inyectar el botón directo de WhatsApp Comercial de Captación
        if (actionContainer) {
            const mensajeWa = "Hola Zoema, revisé el Paquete de Captación en el modal y quiero empezar a trabajar con ustedes.";
            actionContainer.innerHTML = `
                <a href="https://wa.me/51976299889?text=${encodeURIComponent(mensajeWa)}" 
                   target="_blank" 
                   class="card-btn modal-insistent-btn">
                    💼 ¡Iniciar Corretaje Seguro Ahora!
                </a>
            `;
        }

        // 5. Encendemos los candados visuales del CSS para mostrar el modal
        if (modal) {
            modal.classList.add('modal-visible'); 
            document.body.style.overflow = 'hidden'; // Pausa el scroll de fondo
        }
    });

    // =========================================================================
    // MECANISMOS DE CIERRE SEGURO (Sincronizados con el ID real de tu HTML)
    // =========================================================================
    const closeBtn = document.getElementById('closeModalBtn'); // 🎯 ¡ID CORREGIDO AQUÍ!
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('modal-visible'); // Apaga el modal visualmente
            document.body.style.overflow = 'auto';     // Regresa el scroll a la normalidad
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('modal-visible'); // Cierra al hacer clic en el fondo oscuro
                document.body.style.overflow = 'auto';     // Regresa el scroll
            }
        });
    }
}

// Iniciar el motor de la tarjeta VCP al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarModalVCP();
}); 

// =========================================================================
// MOTOR 2: PROCESADOR DE DATOS DE GOOGLE SHEETS Y FILTROS INTERACTIVOS
// =========================================================================

// Estado global de los filtros seleccionados por el usuario
let filtrosActivos = {
    operacion: null, // Guardará "venta" o "alquiler"
    inmueble: null,  // Guardará "casa", "terreno", "departamento", "local"
    distrito: null   // Guardará el distrito leído del Excel (ej: "jlbr", "yanahuara")
};

/**
 * Función que configura los eventos clic de todos los botones con lógica Toggle por Grupo
 */
function configurarEventosFiltros() {
    const btnTodos = document.querySelector('.filter-btn[data-filter="todos"]');
    const contenedorFiltros = document.querySelector('.filter-container');
    
    if (!contenedorFiltros || !btnTodos) return;

    // Escuchamos los clics en el contenedor de forma inteligente (Delegación de eventos)
    contenedorFiltros.addEventListener('click', (e) => {
        const boton = e.target.closest('.filter-btn');
        if (!boton) return; // Si no hizo clic en un botón, ignoramos

        const filtroVal = boton.getAttribute('data-filter');
        const grupo = boton.getAttribute('data-filter-group');

        // ==========================================
        // CASO A: CLIC EN EL BOTÓN "TODOS"
        // ==========================================
        if (filtroVal === 'todos') {
            // Apagamos los filtros en memoria
            filtrosActivos.operacion = null;
            filtrosActivos.inmueble = null;
            filtrosActivos.distrito = null;

            // Apagamos visualmente todos los botones y encendemos solo "Todos"
            const todosLosBotones = contenedorFiltros.querySelectorAll('.filter-btn');
            todosLosBotones.forEach(b => b.classList.remove('active'));
            btnTodos.classList.add('active');

            ejecutarFiltradoVisual();
            return;
        }

        // ==========================================
        // CASO B: LÓGICA TOGGLE POR GRUPOS
        // ==========================================
        if (boton.classList.contains('active')) {
            // Si el botón ya estaba activo y lo presionan de nuevo, lo APAGAMOS
            boton.classList.remove('active');
            filtrosActivos[grupo] = null;
        } else {
            // Si no estaba activo, primero apagamos a todos sus "hermanos" del mismo grupo
            const hermanosDelGrupo = contenedorFiltros.querySelectorAll(`.filter-btn[data-filter-group="${grupo}"]`);
            hermanosDelGrupo.forEach(h => h.classList.remove('active'));

            // Encendemos el botón presionado
            boton.classList.add('active');
            filtrosActivos[grupo] = filtroVal;
        }

        // Control de luces automático para el botón "Todos"
        const hayFiltrosEncendidos = filtrosActivos.operacion || filtrosActivos.inmueble || filtrosActivos.distrito;
        if (hayFiltrosEncendidos) {
            btnTodos.classList.remove('active');
        } else {
            btnTodos.classList.add('active');
        }

        // Aplicamos el filtro cruzado en la pantalla
        ejecutarFiltradoVisual();
    });
}

/**
 * Recorre todas las tarjetas de la pantalla y evalúa si pasan el filtro de las 3 categorías
 */
function ejecutarFiltradoVisual() {
    const tarjetas = document.querySelectorAll('.property-grid .property-card');

    tarjetas.forEach(tarjeta => {
        // 🛡️ EXCEPCIÓN CARD VCP (JOKER): Tu anuncio corporativo siempre debe estar visible
        if (tarjeta.classList.contains('card-vcp')) {
            tarjeta.style.display = 'flex';
            return;
        }

        // Leemos las propiedades data- que tendrá cada tarjeta real
        const tarjetaOperacion = tarjeta.getAttribute('data-operacion');
        const tarjetaInmueble = tarjeta.getAttribute('data-inmueble');
        const tarjetaDistrito = tarjeta.getAttribute('data-distrito');

        // Condicionales lógicas cruzadas (Si el filtro está en null, el requisito se da por aprobado automático)
        const pasaOperacion = !filtrosActivos.operacion || tarjetaOperacion === filtrosActivos.operacion;
        const pasaInmueble = !filtrosActivos.inmueble || tarjetaInmueble === filtrosActivos.inmueble;
        const pasaDistrito = !filtrosActivos.distrito || tarjetaDistrito === filtrosActivos.distrito;

        // La tarjeta se muestra SOLO si aprueba los 3 filtros al mismo tiempo
        if (pasaOperacion && pasaInmueble && pasaDistrito) {
            tarjeta.style.display = 'flex';
        } else {
            tarjeta.style.display = 'none'; // Se oculta elegantemente
        }
    });
}

/**
 * Lee las propiedades que vinieron del Excel y fabrica botones de distritos automáticamente
 */
function generarBotonesDistritosDinamicos(listaPropiedades) {
    const contenedorFiltros = document.querySelector('.filter-container');
    if (!contenedorFiltros || listaPropiedades.length === 0) return;

    // Extraemos la columna 'Distrito' del excel, limpiamos espacios y pasamos a minúsculas
    const distritosSucios = listaPropiedades.map(p => p.Distrito ? p.Distrito.trim().toLowerCase() : "");
    
    // Filtramos para eliminar textos vacíos y filas duplicadas usando un Set
    const distritosUnicos = [...new Set(distritosSucios)].filter(d => d !== "");

    // Los ordenamos alfabéticamente de la A a la Z
    distritosUnicos.sort();

    // Fabricamos un botón HTML por cada distrito encontrado en tu Excel
    distritosUnicos.forEach(distrito => {
        const nuevoBoton = document.createElement('button');
        nuevoBoton.type = "button";
        nuevoBoton.className = "filter-btn";
        nuevoBoton.setAttribute('data-filter-group', 'distrito');
        nuevoBoton.setAttribute('data-filter', distrito);
        
        // Estética: Ponemos la primera letra en Mayúscula (ej: jlbr -> Jlbr / yanahuara -> Yanahuara)
        nuevoBoton.textContent = distrito.charAt(0).toUpperCase() + distrito.slice(1);
        
        // Lo agregamos al contenedor de filtros
        contenedorFiltros.appendChild(nuevoBoton);
    });
}