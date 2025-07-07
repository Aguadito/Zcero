// Funcionalidad del menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.header__menu-btn');
    const mobileNav = document.querySelector('.nav--mobile');
    const overlay = document.querySelector('.menu-overlay');
    const closeBtn = document.querySelector('.nav__close-btn');
    
    // Abrir menú móvil
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Bloquear scroll
        });
    }
    
    // Cerrar menú móvil
    function closeMenu() {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    // Cerrar menú al hacer clic en un enlace
    const mobileLinks = document.querySelectorAll('.nav__link--mobile');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Esperar un poco antes de cerrar para dar tiempo a la transición
            setTimeout(closeMenu, 300);
        });
    });
});