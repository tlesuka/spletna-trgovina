function validateCheckoutForm() {
  let valid = true;

  const fullName = document.getElementById('full_name');
  const email = document.getElementById('email');
  const address = document.getElementById('address');
  const zip = document.getElementById('zip');
  const city = document.getElementById('city');
  const paymentMethod = document.getElementById('payment-method');

  const cardNumber = document.getElementById('card_number');
  const cardExpiry = document.getElementById('card_expiry');
  const cardCvc = document.getElementById('card_cvc');

  function clearInvalid(input) {
    if (!input) return;
    input.classList.remove('is-invalid');
  }
  function setInvalid(input) {
    if (!input) return;
    input.classList.add('is-invalid');
    valid = false;
  }

  // počisti stare napake
  [
    fullName,
    email,
    address,
    zip,
    city,
    cardNumber,
    cardExpiry,
    cardCvc,
  ].forEach(clearInvalid);

  // osnovna polja
  if (!fullName.value.trim()) setInvalid(fullName);

  const emailVal = email.value.trim();
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailVal || !emailRegex.test(emailVal)) setInvalid(email);

  if (!address.value.trim()) setInvalid(address);

  const zipVal = zip.value.trim();
  const zipRegex = /^[0-9]{4}$/; // 4 številke, lahko prilagodiš
  if (!zipVal || !zipRegex.test(zipVal)) setInvalid(zip);

  if (!city.value.trim()) setInvalid(city);

  // če je plačilo s kartico, preveri kartična polja
  if (paymentMethod.value === 'card') {
    const rawCard = cardNumber.value.replace(/\s+/g, '');
    const cardRegex = /^[0-9]{16}$/;
    if (!cardRegex.test(rawCard)) {
      setInvalid(cardNumber);
    }

    const expiryVal = cardExpiry.value.trim();
    const expMatch = expiryVal.match(/^(\d{2})\/(\d{2})$/);
    if (!expMatch) {
      setInvalid(cardExpiry);
    } else {
      const month = parseInt(expMatch[1], 10);
      const year = parseInt(expMatch[2], 10); // zadnji dve cifri

      if (month < 1 || month > 12) {
        setInvalid(cardExpiry);
      } else {
        const now = new Date();
        const currentYear = now.getFullYear() % 100; // zadnji dve cifri
        const currentMonth = now.getMonth() + 1; // 1-12

        // leto manjše ali enako, mesec manjši -> pretečeno
        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          setInvalid(cardExpiry);
        }
      }
    }

    const cvcVal = cardCvc.value.trim();
    const cvcRegex = /^[0-9]{3}$/;
    if (!cvcRegex.test(cvcVal)) {
      setInvalid(cardCvc);
    }
  }

  return valid;
}

// ====== GLAVNA CHECKOUT LOGIKA ======
document.addEventListener('DOMContentLoaded', () => {
  const itemsContainer = document.getElementById('checkout-items');
  const totalElement = document.getElementById('checkout-total');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const paymentMethod = document.getElementById('payment-method');
  const cardFields = document.getElementById('card-fields');

  const cardNumberInput = document.getElementById('card_number');
  const cardExpiryInput = document.getElementById('card_expiry');

  // toggle card fields glede na način plačila
  function toggleCardFields() {
    if (paymentMethod.value === 'card') {
      cardFields.style.display = 'block';
    } else {
      cardFields.style.display = 'none';
    }
  }
  toggleCardFields();
  paymentMethod.addEventListener('change', toggleCardFields);

  // render izdelkov iz košarice
  const cart = getCart();

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p>Košarica je prazna.</p>';
    totalElement.textContent = '0.00 €';
    placeOrderBtn.disabled = true;
    return;
  }

  itemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item) => {
    const product = getProductById(item.id);
    if (!product) return;

    const price = Number(product.price);
    const lineTotal = price * item.quantity;
    total += lineTotal;

    itemsContainer.innerHTML += `
      <div class="d-flex justify-content-between border-bottom py-2">
        <div>
          <strong>${product.name}</strong>
          <div class="text-muted small">
            ${item.quantity} × ${price.toFixed(2)} €
          </div>
        </div>
        <div class="fw-semibold">${lineTotal.toFixed(2)} €</div>
      </div>
    `;
  });

  totalElement.textContent = total.toFixed(2) + ' €';

  // klik na Zaključi nakup
  placeOrderBtn.addEventListener('click', () => {
    if (!validateCheckoutForm()) return;

    // demo "oddaja"
    localStorage.removeItem('cart_items');
    updateCartCount();
    window.location.href = 'zakljucek.html';
  });

  // ===== FORMATIRANJE ŠTEVILKE KARTICE =====
  cardNumberInput.addEventListener('input', () => {
    let value = cardNumberInput.value;

    // samo številke
    value = value.replace(/\D/g, '');

    // max 16
    value = value.substring(0, 16);

    // presledek na vsake 4
    value = value.replace(/(.{4})/g, '$1 ').trim();

    cardNumberInput.value = value;
  });

  // ===== FORMATIRANJE DATUMA KARTICE (MM/YY) =====
  cardExpiryInput.addEventListener('input', () => {
    let value = cardExpiryInput.value;

    // samo številke
    value = value.replace(/\D/g, '');

    // max 4 številke (MMYY)
    value = value.substring(0, 4);

    // vstavi /
    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    cardExpiryInput.value = value;
  });

  // ne dovoli več kot 5 znakov
  cardExpiryInput.addEventListener('keypress', (e) => {
    if (cardExpiryInput.value.length >= 5) {
      e.preventDefault();
    }
  });
});
