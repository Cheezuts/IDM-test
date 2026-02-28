// Sidebar navigation
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Active nav link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .sidebar-links a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Contact form handling (only on contact page)
document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var form = e.target;
        var submitBtn = document.getElementById('submitBtn');
        var messageDiv = document.getElementById('message');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        var formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                messageDiv.style.display = 'block';
                messageDiv.className = 'success-message';
                messageDiv.innerHTML = '&#10004; Votre message a été envoyé avec succès !<br>Nous vous répondrons dans les plus brefs délais.';
                form.reset();
                messageDiv.scrollIntoView({ behavior: 'smooth' });
                // Clear localStorage
                var inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(function(input) {
                    localStorage.removeItem('form_' + input.name);
                });
                setTimeout(function() {
                    messageDiv.style.display = 'none';
                }, 8000);
            } else {
                throw new Error('Erreur réseau');
            }
        })
        .catch(function(error) {
            messageDiv.style.display = 'block';
            messageDiv.className = 'error-message';
            messageDiv.innerHTML = '&#10008; Une erreur est survenue lors de l\'envoi.<br>Veuillez réessayer ou nous contacter directement.';
            messageDiv.scrollIntoView({ behavior: 'smooth' });
            setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 8000);
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer ma demande';
        });
    });

    // Form localStorage save/restore
    var inputs = contactForm.querySelectorAll('input, select, textarea');

    inputs.forEach(function(input) {
        var saved = localStorage.getItem('form_' + input.name);
        if (saved && input.type !== 'submit' && input.type !== 'checkbox') {
            input.value = saved;
        }
    });

    inputs.forEach(function(input) {
        input.addEventListener('input', function() {
            if (this.type !== 'submit' && this.type !== 'checkbox') {
                localStorage.setItem('form_' + this.name, this.value);
            }
        });
    });
});

// Open Google reviews link
function openGoogleReviews() {
    window.open('https://www.google.com/search?q=IDM+Entreprise+Arles+avis', '_blank');
}

// Animation au scroll (reviews)
function animateOnScroll() {
    var reviewCards = document.querySelectorAll('.review-card');
    if (reviewCards.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    reviewCards.forEach(function(card) {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', animateOnScroll);

// Animated counters for stats
function animateCounters() {
    var counters = document.querySelectorAll('.stats-number');
    if (counters.length === 0) return;

    counters.forEach(function(counter) {
        var target = parseFloat(counter.textContent);
        var increment = target / 50;
        var current = 0;

        var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toString().includes('.') ? target.toFixed(1) : target;
                clearInterval(timer);
            } else {
                counter.textContent = target.toString().includes('.') ? current.toFixed(1) : Math.ceil(current);
            }
        }, 30);
    });
}

// Image error handling
document.addEventListener('DOMContentLoaded', function() {
    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image non chargée:', this.src);
        });
    });
});

// Lazy loading optimization
if ('IntersectionObserver' in window) {
    var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Stats observer
document.addEventListener('DOMContentLoaded', function() {
    var statsSection = document.querySelector('.reviews-stats');
    if (statsSection) {
        var statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // Service Worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
            console.log('Service Worker enregistré:', registration);
        })
        .catch(function(error) {
            console.log('Erreur Service Worker:', error);
        });
    }
});
