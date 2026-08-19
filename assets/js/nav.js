/**
 * Context & Muse Navigation Dropdown Controller
 * Ensures exclusive dropdown state, click-outside-to-close, escape key support,
 * and clean desktop hover / mobile accordion coordination.
 */
(() => {
    function initNav() {
        const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
        if (!dropdowns.length) return;

        function closeAllDropdowns(except = null) {
            dropdowns.forEach(d => {
                if (d !== except && d.open) {
                    d.open = false;
                }
            });
        }

        // 1. Mutual Exclusivity: Only 1 dropdown open at a time
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('toggle', () => {
                if (dropdown.open) {
                    closeAllDropdowns(dropdown);
                }
            });

            // Close when clicking any link inside
            const links = dropdown.querySelectorAll('.nav-dropdown-link');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    dropdown.open = false;
                });
            });
        });

        // 2. Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                closeAllDropdowns();
            }
        });

        // 3. Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllDropdowns();
            }
        });

        // 4. Desktop Hover Management (with debounce to avoid jitter)
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
                }, 200);
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
