document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.why-us__features');
    const features = document.querySelectorAll('.why-us__feature');
    const prevBtn = document.querySelector('.carousel__btn--prev');
    const nextBtn = document.querySelector('.carousel__btn--next');
    const dotsContainer = document.querySelector('.carousel__dots');
    
    let currentIndex = 0;
    const itemsPerSlide = () => 
        window.innerWidth >= 1200 ? 4 : 
        window.innerWidth >= 992 ? 3 : 
        window.innerWidth >= 768 ? 2 : 1;
    
    // Crear puntos
    features.forEach((_, i) => {
        if (i % itemsPerSlide() === 0) {
            const dot = document.createElement('button');
            dot.classList.add('carousel__dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i / itemsPerSlide()));
            dotsContainer.appendChild(dot);
        }
    });
    
    const dots = document.querySelectorAll('.carousel__dot');
    
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function goToSlide(index) {
        const maxIndex = Math.ceil(features.length / itemsPerSlide()) - 1;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }
    
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarousel();
    });
});

// Modal de ofertas
document.addEventListener('DOMContentLoaded', function() {
    if (!sessionStorage.getItem('modalShown')) {
        document.getElementById('offersModal').style.display = 'block';
        sessionStorage.setItem('modalShown', 'true');
        
        document.querySelector('.close-btn').onclick = function() {
            document.getElementById('offersModal').style.display = 'none';
        };
        
        window.onclick = function(event) {
            if (event.target == document.getElementById('offersModal')) {
                document.getElementById('offersModal').style.display = 'none';
            }
        };
    }
});

// Función para desplazamiento suave
function desplazarSuavemente(event, destino) {
    event.preventDefault();

    const elementoDestino = document.querySelector(destino);

    window.scrollTo({
        top: elementoDestino.offsetTop,
        behavior: 'smooth'
    });
}