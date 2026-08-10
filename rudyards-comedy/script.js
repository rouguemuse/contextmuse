// Standard logic and premium interactions for The Houston Comedy Club

// --- Configuration & Data ---
// This array is ready to be replaced with a fetch() from a CMS or show populator API.
const UPCOMING_SHOWS = [
    {
        id: 1,
        title: "The Houston Showcase",
        date: "Friday, April 24 • 8:00 PM",
        description: "A curated lineup of the city's sharpest comedic voices and rising local talent.",
        image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=800",
        ticketLink: "#"
    },
    {
        id: 2,
        title: "Headliner Series: Casey Green",
        date: "Saturday, April 25 • 7:30 PM & 10:00 PM",
        description: "Direct from New York, Casey Green brings his acclaimed national tour to The Houston Comedy Club stage.",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
        ticketLink: "#"
    },
    {
        id: 3,
        title: "Experimental Night",
        date: "Wednesday, April 29 • 9:00 PM",
        description: "A raw, unfiltered night of new material and comedic risks from veteran performers.",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
        ticketLink: "#"
    },
    {
        id: 4,
        title: "Late Night Underground",
        date: "Thursday, April 30 • 10:30 PM",
        description: "The after-hours favorite. High energy, no filters, and secret drop-in guests.",
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedee6?auto=format&fit=crop&q=80&w=800",
        ticketLink: "#"
    }
];

// Fallback image for any broken links
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1485872233828-a2f7c46002bb?q=80&w=800&auto=format&fit=crop";

document.addEventListener('DOMContentLoaded', () => {
    initShows();
    initAnimations();
    initNavbar();
    initEmailSignup();
    initSmoothScroll();
});

// --- Show Population ---
function initShows() {
    const container = document.getElementById('shows-container');
    if (!container) return;

    // Clear loading state
    container.innerHTML = '';

    UPCOMING_SHOWS.forEach(show => {
        const showElement = document.createElement('article');
        showElement.className = 'show-card';
        showElement.innerHTML = `
            <div class="show-img">
                <img src="${show.image}" alt="${show.title}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
            </div>
            <div class="show-info">
                <p class="show-date">${show.date}</p>
                <h3 class="show-title">${show.title}</h3>
                <p class="show-desc">${show.description}</p>
                <a href="${show.ticketLink}" class="btn btn-primary" style="width: 100%; text-align: center;">Get Tickets</a>
            </div>
        `;
        container.appendChild(showElement);
    });
}

// --- Navigation Logic ---
function initNavbar() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 0';
            nav.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            nav.style.padding = '1.5rem 0';
            nav.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.0))';
        }
    });
}

// --- Smooth Scroll ---
function initSmoothScroll() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// --- Email Integration Spot ---
function initEmailSignup() {
    const signupForm = document.querySelector('.form-group');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = signupForm.querySelector('input');
        const submitBtn = signupForm.querySelector('button');
        const email = emailInput.value;

        // Visual feedback
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';

        try {
            /* 
               INTEGRATION NOTE:
               Replace this block with your actual email list API call (Mailchimp, ConvertKit, etc.)
               
               Example:
               await fetch('YOUR_API_ENDPOINT', {
                   method: 'POST',
                   body: JSON.stringify({ email: email })
               });
            */
            
            // Simulating API latency
            await new Promise(resolve => setTimeout(resolve, 1000));

            submitBtn.textContent = 'Welcome Aboard';
            submitBtn.style.backgroundColor = 'var(--accent)';
            submitBtn.style.color = '#000';
            submitBtn.style.border = '1px solid var(--accent)';
            emailInput.value = '';
            emailInput.disabled = true;
        } catch (error) {
            console.error('Email signup error:', error);
            submitBtn.textContent = 'Try Again';
            submitBtn.disabled = false;
        }
    });
}

// --- Animations ---
function initAnimations() {
    const revealElements = document.querySelectorAll('.show-card, .weekly-item, .text-reveal, .image-box, .section-header');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Use a class for the active state to keep it clean
        // We'll define simple active styles here via JS if needed, or stick to inline
        observer.observe(el);
    });

    // Reveal logic to check visibility
    const reveal = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.95) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check and scroll listener
    reveal();
    window.addEventListener('scroll', reveal);
}
