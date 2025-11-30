async function loadPartial(containerId, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const html = await res.text();
    document.getElementById(containerId).innerHTML = html;

    // po navbar/footer loadu posodobi števec v košarici
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }

    // nastavi leto v footerju
    const yearSpan = document.getElementById('year-span');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  } catch (err) {
    console.error('Napaka pri nalaganju partiala', url, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) loadPartial('navbar-container', 'partials/navbar.html');

  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) loadPartial('footer-container', 'partials/footer.html');
});
