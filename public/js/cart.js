document.addEventListener('DOMContentLoaded', () => {
  const cartModal = document.getElementById('cart-modal')
  const cartIcon = document.getElementById('cart-icon')
  const cartItemsContainer = document.getElementById('cart-items')
  const cartTotalSpan = document.getElementById('cart-total')
  const cartCountSpan = document.getElementById('cart-count')
  const clearCartBtn = document.getElementById('clear-cart-btn')
  const checkoutBtn = document.getElementById('checkout-btn')
  const closeButtons = document.querySelectorAll('.close-button') // Já existe em users.js, mas para garantir

  // Funções para abrir e fechar o modal do carrinho
  function openCartModal() {
    cartModal.style.display = 'block'
    loadCart() // Carrega o carrinho sempre que o modal é aberto
  }

  function closeCartModal() {
    cartModal.style.display = 'none'
  }

  // Event Listener para o ícone do carrinho
  if (cartIcon) {
    cartIcon.addEventListener('click', openCartModal)
  }

  // Event Listeners para botões de fechar modal (garantir que o do carrinho também funcione)
  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const modal = event.target.closest('.modal')
      if (modal && modal.id === 'cart-modal') closeCartModal()
    })
  })

  // Fechar modal ao clicar fora
  window.addEventListener('click', (event) => {
    if (event.target === cartModal) closeCartModal()
  })

  // Função para obter o token JWT
  function getToken() {
    return localStorage.getItem('token')
  }

  // Função para carregar e exibir o carrinho
  window.loadCart = async () => {
    const token = getToken()
    if (!token) {
      cartItemsContainer.innerHTML = '<p>Faça login para ver seu carrinho.</p>'
      cartTotalSpan.textContent = '0.00'
      cartCountSpan.textContent = '0'
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const cart = await res.json()

      if (res.ok && cart && cart.CartItems) {
        displayCart(cart.CartItems)
      } else {
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>'
        cartTotalSpan.textContent = '0.00'
        cartCountSpan.textContent = '0'
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
      cartItemsContainer.innerHTML = '<p>Erro ao carregar carrinho.</p>'
      cartTotalSpan.textContent = '0.00'
      cartCountSpan.textContent = '0'
    }
  }

  // Função para exibir os itens do carrinho na UI
  function displayCart(cartItems) {
    cartItemsContainer.innerHTML = ''
    let total = 0
    let itemCount = 0

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>'
    } else {
      cartItems.forEach((item) => {
        const itemTotal = item.quantity * item.Product.price
        total += itemTotal
        itemCount += item.quantity

        const itemDiv = document.createElement('div')
        itemDiv.className = 'cart-item'
        itemDiv.innerHTML = `
          <img src="${item.Product.imageUrl}" alt="${item.Product.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.Product.name}</div>
            <div class="cart-item-price">R$ ${Number(item.Product.price).toFixed(2).replace('.', ',')}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">Remover</button>
          </div>
        `
        cartItemsContainer.appendChild(itemDiv)
      })
    }

    cartTotalSpan.textContent = total.toFixed(2).replace('.', ',')
    cartCountSpan.textContent = itemCount

    // Adicionar event listeners para botões de quantidade e remover
    cartItemsContainer.querySelectorAll('.quantity-btn').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const itemId = event.target.dataset.id
        const action = event.target.dataset.action
        const quantitySpan = event.target.closest('.cart-item-quantity').querySelector('span');
        let currentQuantity = parseInt(quantitySpan.textContent);

        if (action === 'increase') {
          currentQuantity++;
        } else if (action === 'decrease' && currentQuantity > 1) {
          currentQuantity--;
        } else if (action === 'decrease' && currentQuantity === 1) {
          // Se a quantidade for 1 e diminuir, remover o item
          await removeItemFromCart(itemId);
          return;
        }
        quantitySpan.textContent = currentQuantity; // Update UI immediately
        await updateCartItemQuantity(itemId, currentQuantity);
      })
    })

    cartItemsContainer
      .querySelectorAll('.remove-item-btn')
      .forEach((button) => {
        button.addEventListener('click', async (event) => {
          const itemId = event.target.dataset.id
          await removeItemFromCart(itemId)
        })
      })
  }

  // Função para atualizar a quantidade de um item no carrinho
  async function updateCartItemQuantity(itemId, quantity) {
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`/api/cart/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      if (res.ok) {
        loadCart() // Recarrega o carrinho para atualizar a UI
      } else {
        const errorData = await res.json()
        alert(
          `Erro ao atualizar quantidade: ${errorData.message || 'Erro desconhecido'}`,
        )
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade do item:', error)
      alert('Erro de conexão ao atualizar quantidade.')
    }
  }

  // Função para remover um item do carrinho
  async function removeItemFromCart(itemId) {
    const token = getToken()
    if (!token) return

    if (!confirm('Tem certeza que deseja remover este item do carrinho?')) {
      return
    }

    try {
      const res = await fetch(`/api/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        alert('Item removido do carrinho.')
        loadCart() // Recarrega o carrinho para atualizar a UI
      } else {
        const errorData = await res.json()
        alert(
          `Erro ao remover item: ${errorData.message || 'Erro desconhecido'}`,
        )
      }
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error)
      alert('Erro de conexão ao remover item.')
    }
  }

  // Função para limpar o carrinho
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', async () => {
      const token = getToken()
      if (!token) return

      if (!confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        return
      }

      try {
        const res = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          alert('Carrinho limpo com sucesso!')
          loadCart() // Recarrega o carrinho para atualizar a UI
        } else {
          const errorData = await res.json()
          alert(
            `Erro ao limpar carrinho: ${errorData.message || 'Erro desconhecido'}`,
          )
        }
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error)
        alert('Erro de conexão ao limpar carrinho.')
      }
    })
  }

  // Função para limpar a UI do carrinho (chamada no logout)
  window.clearCartUI = () => {
    cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>'
    cartTotalSpan.textContent = '0.00'
    cartCountSpan.textContent = '0'
  }

  // Carregar o carrinho ao iniciar a página se o usuário já estiver logado
  loadCart()
})
