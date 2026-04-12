document.addEventListener("DOMContentLoaded", () => {
    // --- Splash Screen ---
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('hidden');
        }, 2200);
    }

    // Configuración base animaciones de entrada
    gsap.config({ force3D: true });

    const elements = document.querySelectorAll('.animate-in');
    gsap.set(elements, { y: 30, opacity: 0 });
    gsap.to(elements, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 2.4
    });

    // Parallax logic disabled to prefer fixed aesthetic with local assets

    // --- UI Sound Synthesis (Premium Click) ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playHapticSound() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    const interactEls = document.querySelectorAll('.ui-interact, .social-btn');
    interactEls.forEach(el => {
        el.addEventListener('pointerdown', () => playHapticSound());
    });

    // --- Modal Logic ---
    const modalLinks = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) targetModal.classList.remove('hidden');
        });
    });

    closeBtns.forEach(btn => btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.add('hidden')));
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

    // --- Cotizador a WhatsApp ---
    const btnCotizar = document.getElementById('btn-enviar-cotizacion');
    if (btnCotizar) {
        btnCotizar.addEventListener('click', () => {
            const servicio = document.getElementById('cotizador-servicio').value;
            const detalles = document.getElementById('cotizador-detalles').value;
            if (!servicio) return alert('Por favor selecciona el servicio principal requerido.');
            const text = `Hola *Luis Trejo*, nos gustaría recibir información para el servicio de *${servicio}*.\n\nDetalles:\n${detalles}`;
            window.open(`https://wa.me/522291697013?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    // --- Generate VCF Direct Download ---
    const btnVcf = document.getElementById('btn-vcf');
    if(btnVcf) {
        btnVcf.addEventListener('click', () => {
            const vcfData = `BEGIN:VCARD
VERSION:3.0
N:Trejo;Luis;;;
FN:Luis Trejo
ORG:Puerto Buceo Industrial
TITLE:CEO & Director General
TEL;type=WORK;type=VOICE;type=pref:+52 229 169 7013
EMAIL:contacto@puertobuceoindustrial.com
URL:https://puertobuceoindustrial.com
END:VCARD`;

            const blob = new Blob([vcfData], { type: 'text/vcard' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', 'Luis_Trejo_PuertoBuceo.vcf');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // --- Bilingual Toggle Logic (ES/EN) ---
    const langToggleBtn = document.getElementById('lang-toggle');
    const translatableElements = document.querySelectorAll('[data-es][data-en]');
    
    if(langToggleBtn) {
        let currentLang = 'es';
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            langToggleBtn.setAttribute('data-current', currentLang);
            
            // Highlight text
            langToggleBtn.querySelector('[data-lang="es"]').classList.toggle('active', currentLang === 'es');
            langToggleBtn.querySelector('[data-lang="en"]').classList.toggle('active', currentLang === 'en');
            
            // Swap all texts natively smoothly
            translatableElements.forEach(el => {
                // If it's an input/textarea placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = el.getAttribute(`data-${currentLang}`);
                } else {
                    el.innerHTML = el.getAttribute(`data-${currentLang}`);
                }
            });
        });
    }

    // --- Animated Stat Counters ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        function tick() {
            current += step;
            if (current >= target) { el.textContent = target; return; }
            el.textContent = Math.floor(current);
            requestAnimationFrame(tick);
        }
        tick();
    }

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsCounted) {
                    statsCounted = true;
                    statNumbers.forEach(el => animateCounter(el));
                }
            });
        }, { threshold: 0.5 });
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) statsObserver.observe(statsSection);
    }

    // --- Shimmer Effect on Link Cards ---
    const shimmerCards = document.querySelectorAll('.shimmer-effect');
    let shimmerIndex = 0;
    function triggerShimmer() {
        if (shimmerCards.length === 0) return;
        const card = shimmerCards[shimmerIndex % shimmerCards.length];
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'shimmerSweep 0.8s ease-in-out';
        shimmerIndex++;
    }
    setInterval(triggerShimmer, 3000);
});
