// DOM Elements
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.querySelector('nav');
const themeToggle = document.getElementById('themeToggle');
const backToTopBtn = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const testimonialForm = document.getElementById('testimonial-form');
const testimonialsList = document.getElementById('testimonialsList');
const submitTestimonial = document.getElementById('submit-testimonial');
const testimonialEditor = document.getElementById('testimonial-editor');
const contactForm = document.getElementById('contact-form');
const messageEditor = document.getElementById('message-editor');
const formSuccess = document.getElementById('form-success');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.querySelector('.fa-moon').style.opacity = isDark ? '0' : '1';
    themeToggle.querySelector('.fa-sun').style.opacity = isDark ? '1' : '0';
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}
updateThemeIcon();

// Burger Menu
burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    nav.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close menu when clicking on nav links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Progress bar
window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const scrollPercentage = (scrollPosition / scrollTotal) * 100;
    progressBar.style.width = scrollPercentage + '%';
    
    // Back to top button
    if (scrollPosition > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// Back to top button
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Text formatting functions
function toggleFormatting(editor, command) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let selectedText = range.toString();
    if (!selectedText) return;

    const span = document.createElement('span');
    
    switch(command) {
        case 'bold':
            span.style.fontWeight = span.style.fontWeight === 'bold' ? 'normal' : 'bold';
            span.style.color = span.style.color === 'blue' ? '' : 'blue';
            break;
        case 'italic':
            span.style.fontStyle = span.style.fontStyle === 'italic' ? 'normal' : 'italic';
            break;
        case 'underline':
            span.style.textDecoration = span.style.textDecoration === 'underline' ? 'none' : 'underline';
            break;
    }

    const parentElement = range.commonAncestorContainer.parentElement;
    if (parentElement.style[command === 'bold' ? 'fontWeight' : 
                          command === 'italic' ? 'fontStyle' : 'textDecoration']) {
        const textNode = document.createTextNode(selectedText);
        range.deleteContents();
        range.insertNode(textNode);
    } else {
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
    }

    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    editor.focus();
}

// Text formatting buttons
document.querySelectorAll('.text-formatting button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const command = this.getAttribute('data-command');
        let editor;
        
        if (this.closest('#testimonial-form')) {
            editor = testimonialEditor;
        } else {
            editor = messageEditor;
        }
        
        toggleFormatting(editor, command);
    });
});

// Submit testimonial
if (submitTestimonial) {
    submitTestimonial.addEventListener('click', () => {
        const name = document.getElementById('guest-name').value || 'زائر';
        const content = testimonialEditor.innerHTML;
        
        if (!content.trim() || content === '<div><br></div>' || content === '<br>') {
            alert('الرجاء كتابة رأيك قبل النشر');
            return;
        }
        
        const testimonial = {
            name: name,
            content: content,
            date: new Date().toLocaleDateString('ar-EG')
        };
        
        let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
        testimonials.unshift(testimonial);
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        
        testimonialEditor.innerHTML = '';
        document.getElementById('guest-name').value = '';
        loadTestimonials();
        
        alert('شكراً لك! تم نشر رأيك بنجاح.');
    });
}

// Load testimonials from localStorage
function loadTestimonials() {
    if (!testimonialsList) return;
    
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    testimonialsList.innerHTML = '';
    
    testimonials.forEach((testimonial) => {
        const testimonialItem = document.createElement('div');
        testimonialItem.className = 'testimonial-item animate-on-scroll';
        
        testimonialItem.innerHTML = `
            <div class="testimonial-header">
                <div class="testimonial-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <div class="testimonial-author">${testimonial.name}</div>
                    <div class="testimonial-date">${testimonial.date}</div>
                </div>
            </div>
            <div class="testimonial-content">${testimonial.content}</div>
        `;
        
        testimonialsList.appendChild(testimonialItem);
    });
    
    setTimeout(animateOnScroll, 100);
}

// Contact form
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        formSuccess.textContent = 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً!';
        formSuccess.style.display = 'block';
        
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
        
        e.target.reset();
        messageEditor.innerHTML = '';
    });
}

// Animate on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate');
            
            const delay = element.dataset.delay || 0;
            element.style.transitionDelay = `${delay}ms`;
        }
    });
};

// Initialize
window.addEventListener('load', () => {
    animateOnScroll();
    setTimeout(() => {
        document.querySelector('.loader-wrapper').classList.add('hidden');
    }, 1000);
    
    if (window.location.hash === '#testimonials' || document.getElementById('testimonialsList')) {
        loadTestimonials();
    }
});

window.addEventListener('scroll', animateOnScroll);
