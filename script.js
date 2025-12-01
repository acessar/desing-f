/* =========================================
   STYLE MEN - SCRIPT COMPLETO
   ========================================= */

// --- 1. LOADER ---
window.addEventListener('load', function() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 800);
});

// --- 2. ANIMAÇÕES FADE-IN NO SCROLL ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fade-in-element').forEach(el => {
        observer.observe(el);
    });
});

// --- 3. EFEITO PARALLAX SUAVE ---
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const banner = document.querySelector('.hero-banner');
    if (banner) {
        const rate = scrolled * -0.3;
        banner.style.transform = `translateY(${rate}px)`;
    }
});

// --- 4. MODAL E FORMULÁRIO ---
function openModal() {
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Resetar formulário
        const form = document.getElementById('whatsappForm');
        if (form) form.reset();
        
        // Resetar mensagens e botões
        const successMsg = document.getElementById('successMessage');
        if (successMsg) successMsg.classList.remove('show');
        
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
}

// Fechar modal ao clicar fora (Overlay)
const modalOverlay = document.getElementById('formModal');
if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// --- 5. MÁSCARA E VALIDAÇÃO DE TELEFONE ---
const inputTelefone = document.getElementById('telefone');
if (inputTelefone) {
    inputTelefone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 2);
        }
        if (value.length > 2) {
            formattedValue += ') ' + value.substring(2, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 11);
        }
        
        e.target.value = formattedValue;
    });
}

function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

// --- 6. ENVIO PARA WHATSAPP ---
const formWhatsapp = document.getElementById('whatsappForm');
if (formWhatsapp) {
    formWhatsapp.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = document.querySelector('.submit-button');
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Coletar dados
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const endereco = document.getElementById('endereco').value.trim();
        const tamanho = document.getElementById('tamanho').value;
        const mensagem = document.getElementById('mensagem').value.trim();
        
        // Validações
        if (!nome || !telefone) {
            alert('Por favor, preencha seu nome e telefone.');
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            return;
        }
        
        if (!isValidPhone(telefone)) {
            alert('Por favor, digite um telefone válido.');
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            return;
        }
        
        // Montar mensagem
        let whatsappMessage = `👔 *Style Men - Interesse em Nossos Produtos*\n\n`;
        whatsappMessage += `👤 *Nome:* ${nome}\n`;
        whatsappMessage += `📱 *Telefone:* ${telefone}\n`;
        
        if (endereco) whatsappMessage += `📍 *Endereço:* ${endereco}\n`;
        if (tamanho) whatsappMessage += `👕 *Categoria:* ${tamanho}\n`;
        if (mensagem) whatsappMessage += `💬 *Detalhes:* ${mensagem}\n`;
        
        whatsappMessage += `\n_Gostaria de conhecer nossos produtos e receber ofertas! 🛍️_`;
        
        const whatsappNumber = '5583991816152'; // Seu número
        
        // Processar e redirecionar
        setTimeout(() => {
            const successMsg = document.getElementById('successMessage');
            if (successMsg) successMsg.classList.add('show');
            
            setTimeout(() => {
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                
                try {
                    const newWindow = window.open(whatsappURL, '_blank');
                    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        window.location.href = whatsappURL;
                    }
                } catch (error) {
                    window.location.href = whatsappURL;
                }
                
                setTimeout(closeModal, 500);
            }, 1000);
        }, 600);
    });
}

// --- 7. CARROSSEL (CORRIGIDO) ---
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('servicesCarousel');
    
    // Se não houver carrossel na página, encerra a função
    if (!carousel) return;

    // >>> CORREÇÃO PRINCIPAL: Forçar o início no zero <<<
    carousel.scrollLeft = 0;

    let currentIndex = 0;
    const cards = carousel.querySelectorAll('.service-card');
    const totalCards = cards.length;
    let isScrolling = false;
    let autoScrollInterval;
    
    // Variáveis para Drag (Arrastar)
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let startScrollLeft = 0;
    
    // Função para mover o scroll até um card específico
    function scrollToCard(index) {
        if (isScrolling || isDragging) return;
        
        // Proteção: verifica se o card existe
        if (!cards[index]) return;

        isScrolling = true;
        
        const card = cards[index];
        const cardWidth = card.offsetWidth;
        
        // Cálculo para centralizar ou focar o card
        const scrollPosition = card.offsetLeft - (carousel.offsetWidth - cardWidth) / 2;
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }
    
    // Função para ir ao próximo card
    function nextCard() {
        if (isDragging) return;
        currentIndex = (currentIndex + 1) % totalCards;
        scrollToCard(currentIndex);
    }
    
    // Iniciar rolagem automática
    function startAutoScroll() {
        if (isDragging) return;
        clearInterval(autoScrollInterval); // Limpa para evitar duplicidade
        autoScrollInterval = setInterval(nextCard, 4000); // 4 segundos
    }
    
    // Parar rolagem automática
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Resetar timer de inatividade (volta a rolar se o usuário parar de mexer)
    let inactivityTimer;
    function resetAutoScroll() {
        stopAutoScroll();
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (!isDragging) {
                startAutoScroll();
            }
        }, 5000);
    }
    
    // --- Eventos de Mouse (Desktop) ---
    carousel.addEventListener('mousedown', function(e) {
        isDragging = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        startScrollLeft = carousel.scrollLeft;
        resetAutoScroll();
        e.preventDefault();
    });
    
    carousel.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
        }
    });
    
    carousel.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
            resetAutoScroll();
        }
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Velocidade do arrasto
        carousel.scrollLeft = startScrollLeft - walk;
    });
    
    // --- Eventos de Touch (Celular) ---
    let touchStartX = 0;
    let touchStartScrollLeft = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        isDragging = true;
        touchStartX = e.touches[0].pageX - carousel.offsetLeft;
        touchStartScrollLeft = carousel.scrollLeft;
        resetAutoScroll();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - touchStartX) * 2;
        carousel.scrollLeft = touchStartScrollLeft - walk;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function() {
        if (isDragging) {
            isDragging = false;
            resetAutoScroll();
        }
    });
    
    // Detectar scroll manual para atualizar o índice atual
    let scrollTimeout;
    carousel.addEventListener('scroll', function() {
        // Pausa o automático se o usuário scrollar
        resetAutoScroll();
        
        // Atualiza qual é o card "ativo" (o mais centralizado)
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const carouselCenter = carousel.scrollLeft + carousel.offsetWidth / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(carouselCenter - cardCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            currentIndex = closestIndex;
        }, 100);
    });
    
    // Inicialização final do carrossel
    setTimeout(() => {
        carousel.scrollLeft = 0; // Garante mais uma vez que começa do início
        startAutoScroll();
    }, 1000);
});

// Smooth scroll para links internos (caso adicione menu no futuro)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Detecção de Touch Device
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}
