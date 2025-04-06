// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcd1234"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.querySelector('nav');
const themeToggle = document.getElementById('themeToggle');
const backToTopBtn = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const authButton = document.getElementById('authButton');
const loginPage = document.getElementById('loginPage');
const closeLogin = document.getElementById('closeLogin');
const loginGoogle = document.getElementById('loginGoogle');
const loginOutlook = document.getElementById('loginOutlook');
const openLogin = document.getElementById('open-login');
const testimonialForm = document.getElementById('testimonial-form');
const testimonialsList = document.getElementById('testimonialsList');
const authMessage = document.getElementById('auth-message');
const submitTestimonial = document.getElementById('submit-testimonial');
const testimonialEditor = document.getElementById('testimonial-editor');
const contactForm = document.getElementById('contact-form');
const messageEditor = document.getElementById('message-editor');
const contactLoginPrompt = document.getElementById('contact-login-prompt');
const contactLoginBtn = document.getElementById('contact-login-btn');

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

// Login Page Controls
authButton.addEventListener('click', () => {
    if (auth.currentUser) {
        auth.signOut();
    } else {
        loginPage.style.display = 'flex';
    }
});

closeLogin.addEventListener('click', () => {
    loginPage.style.display = 'none';
});

openLogin.addEventListener('click', () => {
    loginPage.style.display = 'flex';
});

contactLoginBtn.addEventListener('click', () => {
    loginPage.style.display = 'flex';
});

// Authentication with Google or Outlook only
loginGoogle.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    signInWithProvider(provider);
});

loginOutlook.addEventListener('click', () => {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    signInWithProvider(provider);
});

function signInWithProvider(provider) {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            const email = user.email.toLowerCase();
            
            if (!email.endsWith('@gmail.com') && !email.endsWith('@outlook.com') && 
                !email.endsWith('@hotmail.com')) {
                auth.signOut();
                throw new Error('يجب استخدام حساب Google أو Outlook فقط');
            }
            
            loginPage.style.display = 'none';
            updateAuthUI(user);
        })
        .catch((error) => {
            authMessage.textContent = error.message;
            authMessage.style.color = 'red';
        });
}

function updateAuthUI(user) {
    if (user) {
        authButton.innerHTML = `
            <img src="${user.photoURL}" alt="صورة المستخدم" class="user-avatar">
            <span>${user.displayName}</span>
            <i class="fas fa-sign-out-alt"></i>
        `;
        
        // Show testimonial form if on testimonials section
        if (testimonialForm) {
            testimonialForm.style.display = 'block';
            document.getElementById('login-prompt').style.display = 'none';
            document.getElementById('user-photo').src = user.photoURL;
            document.getElementById('user-name').textContent = user.displayName;
        }
        
        // Show contact form
        if (contactForm) {
            contactLoginPrompt.style.display = 'none';
            contactForm.style.display = 'block';
            document.querySelector('input[name="name"]').value = user.displayName;
            document.querySelector('input[name="email"]').value = user.email;
        }
    } else {
        authButton.innerHTML = '<i class="fas fa-user"></i> <span>تسجيل الدخول</span>';
        
        // Hide testimonial form if on testimonials section
        if (testimonialForm) {
            testimonialForm.style.display = 'none';
            document.getElementById('login-prompt').style.display = 'block';
        }
        
        // Hide contact form
        if (contactForm) {
            contactLoginPrompt.style.display = 'block';
            contactForm.style.display = 'none';
        }
    }
}

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

    // Check if the selected text is already formatted
    const parentElement = range.commonAncestorContainer.parentElement;
    if (parentElement.style[command === 'bold' ? 'fontWeight' : 
                          command === 'italic' ? 'fontStyle' : 'textDecoration']) {
        // Remove formatting
        const textNode = document.createTextNode(selectedText);
        range.deleteContents();
        range.insertNode(textNode);
    } else {
        // Apply formatting
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
    }

    // Restore selection
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
        const user = auth.currentUser;
        if (!user) return;
        
        const content = testimonialEditor.innerHTML;
        
        if (!content.trim() || content === '<div><br></div>' || content === '<br>') {
            authMessage.textContent = 'الرجاء كتابة رأيك قبل النشر';
            authMessage.style.color = 'red';
            return;
        }
        
        db.collection('testimonials').add({
            userId: user.uid,
            userName: user.displayName,
            userPhoto: user.photoURL,
            content: content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            testimonialEditor.innerHTML = '';
            authMessage.textContent = 'شكراً لك! تم نشر رأيك بنجاح.';
            authMessage.style.color = 'green';
            loadTestimonials();
        })
        .catch((error) => {
            authMessage.textContent = 'حدث خطأ أثناء نشر رأيك: ' + error.message;
            authMessage.style.color = 'red';
        });
    });
}

// Load testimonials
function loadTestimonials() {
    if (!testimonialsList) return;
    
    db.collection('testimonials')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get()
        .then((querySnapshot) => {
            testimonialsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const testimonial = doc.data();
                const testimonialItem = document.createElement('div');
                testimonialItem.className = 'testimonial-item animate-on-scroll';
                
                testimonialItem.innerHTML = `
                    <div class="testimonial-header">
                        <img src="${testimonial.userPhoto}" alt="صورة ${testimonial.userName}" class="testimonial-avatar">
                        <div>
                            <div class="testimonial-author">${testimonial.userName}</div>
                            <div class="testimonial-date">${new Date(testimonial.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}</div>
                        </div>
                    </div>
                    <div class="testimonial-content">${testimonial.content}</div>
                `;
                
                testimonialsList.appendChild(testimonialItem);
            });
            
            // Trigger animation for new elements
            setTimeout(animateOnScroll, 100);
        })
        .catch((error) => {
            console.error('Error loading testimonials: ', error);
        });
}

// Load more testimonials
if (document.getElementById('loadMoreTestimonials')) {
    document.getElementById('loadMoreTestimonials').addEventListener('click', loadMoreTestimonials);
}

function loadMoreTestimonials() {
    // Implement load more functionality here
    alert('سيتم تحميل المزيد من الآراء في التطبيق الكامل');
}

// Contact form
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formSuccess = document.getElementById('form-success');
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
    
    // Load testimonials if on testimonials page
    if (window.location.hash === '#testimonials' || document.getElementById('testimonialsList')) {
        loadTestimonials();
    }
    
    // Update auth UI
    auth.onAuthStateChanged(updateAuthUI);
});

window.addEventListener('scroll', animateOnScroll);