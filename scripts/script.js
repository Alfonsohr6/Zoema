document.addEventListener('DOMContentLoaded', () => {
    // 1. CAPTURA DE ELEMENTOS PRINCIPALES DEL MODAL
    const modal = document.getElementById('modal-detalles');
    const closeBtn = document.querySelector('.close-modal-btn');
    const openButtons = document.querySelectorAll('.open-modal-btn');
    
    // Elementos del Modal que se van a reescribir textualmente
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const videoBtn = document.getElementById('modal-video-btn');

    // Contenedores dinámicos para las etiquetas mutables
    const labelArea = document.querySelector('.modal-label-area');
    const labelConst = document.querySelector('.modal-label-const');
    const labelDim = document.querySelector('.modal-label-dim');
    const labelPlus = document.querySelector('.modal-label-plus');
    const labelLegal = document.querySelector('.modal-label-legal');
    const labelSec = document.querySelector('.modal-label-sec');
    const labelLoc = document.querySelector('.modal-label-loc');
    const actionContainer = document.querySelector('.modal-action-container');

    // 2. ASIGNACIÓN DE EVENTOS A LOS BOTONES DEL CATÁLOGO
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Captura de atributos data-* de la tarjeta presionada
            const title = button.getAttribute('data-title');
            const price = button.getAttribute('data-price');
            const videoUrl = button.getAttribute('data-video');
            
            // Inyección de textos principales fijos
            modalTitle.innerText = title;
            modalPrice.innerText = price;
            
            // 3. BIFURCACIÓN ESTRATÉGICA (¿Es la Tarjeta VCP o una propiedad normal?)
            if (title === "Beneficios Zoema") {
                // Modo Corporativo (VCP): Emojis y títulos de Servicios de Negocios
                if(labelArea) labelArea.innerHTML = `<strong>💼 Servicio Central:</strong> ${button.getAttribute('data-area')}`;
                if(labelConst) labelConst.innerHTML = `<strong>🎬 Promoción Audiovisual:</strong> ${button.getAttribute('data-construction')}`;
                if(labelDim) labelDim.innerHTML = `<strong>🎯 Estrategia Digital:</strong> ${button.getAttribute('data-dimensions')}`;
                if(labelPlus) labelPlus.innerHTML = `<strong>📜 Respaldo Legal:</strong> ${button.getAttribute('data-plus')}`;
                if(labelLegal) labelLegal.innerHTML = `<strong>⚖️ Estudio Jurídico:</strong> ${button.getAttribute('data-legal')}`;
                if(labelSec) labelSec.innerHTML = `<strong>🛡️ Seguridad Corporativa:</strong> ${button.getAttribute('data-security')}`;
                if(labelLoc) {
                    labelLoc.innerHTML = `
                        <h4>🏢 Atención Física y Corporativa:</h4>
                        <p>${button.getAttribute('data-location-info')}</p>
                    `;
                }
                
                // Inyectamos el botón de WhatsApp INSISTENTE dentro del cuerpo del modal
                if (actionContainer) {
                    actionContainer.innerHTML = `
                        <a href="https://wa.me/51976299889?text=Hola%20Zoema,%20revis%C3%A3%20el%20Paquete%20de%20Captaci%C3%B3n%20en%20el%20modal%20y%20quiero%20empezar%20a%20trabajar%20con%20ustedes." 
                           target="_blank" 
                           class="card-btn modal-insistent-btn">
                           💼 ¡Iniciar Corretaje Seguro Ahora!
                        </a>
                    `;
                }
            } else {
                // Modo Inmobiliario Estándar: Mantiene los emojis y la estructura original de las casas
                if(labelArea) labelArea.innerHTML = `<strong>📐 Área de Terreno:</strong> ${button.getAttribute('data-area')}`;
                if(labelConst) labelConst.innerHTML = `<strong>🏗️ Construcción:</strong> ${button.getAttribute('data-construction')}`;
                if(labelDim) labelDim.innerHTML = `<strong>📏 Medidas:</strong> ${button.getAttribute('data-dimensions')}`;
                if(labelSec) labelSec.innerHTML = `<strong>🛡️ Seguridad:</strong> ${button.getAttribute('data-security')}`;
                if(labelPlus) labelPlus.innerHTML = `<strong>🌿 Plus Único:</strong> ${button.getAttribute('data-plus')}`;
                if(labelLegal) labelLegal.innerHTML = `<strong>⚖️ Situación Legal:</strong> ${button.getAttribute('data-legal')}`;
                if(labelLoc) {
                    labelLoc.innerHTML = `
                        <h4>📍 Conectividad y Entorno:</h4>
                        <p>${button.getAttribute('data-location-info')}</p>
                    `;
                }
                
                // Limpia el contenedor de acción para las propiedades normales
                if (actionContainer) actionContainer.innerHTML = '';
            }

            // 4. LÓGICA DINÁMICA PARA EL BOTÓN DE VIDEO
            if (videoUrl && videoUrl.trim() !== "") {
                if(videoBtn) {
                    videoBtn.href = videoUrl;
                    videoBtn.style.display = 'inline-flex';
                }
            } else {
                if(videoBtn) videoBtn.style.display = 'none';
            }

            // 5. APERTURA VISIBLE DEL MODAL Y ACCESIBILIDAD
            if(modal) {
                modal.classList.add('modal-visible');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // 6. LOGICA DE CIERRE DEL MODAL
    const closeModal = () => {
        if(modal) {
            modal.classList.remove('modal-visible');
            modal.setAttribute('aria-hidden', 'true');
        }
    };

    // Cerrar al dar clic al botón de la equis (X)
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Cerrar si el usuario da clic en la zona oscura/transparente de afuera
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // Cerrar presionando la tecla Escape del teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('modal-visible')) {
            closeModal();
        }
    });
    // Busca todos los botones automáticos de WhatsApp en el catálogo
    document.querySelectorAll('.whatsapp-auto-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que la página salte arriba o intente recargar
            
            // 1. El JS viaja hacia arriba para situarse en la tarjeta contenedora
            const card = btn.closest('.property-card');
            
            // 2. Extrae el título de la propiedad
            const tituloPropiedad = card.querySelector('.card-title').innerText.trim();
            
            // 3. Extrae la dirección limpia eliminando espacios raros o saltos de línea
            const direccionPropiedad = card.querySelector('.card-location').innerText.trim();
            
            // 4. Construye el texto del chat combinando ambos datos de forma elegante
            const textoChat = `Hola Zoema, quiero más información de la propiedad:\n\n🏠 *Título:* ${tituloPropiedad}\n📍 *Ubicación:* ${direccionPropiedad}`;
            
            // 5. Codifica el texto de forma segura y abre WhatsApp en una pestaña nueva
            window.open(`https://wa.me/51976299889?text=${encodeURIComponent(textoChat)}`, '_blank');
        });
    });
});

