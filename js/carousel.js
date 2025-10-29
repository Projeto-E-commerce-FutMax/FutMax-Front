document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
});

function initializeCarousel() {
    const carouselElement = document.getElementById('carouselExample');
    
    if (!carouselElement) {
        console.warn('⚠️ Elemento do carrossel não encontrado');
        return;
    }

    try {
        const carousel = new bootstrap.Carousel(carouselElement, {
            
            interval: 3000,
            ride: 'carousel',
            wrap: true,
            touch: true,
            pause: 'hover',
            keyboard: true

        });

        setupCarouselControls(carousel, carouselElement);

        improveAccessibility(carouselElement);

        addSmoothTransitions(carouselElement);

        console.log('✅ Carrossel inicializado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar carrossel:', error);
    }
}

function setupCarouselControls(carousel, carouselElement) {
    const prevButton = carouselElement.querySelector('.carousel-control-prev');
    const nextButton = carouselElement.querySelector('.carousel-control-next');
    
    if (prevButton && nextButton) {

        prevButton.addEventListener('click', () => {
            pauseAndResume(carousel, 5000);
        });

        nextButton.addEventListener('click', () => {
            pauseAndResume(carousel, 5000);
        });

        [prevButton, nextButton].forEach(button => {
            button.addEventListener('click', () => {
                button.style.transform = 'translateY(-50%) scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'translateY(-50%) scale(1)';
                }, 150);
            });
        });
    }

    const indicators = carouselElement.querySelectorAll('.carousel-indicators button');
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            pauseAndResume(carousel, 5000);
        });
    });
}

function pauseAndResume(carousel, delay) {
    carousel.pause();
    setTimeout(() => {
        carousel.cycle();
    }, delay);
}

function improveAccessibility(carouselElement) {

    const indicators = carouselElement.querySelectorAll('.carousel-indicators button');
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('aria-label', `Ir para slide ${index + 1}`);
        indicator.setAttribute('title', `Slide ${index + 1}`);
    });

    carouselElement.setAttribute('role', 'region');
    carouselElement.setAttribute('aria-label', 'Produtos em destaque');

    const prevButton = carouselElement.querySelector('.carousel-control-prev');
    const nextButton = carouselElement.querySelector('.carousel-control-next');
    
    if (prevButton) {
        prevButton.setAttribute('title', 'Produto anterior');
        prevButton.setAttribute('aria-label', 'Ver produto anterior');
    }
    
    if (nextButton) {
        nextButton.setAttribute('title', 'Próximo produto');
        nextButton.setAttribute('aria-label', 'Ver próximo produto');
    }
}

function addSmoothTransitions(carouselElement) {

    carouselElement.addEventListener('slide.bs.carousel', (event) => {
        const activeItem = carouselElement.querySelector('.carousel-item.active');
        if (activeItem) {
            activeItem.style.transition = 'transform 0.6s ease-in-out';
        }
    });

    carouselElement.addEventListener('slid.bs.carousel', (event) => {

        const newActiveItem = carouselElement.querySelector('.carousel-item.active');
        if (newActiveItem) {
            newActiveItem.classList.add('animate-in');
            setTimeout(() => {
                newActiveItem.classList.remove('animate-in');
            }, 600);
        }
    });
}

function pauseCarousel() {
    const carouselElement = document.getElementById('carouselExample');
    if (carouselElement) {
        const carousel = bootstrap.Carousel.getInstance(carouselElement);
        if (carousel) {
            carousel.pause();
        }
    }
}

function resumeCarousel() {
    const carouselElement = document.getElementById('carouselExample');
    if (carouselElement) {
        const carousel = bootstrap.Carousel.getInstance(carouselElement);
        if (carousel) {
            carousel.cycle();
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pauseCarousel,
        resumeCarousel
    };
}