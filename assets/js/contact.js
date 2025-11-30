document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const resultBox = document.getElementById('contact-result');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  function setInvalid(input) {
    input.classList.add('is-invalid');
  }

  function clearInvalid(input) {
    input.classList.remove('is-invalid');
  }

  function validate() {
    let valid = true;

    // Reset napak
    [nameInput, emailInput, messageInput].forEach(clearInvalid);

    if (!nameInput.value.trim()) {
      setInvalid(nameInput);
      valid = false;
    }

    const emailVal = emailInput.value.trim();
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(emailVal)) {
      setInvalid(emailInput);
      valid = false;
    }

    if (!messageInput.value.trim()) {
      setInvalid(messageInput);
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    if (!validate()) {
      // stop submission when invalid
      e.preventDefault();
      return;
    }

    // Demo odgovor
    resultBox.innerHTML = `
      <div class="alert alert-success">
        Hvala za vaše sporočilo! Kontaktirali vas bomo v najkrajšem času.
      </div>
    `;

    // form.reset();
  });
});
