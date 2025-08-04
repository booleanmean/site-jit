document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.glass-header');
    const sections = document.querySelectorAll('main > section');
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    // Section Transition System
    const sectionTransitions = document.querySelectorAll('.section-transition');
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    let currentActiveSection = null;

    // Intersection Observer for section transitions
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove highlighted class from previous section
                if (currentActiveSection) {
                    currentActiveSection.classList.remove('highlighted');
                }
                
                // Add active and highlighted classes to current section
                entry.target.classList.add('active', 'highlighted');
                currentActiveSection = entry.target;
                
                // Animate child elements with delay
                const childElements = entry.target.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
                childElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('animate');
                    }, index * 100);
                });
            } else {
                // Keep active but remove highlighted when out of view
                entry.target.classList.remove('highlighted');
                if (entry.target === currentActiveSection) {
                    currentActiveSection = null;
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
    });

    // Intersection Observer for fade elements
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initialize observers
    sectionTransitions.forEach(section => {
        sectionObserver.observe(section);
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Initialize first section as active
    if (sectionTransitions.length > 0) {
        sectionTransitions[0].classList.add('active');
    }

    // Função para verificar o tema do header com base na seção
    const checkHeaderTheme = () => {
        if (!header) return;

        let currentSection = null;
        const scrollPosition = window.scrollY + header.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section;
            }
        });

        if (currentSection) {
            const brightness = getBrightness(currentSection);
            if (brightness < 128) { // Fundo escuro
                header.classList.remove('header-on-light');
                header.classList.add('header-on-dark');
            } else { // Fundo claro
                header.classList.remove('header-on-dark');
                header.classList.add('header-on-light');
            }
        } else {
             // Fallback para a seção hero se nenhuma outra for detectada
            const heroBrightness = getBrightness(document.querySelector('.hero'));
             if (heroBrightness < 128) {
                header.classList.remove('header-on-light');
                header.classList.add('header-on-dark');
            } else {
                header.classList.remove('header-on-dark');
                header.classList.add('header-on-light');
            }
        }
    };

    const getBrightness = (element) => {
        const bgColor = window.getComputedStyle(element).backgroundColor;
        if (bgColor === 'transparent') {
            // Se for transparente, verifica o pai
            return getBrightness(element.parentElement);
        }
        const rgb = bgColor.match(/\d+/g);
        if (!rgb) return 255; // Assume claro se não conseguir ler
        // Fórmula de brilho (YIQ)
        return ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
    };

    // Hamburger Menu Logic
    if (hamburger && mobileNav && mobileOverlay) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
            mobileOverlay.classList.toggle('open');
            
            // Previne scroll do body quando menu está aberto
            if (mobileNav.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Fecha o menu se clicar no overlay
        mobileOverlay.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });

        // Fecha o menu se clicar fora
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
                mobileOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // Event Listeners
    window.addEventListener('scroll', checkHeaderTheme);
    
    // Initial check
    checkHeaderTheme();

    // Padlock Animation
    const animatedSection = document.querySelector('.animated-section');
    if (animatedSection) {
        const padlockContainer = animatedSection.querySelector('.padlock-animation');
        
        const createPadlocks = () => {
            if (!padlockContainer) return;
            padlockContainer.innerHTML = ''; // Clear existing
            for (let i = 0; i < 15; i++) {
                const padlock = document.createElement('div');
                padlock.classList.add('padlock');
                padlock.innerHTML = '&#x1F512;'; // Padlock emoji
                padlock.style.left = `${Math.random() * 100}%`;
                padlock.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5-10s duration
                padlock.style.animationDelay = `${Math.random() * 5}s`; // 0-5s delay
                padlockContainer.appendChild(padlock);
            }
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createPadlocks();
                }
            });
        }, { threshold: 0.5 });

        animationObserver.observe(animatedSection);
    }
});

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const header = document.querySelector('.header');
const contactBtn = document.querySelector('.contact-btn');
const heroCta = document.querySelector('.hero-cta');
const servicesBtn = document.querySelector('.services-btn');

// Mobile Menu Toggle
let mobileMenuOpen = false;

function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        nav.style.display = 'block';
        nav.style.position = 'fixed';
        nav.style.top = '80px';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.backgroundColor = 'var(--color-surface)';
        nav.style.padding = 'var(--space-20)';
        nav.style.borderBottom = '1px solid var(--color-border)';
        nav.style.zIndex = '999';
        
        // Animate hamburger to X
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        nav.style.display = 'none';
        
        // Reset hamburger
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Smooth Scroll Function
function smoothScrollTo(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenuOpen) {
            toggleMobileMenu();
        }
        
        return true;
    }
    return false;
}

