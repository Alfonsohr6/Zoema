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