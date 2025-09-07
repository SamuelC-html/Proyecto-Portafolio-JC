// Variables globales
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const contactForm = document.getElementById('contact-form');
const skillProgressBars = document.querySelectorAll('.skill-progress');

// ==================== MENÚ HAMBURGUESA ====================
function initHamburgerMenu() {
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
}

// ==================== VALIDACIÓN DE FORMULARIO EN TIEMPO REAL ====================
function initFormValidation() {
    if (!contactForm) return;

    const formFields = {
        nombre: {
            element: document.getElementById('inpt-nombreUsuario'),
            error: document.getElementById('error-nombre'),
            validate: (value) => {
                if (!value.trim()) return 'El nombre es requerido';
                if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
                return '';
            }
        },
        correo: {
            element: document.getElementById('inpt-correoUsuario'),
            error: document.getElementById('error-correo'),
            validate: (value) => {
                if (!value.trim()) return 'El correo electrónico es requerido';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Ingrese un correo electrónico válido';
                return '';
            }
        },
        asunto: {
            element: document.getElementById('inpt-asunto'),
            error: document.getElementById('error-asunto'),
            validate: (value) => {
                if (!value.trim()) return 'El asunto es requerido';
                if (value.trim().length < 5) return 'El asunto debe tener al menos 5 caracteres';
                return '';
            }
        },
        descripcion: {
            element: document.getElementById('inpt-descripcion'),
            error: document.getElementById('error-descripcion'),
            validate: (value) => {
                if (!value.trim()) return 'La descripción es requerida';
                if (value.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres';
                if (value.trim().length > 500) return 'La descripción no puede exceder 500 caracteres';
                return '';
            }
        }
    };

    // Función para mostrar error
    function showError(field, message) {
        field.element.classList.add('error');
        field.error.textContent = message;
        field.error.style.display = 'block';
    }

    // Función para limpiar error
    function clearError(field) {
        field.element.classList.remove('error');
        field.error.textContent = '';
        field.error.style.display = 'none';
    }

    // Función para validar un campo
    function validateField(fieldName) {
        const field = formFields[fieldName];
        const value = field.element.value;
        const errorMessage = field.validate(value);

        if (errorMessage) {
            showError(field, errorMessage);
            return false;
        } else {
            clearError(field);
            return true;
        }
    }

    // Agregar event listeners para validación en tiempo real
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        
        // Validar al escribir (con debounce)
        let timeout;
        field.element.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => validateField(fieldName), 300);
        });

        // Validar al perder el foco
        field.element.addEventListener('blur', () => validateField(fieldName));
    });

    // Validar formulario completo al enviar
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        Object.keys(formFields).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isFormValid = false;
            }
        });

        const submitBtn = document.getElementById('submit-btn');
        
        if (isFormValid) {
            // Simular envío exitoso
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('¡Mensaje enviado exitosamente! Te contactaré pronto.');
                contactForm.reset();
                submitBtn.textContent = 'Enviar';
                submitBtn.disabled = false;
                
                // Limpiar todos los errores
                Object.keys(formFields).forEach(fieldName => {
                    clearError(formFields[fieldName]);
                });
            }, 2000);
        } else {
            // Hacer scroll al primer campo con error
            const firstErrorField = Object.keys(formFields).find(fieldName => 
                formFields[fieldName].element.classList.contains('error')
            );
            
            if (firstErrorField) {
                formFields[firstErrorField].element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                formFields[firstErrorField].element.focus();
            }
        }
    });
}

// ==================== ANIMACIÓN DE BARRAS DE PROGRESO ====================
function initSkillBars() {
    const skillSection = document.getElementById('section-skills');
    if (!skillSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(skillSection);
}

function animateSkillBars() {
    skillProgressBars.forEach(bar => {
        const skillLevel = bar.getAttribute('data-skill');
        
        // Resetear la barra
        bar.style.width = '0%';
        
        // Animar la barra
        setTimeout(() => {
            bar.style.width = skillLevel + '%';
        }, 200);
    });
}

// ==================== NAVEGACIÓN SUAVE ====================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== EFECTOS DE SCROLL ====================
function initScrollEffects() {
    const sections = document.querySelectorAll('.section-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ==================== FUNCIONALIDAD DEL BLOG ====================
function initBlogFunctionality() {
    const newPostBtn = document.querySelector('.new-post-btn');
    const blogList = document.getElementById('blog-list');
    
    if (newPostBtn && blogList) {
        newPostBtn.addEventListener('click', () => {
            const title = prompt('Título del nuevo post:');
            if (title && title.trim()) {
                addNewBlogPost(title.trim(), blogList);
            }
        });
    }
}

function addNewBlogPost(title, blogList) {
    const currentDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    const newPost = document.createElement('article');
    newPost.className = 'blog-post';
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(20px)';
    
    newPost.innerHTML = `
        <div class="post-date">${currentDate}</div>
        <h3>${title}</h3>
        <p>Este es un nuevo post del blog. Aquí puedes escribir sobre tus experiencias, aprendizajes y proyectos...</p>
        <a href="#" class="read-more">Leer más</a>
    `;
    
    blogList.insertBefore(newPost, blogList.firstChild);
    
    // Animar la entrada del nuevo post
    setTimeout(() => {
        newPost.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        newPost.style.opacity = '1';
        newPost.style.transform = 'translateY(0)';
    }, 100);
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portafolio de Samuel Cano - JavaScript cargado correctamente');
    
    // Inicializar todas las funcionalidades
    initHamburgerMenu();
    initFormValidation();
    initSkillBars();
    initSmoothScrolling();
    initScrollEffects();
    initBlogFunctionality();
    
    // Mensaje de bienvenida en consola
    console.log(`
    ╔══════════════════════════════════════╗
    ║        PORTAFOLIO SAMUEL CANO        ║
    ║                                      ║
    ║  ✅ Menú hamburguesa responsive      ║
    ║  ✅ Validación de formulario         ║
    ║  ✅ Animaciones de habilidades       ║
    ║  ✅ Navegación suave                 ║
    ║  ✅ Efectos de scroll                ║
    ║  ✅ Funcionalidad de blog            ║
    ║                                      ║
    ║     Todas las funciones activas      ║
    ╚══════════════════════════════════════╝
    `);
});

// ==================== EVENT LISTENERS ADICIONALES ====================

// Cambiar estilo del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--black)';
        header.style.backdropFilter = 'none';
    }
});

// Prevenir el envío del formulario por defecto
window.addEventListener('beforeunload', (e) => {
    const form = document.getElementById('contact-form');
    if (form) {
        const formData = new FormData(form);
        let hasData = false;
        
        for (let [key, value] of formData.entries()) {
            if (value.trim()) {
                hasData = true;
                break;
            }
        }
        
        if (hasData) {
            e.preventDefault();
            e.returnValue = '¿Estás seguro de que quieres salir? Los datos del formulario se perderán.';
        }
    }
});
