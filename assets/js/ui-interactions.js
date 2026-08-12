// assets/js/ui-interactions.js

function inyectarDatosConfiguracion() {
    if (typeof SEDE_CONFIG === 'undefined') return;

    // Actualiza datos del footer y enlaces dinámicamente según la sede
    const elemTel = document.querySelectorAll('.telefono-sede');
    elemTel.forEach(el => {
        el.textContent = SEDE_CONFIG.telefonoContacto;
        if (el.tagName === 'A') el.href = `tel:${SEDE_CONFIG.whatsappNum}`;
    });

    const elemDir = document.querySelector('.direccion-sede');
    if (elemDir) elemDir.innerHTML = `${SEDE_CONFIG.direccionOficina}`;

    const elemHor = document.querySelector('.horario-sede');
    if (elemHor) elemHor.textContent = SEDE_CONFIG.horarioAtencion;
}

function abrirModalDetalles(propiedad) {
    const modal = document.getElementById('modal-detalles');
    if (!modal) return;

    document.getElementById('modal-title').textContent = propiedad.Titulo || "Detalles de Propiedad";
    document.getElementById('modal-price').textContent = propiedad.Precio || "Consultar";

    document.getElementById('modalArea').textContent = propiedad.Area_Total || "-";
    document.getElementById('modalConstruction').textContent = propiedad.Area_Techada || "-";
    document.getElementById('modalLocationInfo').textContent = `${propiedad.Distrito || ''} - ${propiedad.Direccion || ''}`;

    const videoBtn = document.getElementById('modal-video-btn');
    if (videoBtn) {
        if (propiedad.Link_Video && propiedad.Link_Video.trim() !== '' && propiedad.Link_Video !== '-') {
            videoBtn.href = propiedad.Link_Video;
            videoBtn.style.display = 'inline-flex';
        } else {
            videoBtn.style.display = 'none';
        }
    }

    const actionContainer = document.querySelector('.modal-action-container');
    if (actionContainer) {
        const mensajeWa = `${SEDE_CONFIG.mensajeWaDefault} ID: ${propiedad.ID || ''}`;
        actionContainer.innerHTML = `
            <a href="https://wa.me/${SEDE_CONFIG.whatsappNum}?text=${encodeURIComponent(mensajeWa)}" 
               target="_blank" class="card-btn modal-insistent-btn">
                💬 Consultar por WhatsApp
            </a>
        `;
    }

    modal.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
}

function inicializarModalVCP() {
    const botonVCP = document.querySelector('.btn-vcp-modal');
    const modal = document.getElementById('modal-detalles');
    if (!botonVCP || !modal) return;

    botonVCP.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = botonVCP.getAttribute('data-titlevcp') || "Beneficios Zoema";
        document.getElementById('modal-price').textContent = botonVCP.getAttribute('data-subtitle') || "Asesoría Integral Inmobiliaria";

        const videoBtn = document.getElementById('modal-video-btn');
        if (videoBtn) videoBtn.style.display = "none";

        const actionContainer = document.querySelector('.modal-action-container');
        if (actionContainer) {
            const mensajeWa = "Hola Zoema, revisé el Paquete de Captación y deseo información para publicar mi propiedad.";
            actionContainer.innerHTML = `
                <a href="https://wa.me/${SEDE_CONFIG.whatsappNum}?text=${encodeURIComponent(mensajeWa)}" 
                   target="_blank" class="card-btn modal-insistent-btn">
                    💼 ¡Iniciar Corretaje Seguro Ahora!
                </a>
            `;
        }

        modal.classList.add('modal-visible');
        document.body.style.overflow = 'hidden';
    });

    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('modal-visible');
            document.body.style.overflow = 'auto';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('modal-visible');
            document.body.style.overflow = 'auto';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inyectarDatosConfiguracion();
    inicializarModalVCP();
});