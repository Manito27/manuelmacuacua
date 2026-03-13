// Script principal: menu mobile, voltar ao topo, formulários e utilitários
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.getElementById('siteNav');
    const voltarTopoBtn = document.getElementById('voltarTopo');

    // NAV toggle para mobile
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            body.classList.toggle('nav-open');
            siteNav.setAttribute('aria-hidden', String(expanded));
        });

        // Fechar menu ao clicar em um link
        siteNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                siteNav.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // Mostrar/ocultar botão voltar ao topo
    const toggleVoltarTopo = () => {
        if (!voltarTopoBtn) return;
        if (window.pageYOffset > 300) voltarTopoBtn.style.display = 'flex';
        else voltarTopoBtn.style.display = 'none';
    };
    toggleVoltarTopo();
    window.addEventListener('scroll', toggleVoltarTopo);

    if (voltarTopoBtn) {
        voltarTopoBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    }

    // Formulário de contacto (mailto fallback) — validação simples
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const email = contactForm.querySelector('input[type="email"]');
            if (email && !email.value.includes('@')) {
                e.preventDefault();
                alert('Por favor insira um e-mail válido.');
                email.focus();
            }
        });
    }

    // Adiciona ano atual no rodapé
    const anoAtual = new Date().getFullYear();
    document.querySelectorAll('#anoAtual').forEach(el => el.textContent = anoAtual);

    // Marca link ativo baseado no pathname
    const links = document.querySelectorAll('.site-nav a');
    links.forEach(a => {
        if (a.href === location.href || a.href === location.pathname.split('/').pop()) {
            a.classList.add('active');
        }
    });
  
    // Theme (claro / escuro) com persistência
    const themeToggle = document.getElementById('themeToggle');
    const preferred = localStorage.getItem('theme');
    const applyTheme = (theme) => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        // ajustar ícone
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    };

    // inicializa tema
    if (preferred) applyTheme(preferred);
    else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nowDark = document.documentElement.classList.toggle('dark');
            const newTheme = nowDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
});
