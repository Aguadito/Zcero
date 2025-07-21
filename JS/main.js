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

document.addEventListener('DOMContentLoaded', function() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userNameSpan = document.getElementById('user-name');
    const logoutLink = document.getElementById('logout-link');

    // Comprobar si el usuario está autenticado (simulado)
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userName = sessionStorage.getItem('userName');

    if (isLoggedIn === 'true') {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        if (userName) {
            userNameSpan.textContent = userName;
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
    
    if (userId) {
        // Mostrar menú de usuario
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-menu').style.display = 'block';
        document.getElementById('user-name').textContent = sessionStorage.getItem('user_nombre');
    }
    
    // Configurar logout
    document.getElementById('logout-link').addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
    // Manejar el cierre de sesión
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userName');
        window.location.href = 'index.html';
    });
});