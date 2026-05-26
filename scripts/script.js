// ESPERA A QUE EL HTML ESTÉ COMPLETAMENTE PROCESADO POR EL NAVEGADOR
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CAPTURA DE LOS COMPONENTES DE LA VENTANA INTERACTIVA
    const modal = document.getElementById('propertyModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const openButtons = document.querySelectorAll('.open-modal-btn');

    // 2. CAPTURA DE LAS ETIQUETAS INTERNAS DONDE IRÁ LA DATA
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalArea = document.getElementById('modalArea');
    const modalConstruction = document.getElementById('modalConstruction');
    const modalDimensions = document.getElementById('modalDimensions');
    const modalSecurity = document.getElementById('modalSecurity');
    const modalPlus = document.getElementById('modalPlus');
    const modalLegal = document.getElementById('modalLegal');
    const modalLocationInfo = document.getElementById('modalLocationInfo');
    const modalVideoLink = document.getElementById('propertyModalVideoLink' || 'modalVideoLink');
    // 3. ASIGNAR EL EVENTO DE CLIC A CADA BOTÓN DE DETALLES DE LA PÁGINA
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // Extrae la data del botón e inyecta el contenido en el modal al instante
            modalTitle.textContent = button.getAttribute('data-title');
            modalPrice.textContent = button.getAttribute('data-price');
            modalArea.textContent = button.getAttribute('data-area');
            modalConstruction.textContent = button.getAttribute('data-construction');
            modalDimensions.textContent = button.getAttribute('data-dimensions');
            modalSecurity.textContent = button.getAttribute('data-security');
            modalPlus.textContent = button.getAttribute('data-plus');
            modalLegal.textContent = button.getAttribute('data-legal');
            modalLocationInfo.textContent = button.getAttribute('data-location-info');
            const videoUrl = button.getAttribute('data-video');
            if (videoUrl) {
                modalVideoLink.href = videoUrl;
                modalVideoLink.style.display = 'inline-flex'; // Muestra el botón si hay link
            } else {
                modalVideoLink.style.display = 'none';        // Lo oculta por completo si está vacío
            }
            // Hace visible el cuadro emergente aplicando los estilos CSS que creamos
            modal.classList.add('is-active');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    // 4. FUNCIÓN PARA LOGRAR EL CIERRE DEL CUADRO
    const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
    };

    // Cerrar al hacer clic en el botón con la "X"
    closeBtn.addEventListener('click', closeModal);
    
    // Cerrar si el usuario hace clic en el fondo oscuro exterior de la tarjeta blanca
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar de forma pro-usuario si presionan la tecla "Escape" del teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });
});