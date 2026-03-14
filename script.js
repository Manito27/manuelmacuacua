// Script principal: tema, menu mobile, voltar ao topo, links ativos, formulário (mailto)
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navOverlay = document.querySelector('[data-nav-overlay]');
  const nav = document.querySelector('[data-nav]');
  const toTop = document.querySelector('[data-to-top]');
  const toast = document.querySelector('[data-toast]');
  const contactForm = document.querySelector('[data-contact-form]');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-open');
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.classList.remove('is-open'), 3600);
  };

  // Ano no rodapé
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(year)));

  // Tema (claro/escuro) com persistência
  const themeKey = 'mm_theme';
  const systemTheme = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    root.classList.toggle('theme-dark', isDark);
    root.dataset.theme = isDark ? 'dark' : 'light';
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro');
      themeToggle.setAttribute('title', isDark ? 'Tema: escuro' : 'Tema: claro');
    }
  };

  applyTheme(localStorage.getItem(themeKey) || systemTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.classList.contains('theme-dark') ? 'light' : 'dark';
      localStorage.setItem(themeKey, next);
      applyTheme(next);
    });
  }

  // Links ativos no menu
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (nav) {
    nav.querySelectorAll('a[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').trim();
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const target = href.split('#')[0].split('?')[0].toLowerCase();
      if (target === currentPage) a.setAttribute('aria-current', 'page');
    });
  }

  // Header: estado ao rolar
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 650);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile (drawer)
  const openNav = () => {
    root.classList.add('nav-open');
    if (navOverlay) navOverlay.hidden = false;
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    root.classList.remove('nav-open');
    if (navOverlay) navOverlay.hidden = true;
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (navToggle && navOverlay && nav) {
    navOverlay.hidden = true;
    navToggle.addEventListener('click', () => {
      if (root.classList.contains('nav-open')) closeNav();
      else openNav();
    });
    navOverlay.addEventListener('click', closeNav);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('nav-open')) closeNav();
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  }

  // Voltar ao topo
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Formulário de contactos: mailto sem alertas
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const honeypot = contactForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim()) return;

      const to = (contactForm.getAttribute('data-email-to') || '').trim();
      const nome = contactForm.querySelector('input[name="nome"]');
      const email = contactForm.querySelector('input[name="email"]');
      const assunto = contactForm.querySelector('input[name="assunto"]');
      const mensagem = contactForm.querySelector('textarea[name="mensagem"]');

      const required = [nome, email, mensagem].filter(Boolean);
      const firstInvalid = required.find((el) => !el.value.trim());
      if (firstInvalid) {
        showToast('Preencha os campos obrigatórios antes de enviar.');
        firstInvalid.focus();
        return;
      }

      const emailValue = (email?.value || '').trim();
      if (emailValue && !emailValue.includes('@')) {
        showToast('Insira um e-mail válido.');
        email?.focus();
        return;
      }

      if (!to) {
        showToast('Destino de e-mail não configurado.');
        return;
      }

      const subject = (assunto?.value || `Novo contacto - ${nome?.value || ''}`).trim();
      const bodyLines = [
        `Nome: ${(nome?.value || '').trim()}`,
        `Email: ${emailValue}`,
        '',
        (mensagem?.value || '').trim(),
      ];

      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      showToast('A abrir o seu cliente de e-mail...');
      window.location.href = mailto;
    });
  }
});
