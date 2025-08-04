document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.header');

    // Criar overlay para fechar menu ao clicar fora
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(4px);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(overlay);

    // Efeito de rolagem do header com Liquid Glass e contraste automático
    let lastScrollY = window.scrollY;
    
    // Função para detectar se o fundo é claro ou escuro
    function detectBackgroundBrightness() {
        const rect = header.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Criar um canvas temporário para capturar a cor do pixel
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 1;
        
        // Capturar a cor de fundo atrás do header
        try {
            // Usar getComputedStyle para obter a cor de fundo da seção atual
            const elementBehind = document.elementFromPoint(centerX, centerY + 100);
            if (elementBehind) {
                const styles = window.getComputedStyle(elementBehind);
                const bgColor = styles.backgroundColor;
                
                // Converter RGB para luminância
                const rgb = bgColor.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    const r = parseInt(rgb[0]);
                    const g = parseInt(rgb[1]);
                    const b = parseInt(rgb[2]);
                    
                    // Calcular luminância usando fórmula padrão
                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    return luminance > 0.6; // true se for claro, false se for escuro
                }
            }
        } catch (e) {
            // Fallback: detectar pela seção atual
            const sections = document.querySelectorAll('section, .hero, .about, .services, .contact');
            for (let section of sections) {
                const sectionRect = section.getBoundingClientRect();
                if (sectionRect.top <= centerY && sectionRect.bottom >= centerY) {
                    const styles = window.getComputedStyle(section);
                    const bgColor = styles.backgroundColor;
                    
                    // Detecção simples baseada em classes conhecidas
                    if (section.classList.contains('hero') || section.classList.contains('services')) {
                        return false; // seções escuras
                    } else if (section.classList.contains('about') || section.classList.contains('contact')) {
                        return true; // seções claras
                    }
                }
            }
        }
        
        return false; // padrão para escuro
    }
    
    function updateHeaderContrast() {
        const isLightBackground = detectBackgroundBrightness();
        
        if (isLightBackground) {
            header.classList.add('light-background');
        } else {
            header.classList.remove('light-background');
        }
    }
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Atualizar estado de scroll
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Atualizar contraste baseado no fundo
        updateHeaderContrast();
        
        lastScrollY = currentScrollY;
    });
    
    // Atualizar contraste inicial
    setTimeout(updateHeaderContrast, 100);

    // Menu mobile toggle com animações aprimoradas
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle das classes ativas
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Mostrar/esconder overlay
            if (mainNav.classList.contains('active')) {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
            } else {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }
        });

        // Fechar menu ao clicar no overlay
        overlay.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.main-nav .nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
            });
        });

        // Fechar menu ao redimensionar a tela
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }
        });
    }

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de envio de formulário
            alert('Obrigado por entrar em contato! Sua mensagem foi enviada.');
            contactForm.reset();
        });
    }
});