// Event Listeners
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        smoothScrollTo(targetId);
    });
});

// Contact Button Click Handler
if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo('#contato');
    });
}

// Hero CTA Button Click Handler
if (heroCta) {
    heroCta.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo('#servicos');
    });
}

// Services Button Click Handler
if (servicesBtn) {
    servicesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo('#contato');
    });
}

// Header Scroll Effect
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header background opacity based on scroll
    if (scrollTop > 50) {
        header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--color-surface)';
        header.style.backdropFilter = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const nome = formData.get('nome').trim();
        const email = formData.get('email').trim();
        const empresa = formData.get('empresa').trim();
        const mensagem = formData.get('mensagem').trim();
        
        // Validation
        const errors = [];
        
        if (!nome || nome.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!email) {
            errors.push('E-mail é obrigatório');
        } else if (!isValidEmail(email)) {
            errors.push('E-mail inválido');
        }
        
        if (!empresa) {
            errors.push('Empresa é obrigatório');
        } else if (empresa.length < 2) {
            errors.push('Nome da empresa deve ter pelo menos 2 caracteres');
        }
        
        if (!mensagem || mensagem.length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }
        
        // Remove existing messages
        const existingMessages = contactForm.querySelectorAll('.form-message');
        existingMessages.forEach(message => message.remove());
        
        if (errors.length > 0) {
            // Display errors
            showFormMessage(errors, 'error');
        } else {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showFormMessage(['Mensagem enviada com sucesso! Entraremos em contato em breve.'], 'success');
                contactForm.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    const successMessage = contactForm.querySelector('.form-message.success');
                    if (successMessage) {
                        successMessage.remove();
                    }
                }, 5000);
            }, 1500);
        }
    });
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(messages, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    
    if (type === 'error') {
        messageDiv.style.backgroundColor = 'rgba(255, 84, 89, 0.1)';
        messageDiv.style.border = '1px solid rgba(255, 84, 89, 0.3)';
        messageDiv.style.color = 'var(--color-red-400)';
    } else {
        messageDiv.style.backgroundColor = 'rgba(50, 184, 198, 0.1)';
        messageDiv.style.border = '1px solid rgba(50, 184, 198, 0.3)';
        messageDiv.style.color = 'var(--color-teal-300)';
    }
    
    messageDiv.style.padding = 'var(--space-16)';
    messageDiv.style.borderRadius = 'var(--radius-base)';
    messageDiv.style.marginBottom = 'var(--space-16)';
    
    if (messages.length === 1) {
        messageDiv.innerHTML = (type === 'success' ? '✓ ' : '⚠ ') + messages[0];
    } else {
        messageDiv.innerHTML = '<ul style="margin: 0; padding-left: var(--space-20);"><li>' + messages.join('</li><li>') + '</li></ul>';
    }
    
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
}

// Active Navigation Highlight
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + (header ? header.offsetHeight : 80) + 50;
    
    let activeSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = section.getAttribute('id');
        }
    });
    
    // Update navigation links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const sectionId = href ? href.substring(1) : '';
        
        if (sectionId === activeSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Add CSS for messages and active navigation
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-primary) !important;
        font-weight: var(--font-weight-semibold);
    }
    
    .form-message {
        padding: var(--space-16);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-16);
        animation: slideIn 0.3s ease-out;
    }
    
    .form-message.error {
        background-color: rgba(255, 84, 89, 0.1);
        border: 1px solid rgba(255, 84, 89, 0.3);
        color: var(--color-red-400);
    }
    
    .form-message.success {
        background-color: rgba(50, 184, 198, 0.1);
        border: 1px solid rgba(50, 184, 198, 0.3);
        color: var(--color-teal-300);
    }
    
    .form-message ul {
        margin: 0;
        padding-left: var(--space-20);
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
`;
document.head.appendChild(style);

// Listen for scroll events to update active navigation
window.addEventListener('scroll', updateActiveNavigation);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenuOpen && !nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        // Reset mobile menu on desktop
        nav.style.display = '';
        nav.style.position = '';
        nav.style.top = '';
        nav.style.left = '';
        nav.style.right = '';
        nav.style.backgroundColor = '';
        nav.style.padding = '';
        nav.style.borderBottom = '';
        nav.style.zIndex = '';
        
        mobileMenuOpen = false;
        
        // Reset hamburger
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavigation();
    
    // Add click handlers to any additional elements that might need them
    const allCtaButtons = document.querySelectorAll('[data-scroll-to]');
    allCtaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = button.getAttribute('data-scroll-to');
            smoothScrollTo(target);
        });
    });
});

// Ensure page starts at top on refresh
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});