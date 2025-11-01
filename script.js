document.addEventListener('DOMContentLoaded', () => {

  lucide.createIcons();

  // Mark inline SVGs (icons) as decorative for assistive tech
  try {
    document.querySelectorAll('svg').forEach(s => {
      // Only set when not already meaningful
      if (!s.hasAttribute('role')) s.setAttribute('aria-hidden', 'true');
      s.setAttribute('focusable', 'false');
    });
  } catch (e) {
    // fail silently
  }

  const form = document.getElementById('schedule-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if (mobileNav.classList.contains('hidden')) {
        mobileNav.classList.remove('hidden');
      } else {
        mobileNav.classList.add('hidden');
      }
    });
  }

  // Accessibility: focus management and global ESC handler
  // When mobile nav opens, focus its first link. Close on Escape and return focus to toggle.
  function closeMobileNav() {
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
      mobileNav.classList.add('hidden');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      if (navToggle) navToggle.focus();
    }
  }

  function openMobileNav() {
    if (mobileNav && mobileNav.classList.contains('hidden')) {
      mobileNav.classList.remove('hidden');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
      // focus first link inside mobile nav
      const firstLink = mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  // Replace toggle click to use openMobileNav/closeMobileNav so focus is managed
  if (navToggle && mobileNav) {
    // remove previous handler if any by cloning
    const newToggle = navToggle.cloneNode(true);
    navToggle.parentNode.replaceChild(newToggle, navToggle);
    newToggle.addEventListener('click', (e) => {
      const isHidden = mobileNav.classList.contains('hidden');
      if (isHidden) openMobileNav(); else closeMobileNav();
    });
  }

  // Global key listener for Escape — closes mobile nav or modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      // close mobile nav if open
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
        closeMobileNav();
        return;
      }
      // close email modal if open
      const modal = document.getElementById('email-modal');
      if (modal && modal.style.display !== 'none') {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  });
});

function handleFormSubmit(event) {
  event.preventDefault();
  // trim inputs for safer URLs and basic validation
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const deviceType = document.getElementById('deviceType').value.trim();
  const problem = document.getElementById('problemDescription').value.trim();

  // basic client-side check (fields are required in HTML, but double-check)
  if (!name || !email || !phone || !deviceType || !problem) {
    alert('Por favor, preencha todos os campos antes de enviar.');
    return;
  }


  const whatsappNumber = '5583989160101';
  const whatsappMessage = `
Olá, INFORCELL! Gostaria de agendar um orçamento.
-----------------------------------
*Nome:* ${name}
*Telefone/WhatsApp:* ${phone}
*Email:* ${email}
*Equipamento:* ${deviceType}
*Problema:* ${problem}
-----------------------------------
`.trim();

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  

  const emailAddress = 'inforcellpatos@gmail.com';
  const emailSubject = `Agendamento de Serviço - ${name}`;
  const emailBody = `
Dados do Agendamento:

Nome Completo: ${name}
Email: ${email}
Telefone/WhatsApp: ${phone}
Tipo de Equipamento: ${deviceType}

Descrição do Problema:
${problem}
  `.trim();
  
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  try {
    // Abrir WhatsApp automaticamente (ação do usuário - submit). Para o email,
    // mostramos um modal com um botão que acionará o mailto (evita bloqueadores de popup).
    window.open(whatsappUrl, '_blank');

    const modal = document.getElementById('email-modal');
    const openBtn = document.getElementById('email-open-btn');
    const closeBtn = document.getElementById('email-close-btn');

    function closeModal() {
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    if (modal && openBtn && closeBtn) {
      // show
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');

      // open mailto only when user clicks the button
      openBtn.addEventListener('click', function onOpen() {
        window.open(mailtoUrl, '_blank');
        closeModal();
        openBtn.removeEventListener('click', onOpen);
      });

      // close handlers
      closeBtn.addEventListener('click', function onClose() {
        closeModal();
        closeBtn.removeEventListener('click', onClose);
      });

      // click outside modal content closes it
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    } else {
      // fallback: if modal not found, try to open mailto in a new tab
      window.open(mailtoUrl, '_blank');
    }
  } catch (error) {
    console.error("Erro ao tentar abrir os links:", error);
    alert("Ocorreu um erro ao abrir WhatsApp/Email. Por favor, entre em contato diretamente pelo número ou email informados.");
  }
}
