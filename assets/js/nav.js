/**
 * Context & Muse Navigation Controller
 * Handles semantic button-based mobile toggle, exclusive dropdown states,
 * desktop hover bridges, and complete keyboard/ESC accessibility.
 */
(() => {
    function initNav() {
        const toggleBtn = document.getElementById('nav-toggle-btn');
        const navLinks = document.getElementById('primary-nav-links');
        const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

        function closeAllDropdowns(except = null) {
            dropdowns.forEach(d => {
                if (d !== except && d.open) {
                    d.open = false;
                }
            });
        }

        function closeMobileNav() {
            if (toggleBtn && navLinks) {
                toggleBtn.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('is-open');
            }
        }

        // 1. Mobile Menu Toggle Button
        if (toggleBtn && navLinks) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
                const nextState = !isOpen;
                toggleBtn.setAttribute('aria-expanded', String(nextState));
                navLinks.classList.toggle('is-open', nextState);
                if (!nextState) {
                    closeAllDropdowns();
                }
            });
        }

        // 2. Mutual Exclusivity for Dropdowns
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('toggle', () => {
                if (dropdown.open) {
                    closeAllDropdowns(dropdown);
                }
            });

            // Close dropdown and mobile menu when clicking any link inside
            const links = dropdown.querySelectorAll('.nav-dropdown-link');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    dropdown.open = false;
                    closeMobileNav();
                });
            });
        });

        // Close mobile nav when clicking direct top-level links
        if (navLinks) {
            const topLinks = navLinks.querySelectorAll('.nav-link:not(summary), .nav-cta');
            topLinks.forEach(link => {
                link.addEventListener('click', () => {
                    closeMobileNav();
                });
            });
        }

        // 3. Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                closeAllDropdowns();
            }
            if (navLinks && navLinks.classList.contains('is-open') && !e.target.closest('.navbar')) {
                closeMobileNav();
            }
        });

        // 4. Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllDropdowns();
                closeMobileNav();
                if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'true') {
                    toggleBtn.focus();
                }
            }
        });

        // 5. Desktop Hover Management (with debounce to avoid jitter)
        const desktopQuery = window.matchMedia('(min-width: 901px)');
        
        dropdowns.forEach(dropdown => {
            let closeTimer = null;

            dropdown.addEventListener('mouseenter', () => {
                if (!desktopQuery.matches) return;
                clearTimeout(closeTimer);
                closeAllDropdowns(dropdown);
                dropdown.open = true;
            });

            dropdown.addEventListener('mouseleave', () => {
                if (!desktopQuery.matches) return;
                closeTimer = setTimeout(() => {
                    dropdown.open = false;
                }, 180);
            });

            // On summary click on desktop, keep it open or toggle cleanly
            const summary = dropdown.querySelector('summary');
            if (summary) {
                summary.addEventListener('click', (e) => {
                    if (desktopQuery.matches) {
                        e.preventDefault();
                        const wasOpen = dropdown.open;
                        closeAllDropdowns(dropdown);
                        dropdown.open = !wasOpen;
                    }
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNav);
    } else {
        initNav();
    }
})();