// ==========================================
// MOTOR DE FILTRADO ACUMULATIVO (GUESS QUEST)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const propertyCards = document.querySelectorAll(".property-card");

    // Objeto para almacenar los estados de los filtros activos
    let activeFilters = {
        operacion: null, // Guardará 'venta' o 'alquiler'
        inmueble: null   // Guardará 'casa', 'terreno' o 'local'
    };

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filterValue = button.getAttribute("data-filter");

            // 1. CASO BOTÓN "TODOS": Resetea el juego por completo
            if (filterValue === "todos") {
                activeFilters.operacion = null;
                activeFilters.inmueble = null;
                
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                
                applyFilters();
                return;
            }

            // 2. DETECTAR EL TIPO DE FILTRO SELECCIONADO
            let filterType = "";
            if (filterValue === "venta" || filterValue === "alquiler") {
                filterType = "operacion";
            } else if (filterValue === "casa" || filterValue === "terreno" || filterValue === "local") {
                filterType = "inmueble";
            }

            // 3. LÓGICA DE CANCELACIÓN (Si hace clic de nuevo en el botón activo)
            if (activeFilters[filterType] === filterValue) {
                activeFilters[filterType] = null; // Apaga el filtro
                button.classList.remove("active");
                
                // Si ya no quedan filtros activos, encendemos el botón "Todos"
                if (!activeFilters.operacion && !activeFilters.inmueble) {
                    document.querySelector('[data-filter="todos"]').classList.add("active");
                }
            } else {
                // Aplicar nuevo filtro: Apaga los botones hermanos del mismo tipo
                removeActiveFromGroup(filterType);
                activeFilters[filterType] = filterValue;
                button.classList.add("active"); //  Corregido: classList.add
                document.querySelector('[data-filter="todos"]').classList.remove("active");
            }

            // 4. EJECUTAR EL DESCARTADOR EN PANTALLA
            applyFilters();
        });
    });

    // Función auxiliar para limpiar estilos de botones del mismo grupo
    function removeActiveFromGroup(type) {
        filterButtons.forEach(btn => {
            const val = btn.getAttribute("data-filter");
            if (type === "operacion" && (val === "venta" || val === "alquiler")) btn.classList.remove("active");
            if (type === "inmueble" && (val === "casa" || val === "terreno" || val === "local")) btn.classList.remove("active");
        });
    }

    // FUNCIÓN CORE: Decide qué tarjetas se quedan y cuáles se esconden
    function applyFilters() {
        propertyCards.forEach(card => {
            // REGLA DE ORO: Si es la tarjeta de captación VCP, nunca se toca ni se esconde
            if (card.classList.contains("conversion-card")) {
                card.style.display = "flex"; // Mantiene su visibilidad intacta
                return;
            }

            // Leer los atributos de la tarjeta desde el HTML
            const cardOperacion = card.getAttribute("data-operacion");
            const cardInmueble = card.getAttribute("data-inmueble");

            // Validar si la tarjeta cumple con las condiciones acumuladas
            const matchesOperacion = !activeFilters.operacion || cardOperacion === activeFilters.operacion;
            const matchesInmueble = !activeFilters.inmueble || cardInmueble === activeFilters.inmueble;

            // Si cumple ambos criterios del juego, se muestra; si no, se oculta con suavidad
            if (matchesOperacion && matchesInmueble) {
                card.style.display = "flex";
                card.style.opacity = "1";
            } else {
                card.style.display = "none";
            }
        });
    }
});