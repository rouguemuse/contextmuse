document.addEventListener('DOMContentLoaded', () => {
    // Sticky nav shadow
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Scroll reveal
    const reveals = document.querySelectorAll('.bento-card, .step, .trust-item, .info-card, .ba-card, .results-intro');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), 0);
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Form
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.textContent = 'Request Sent ✓';
            btn.style.background = '#22c55e';
            form.reset();
        });
    }
});
