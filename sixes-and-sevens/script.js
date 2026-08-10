document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lineCanvas');
    const ctx = canvas.getContext('2d');
    const eightsElement = document.getElementById('eights');
    const acesElement = document.getElementById('aces');
    
    // Default mouse position at center
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Smooth mouse position for fluid animation
    let currentX = mouseX;
    let currentY = mouseY;
    
    // Target points for lines to connect to the text
    let eightsPoint = { x: 0, y: 0 };
    let acesPoint = { x: 0, y: 0 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateTextPoints();
    }

    function updateTextPoints() {
        if (eightsElement) {
            const eightsRect = eightsElement.getBoundingClientRect();
            eightsPoint.x = eightsRect.left + (eightsRect.width * 0.45); 
            eightsPoint.y = eightsRect.bottom - (eightsRect.height * 0.1); 
        }

        if (acesElement) {
            const acesRect = acesElement.getBoundingClientRect();
            acesPoint.x = acesRect.left + (acesRect.width * 0.1);
            acesPoint.y = acesRect.top + (acesRect.height * 0.2);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.documentElement.style.setProperty('--x', mouseX + 'px');
        document.documentElement.style.setProperty('--y', mouseY + 'px');
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            document.documentElement.style.setProperty('--x', mouseX + 'px');
            document.documentElement.style.setProperty('--y', mouseY + 'px');
        }
    }, { passive: true });

    function updateClocks() {
        const now = new Date();
        const localTimeStr = now.toLocaleTimeString('en-GB', { hour12: false });
        document.getElementById('time-local').textContent = localTimeStr;
        const londonTimeStr = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour12: false });
        document.getElementById('time-london').textContent = londonTimeStr;
    }
    
    setInterval(updateClocks, 1000);
    updateClocks();

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(btn => {
            btn.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    function drawLines() {
        updateTextPoints(); // Call this continuously to account for page scrolling
        
        // Interpolate current position towards mouse position for smoothness
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (eightsElement) {
            // Draw green line from EIGHTS to mouse
            ctx.beginPath();
            ctx.moveTo(eightsPoint.x, eightsPoint.y);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = '#00ff66';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ff66';
            ctx.stroke();
        }

        if (acesElement) {
            // Draw pink line from ACES to mouse
            ctx.beginPath();
            ctx.moveTo(acesPoint.x, acesPoint.y);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff00ff';
            ctx.stroke();
        }

        requestAnimationFrame(drawLines);
    }

    // Initialize
    resizeCanvas();
    drawLines();
    
    // Delay first update slightly to ensure fonts are loaded and rects are correct
    setTimeout(updateTextPoints, 500);
    setTimeout(updateTextPoints, 2000); // safety catch for slower connections
});
