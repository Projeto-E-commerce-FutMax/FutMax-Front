(function () {
    let carouselInitialized = false;

    function initializeCarousel() {
        if (carouselInitialized) {
            return;
        }

        const carouselElement = document.getElementById('carouselExample');

        if (!carouselElement) {
            return;
        }

        if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) {
            setTimeout(initializeCarousel, 50);
            return;
        }

        const existingCarousel = bootstrap.Carousel.getInstance(carouselElement);
        if (existingCarousel) {
            existingCarousel.dispose();
        }

        try {
            const carousel = new bootstrap.Carousel(carouselElement, {
                interval: 2500,
                ride: 'carousel',
                wrap: true,
                touch: true,
                pause: 'hover',
                keyboard: true
            });

            carouselInitialized = true;

            setupCarouselControls(carousel, carouselElement);
            improveAccessibility(carouselElement);

        } catch (error) {
            console.error('Erro ao inicializar carrossel:', error);
        }
    }

    function setupCarouselControls(carousel, carouselElement) {
        const prevButton = carouselElement.querySelector('.carousel-control-prev');
        const nextButton = carouselElement.querySelector('.carousel-control-next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                carousel.pause();
                setTimeout(() => carousel.cycle(), 2500);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                carousel.pause();
                setTimeout(() => carousel.cycle(), 2500);
            });
        }

        const indicators = carouselElement.querySelectorAll('.carousel-indicators button');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                carousel.pause();
                setTimeout(() => carousel.cycle(), 2500);
            });
        });
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCarousel);
    } else {
        setTimeout(initializeCarousel, 100);
    }

    window.pauseCarousel = function () {
        const carouselElement = document.getElementById('carouselExample');
        if (carouselElement) {
            const carousel = bootstrap.Carousel.getInstance(carouselElement);
            if (carousel) {
                carousel.pause();
            }
        }
    };

    window.resumeCarousel = function () {
        const carouselElement = document.getElementById('carouselExample');
        if (carouselElement) {
            const carousel = bootstrap.Carousel.getInstance(carouselElement);
            if (carousel) {
                carousel.cycle();
            }
        }
    };
})();
