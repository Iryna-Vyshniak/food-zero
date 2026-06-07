export function initNavigation() {
  const mobileMenu = document.getElementById('mobile-menu');
  const submenuToggle = document.querySelector('.overlay-nav__toggle');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuOpenBtn = document.getElementById('menu-open-btn');

  console.log(mobileMenu, submenuToggle, menuCloseBtn, menuOpenBtn);

  if (!mobileMenu || !menuOpenBtn || !menuCloseBtn) return;

  const openMenu = () => {
    mobileMenu.showModal();
    menuOpenBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.close();
    menuOpenBtn.setAttribute('aria-expanded', 'false');
  };

  const mobileMenuClose = () => {
    menuOpenBtn.setAttribute('aria-expanded', 'false');
  };

  const toggleSubmenu = () => {
    const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
    submenuToggle.setAttribute('aria-expanded', String(!isExpanded));
  };

  menuOpenBtn.addEventListener('click', openMenu);
  menuCloseBtn.addEventListener('click', closeMenu);
  mobileMenu.addEventListener('close', mobileMenuClose);
  submenuToggle.addEventListener('click', toggleSubmenu);
}
