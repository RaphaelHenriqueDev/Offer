const NUM_COLS = 4
const REPEAT = 8
const grid = document.getElementById('grid')

const cols = Array.from({ length: NUM_COLS }, () => {
  const el = document.createElement('div')
  el.className = 'col'
  grid.appendChild(el)
  return el
})

function cardHTML(product) {
  return `
    <div class="card">
      <img
        src="${product.imageUrl}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.src='https://placehold.co/400x300/EA1D2C/fff?text=🍔'"
      />
      <div class="card-body">
        <div class="card-title">${product.name}</div>
        <div class="card-desc">${product.description}</div>
        <div class="card-price">R$ ${Number(product.price).toFixed(2).replace('.', ',')}</div>
        <div class="card-actions">
          <button class="btn-cart" onclick="addToCart(${product.id})">
            + Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>`
}

async function loadProducts() {
  try {
    const res = await fetch('/api/products')
    const products = await res.json()

    if (!products.length) {
      grid.innerHTML =
        '<div class="empty-state">Nenhum produto cadastrado ainda 🍽️</div>'
      return
    }

    // Repete os produtos para o scroll infinito nunca acabar
    const remainder = products.length % NUM_COLS
    const padded =
      remainder === 0
        ? products
        : [...products, ...products.slice(0, NUM_COLS - remainder)]

    const bigList = Array.from({ length: REPEAT }, () => padded).flat()
    bigList.forEach((product, i) => {
      cols[i % NUM_COLS].insertAdjacentHTML('beforeend', cardHTML(product))
    })
  } catch (err) {
    grid.innerHTML =
      '<div class="empty-state">Erro ao carregar produtos 😕</div>'
    console.error(err)
  }
}

// Função global para adicionar ao carrinho
window.addToCart = async (productId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado para adicionar itens ao carrinho.');
    // Abrir modal de login se existir
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
      loginModal.style.display = 'block';
    }
    return;
  }

  try {
    const res = await fetch('/api/cart/item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Incluir o token JWT
      },
      body: JSON.stringify({ productId, quantity: 1 }), // userId será extraído do token no backend
    });

    if (res.ok) {
      alert('Produto adicionado ao carrinho! 🛒');
      // Chamar a função para recarregar o carrinho (definida em cart.js)
      if (typeof loadCart === 'function') {
        loadCart();
      }
    } else {
      const errorData = await res.json();
      alert(`Erro ao adicionar ao carrinho: ${errorData.message || 'Erro desconhecido'}`);
    }
  } catch (err) {
    alert('Erro de conexão ao adicionar ao carrinho 😕');
    console.error(err);
  }
};

loadProducts()