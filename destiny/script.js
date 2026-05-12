// Section // Interactie, Menu & Vloeiende Beweging
document.addEventListener('DOMContentLoaded', () => {

    // ── Cookie banner ────────────────────────────────────────────────────────
    function getCookie(naam) {
        return document.cookie.split('; ').reduce(function(acc, c) {
            var parts = c.split('=');
            return parts[0] === naam ? parts[1] : acc;
        }, null);
    }
    function setCookie(naam, waarde, dagen) {
        var d = new Date();
        d.setTime(d.getTime() + dagen * 864e5);
        document.cookie = naam + '=' + waarde + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
    }

    var banner     = document.getElementById('cookie-banner');
    var btnAccept  = document.getElementById('cookie-accept');
    var btnDecline = document.getElementById('cookie-decline');

    if (banner && !getCookie('dd_cookie')) {
        setTimeout(function() { banner.classList.add('show'); }, 700);

        function sluitCookie(waarde) {
            setCookie('dd_cookie', waarde, 30);
            banner.classList.remove('show');
            banner.classList.add('hide');
            setTimeout(function() { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 500);
        }

        btnAccept.addEventListener('click',  function() { sluitCookie('accepted'); });
        btnDecline.addEventListener('click', function() { sluitCookie('declined'); });
    }

    // ── Reveal formulier bij scrollen ────────────────────────────────────────
    const formBox = document.querySelector('.glass-form-container');
    if (formBox) {
        formBox.style.opacity    = '0';
        formBox.style.transform  = 'translateY(40px)';
        formBox.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 }).observe(formBox);
    }

    // ── EmailJS configuratie ───────────────────────────────────────────────────
    // Stap 1: Maak gratis account op https://emailjs.com
    // Stap 2: Voeg een Email Service toe (bijv. Outlook) → kopieer de Service ID
    // Stap 3: Maak een Email Template → kopieer de Template ID
    //         Variabelen in de template: {{naam}}, {{email}}, {{dienst}}, {{bericht}}
    // Stap 4: Ga naar Account → kopieer jouw Public Key
    // Vervang de drie waarden hieronder:
    const EMAILJS_PUBLIC_KEY  = 'JOUW_PUBLIC_KEY';   // ← vervangen
    const EMAILJS_SERVICE_ID  = 'JOUW_SERVICE_ID';   // ← vervangen
    const EMAILJS_TEMPLATE_ID = 'JOUW_TEMPLATE_ID';  // ← vervangen

    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    // ── Formulier verzenden via EmailJS ───────────────────────────────────────
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const naam    = (form.querySelector('#naam').value    || '').trim();
            const email   = (form.querySelector('#email').value   || '').trim();
            const dienst  = (form.querySelector('#dienst').value  || '').trim();
            const bericht = (form.querySelector('#bericht').value || '').trim();

            if (!naam || !email || !dienst) {
                alert('Vul uw naam, e-mailadres en type dienstverlening in.');
                return;
            }

            const btn = form.querySelector('.submit-luxe');
            btn.textContent = 'Verzenden...';
            btn.disabled    = true;

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                naam:    naam,
                email:   email,
                dienst:  dienst,
                bericht: bericht || '—'
            }).then(() => {
                btn.textContent      = 'Aanvraag Verzonden \u2713';
                btn.style.background = 'var(--gold)';
                btn.style.color      = '#000';
                form.reset();
                setTimeout(() => {
                    btn.textContent      = 'Verstuur Aanvraag';
                    btn.style.background = '';
                    btn.style.color      = '';
                    btn.disabled         = false;
                }, 4000);
            }).catch(() => {
                btn.textContent = 'Fout — probeer opnieuw';
                btn.disabled    = false;
                setTimeout(() => { btn.textContent = 'Verstuur Aanvraag'; }, 3000);
            });
        });
    }

    // ── Hamburger menu ───────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const dropdown  = document.getElementById('nav-dropdown');
    const overlay   = document.getElementById('nav-overlay');

    function sluitMenu() {
        dropdown.classList.remove('open');
        overlay.style.display = 'none';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Menu openen');
    }

    function openMenu() {
        dropdown.classList.add('open');
        overlay.style.display = 'block';
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Menu sluiten');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.contains('open') ? sluitMenu() : openMenu();
    });

    // Overlay: klik overal op scherm sluit menu
    overlay.addEventListener('click', sluitMenu);

    // Sluit bij Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') sluitMenu();
    });

    // Sluit na klikken op een link
    dropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', sluitMenu);
    });

    // ── Diensten link: scroll naar formulier + zet focus op select ──────────
    document.querySelectorAll('a[href="#contact"], a[href="#diensten"]').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                const select = document.getElementById('dienst');
                if (select) select.focus();
            }, 650);
        });
    });

});