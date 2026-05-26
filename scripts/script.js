document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('propertyModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const openButtons = document.querySelectorAll('.open-modal-btn');

    // Etiquetas internas del modal
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalArea = document.getElementById('modalArea');
    const modalConstruction = document.getElementById('modalConstruction');
    const modalDimensions = document.getElementById('modalDimensions');
    const modalSecurity = document.getElementById('modalSecurity');
    const modalPlus = document.getElementById('modalPlus');
    const modalLegal = document.getElementById('modalLegal');
    const modalLocationInfo = document.getElementById('modalLocationInfo');
    
    // NUEVO: Captura del botón de enlace al video
    const modalVideoLink = document.getElementById('modalVideoLink');

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Inyección de textos básicos
            modalTitle.textContent = button.getAttribute('data-title');
            modalPrice.textContent = button.getAttribute('data-price');
            modalArea.textContent = button.getAttribute('data-area');
            modalConstruction.textContent = button.getAttribute('data-construction');
            modalDimensions.textContent = button.getAttribute('data-dimensions');
            modalSecurity.textContent = button.getAttribute('data-security');
            modalPlus.textContent = button.getAttribute('data-plus');
            modalLegal.textContent = button.getAttribute('data-legal');
            modalLocationInfo.textContent = button.getAttribute('data-location-info');

            // NUEVO: Lógica dinámica para el video de redes sociales
            const videoUrl = button.getAttribute('data-video');
            if (videoUrl) {
                modalVideoLink.href = videoUrl;
                modalVideoLink.style.display = 'inline-flex';
            } else {
                modalVideoLink.style.display = 'none';
            }

            modal.classList.add('is-active');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) closeModal();
    });
});