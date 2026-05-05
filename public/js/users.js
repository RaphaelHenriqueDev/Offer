document.addEventListener('DOMContentLoaded', () => {
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userStatusSpan = document.getElementById('user-name');
  const closeButtons = document.querySelectorAll('.close-button');

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');

  // Funções para abrir e fechar modais
  function openModal(modal) {
    modal.style.display = 'block';
  }

  function closeModal(modal) {
    modal.style.display = 'none';
    // Limpar mensagens de erro ao fechar
    if (modal === loginModal) loginMessage.textContent = '';
    if (modal === registerModal) registerMessage.textContent = '';
  }

  // Event Listeners para botões de abrir modal
  if (loginBtn) {
    loginBtn.addEventListener('click', () => openModal(loginModal));
  }
  if (registerBtn) {
    registerBtn.addEventListener('click', () => openModal(registerModal));
  }

  // Event Listeners para botões de fechar modal
  closeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const modal = event.target.closest('.modal');
      if (modal) closeModal(modal);
    });
  });

  // Fechar modal ao clicar fora
  window.addEventListener('click', (event) => {
    if (event.target === loginModal) closeModal(loginModal);
    if (event.target === registerModal) closeModal(registerModal);
  });

  // Função para atualizar o estado da UI (botões, nome do usuário)
  function updateUIForAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar o token para obter o nome do usuário (simplificado, em um app real, faria uma requisição ao backend)
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(base64));
        userStatusSpan.textContent = `Usuário ${decoded.id}`; // Ou buscar o nome real do usuário
      } catch (e) {
        userStatusSpan.textContent = 'Usuário';
      }
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
    } else {
      userStatusSpan.textContent = 'Convidado';
      loginBtn.style.display = 'block';
      registerBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
    }
  }

  // Lógica de Registro
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const phone = document.getElementById('register-phone').value;
      const password = document.getElementById('register-password').value;

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password }),
        });
        const data = await res.json();

        if (res.ok) {
          registerMessage.textContent = 'Registro realizado com sucesso! Faça login.';
          registerMessage.style.color = 'green';
          registerForm.reset();
          setTimeout(() => {
            closeModal(registerModal);
            openModal(loginModal);
          }, 2000);
        } else {
          registerMessage.textContent = data.message || 'Erro ao registrar.';
          registerMessage.style.color = 'red';
        }
      } catch (error) {
        registerMessage.textContent = 'Erro de conexão. Tente novamente.';
        registerMessage.style.color = 'red';
        console.error('Erro de registro:', error);
      }
    });
  }

  // Lógica de Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem('token', data.token);
          loginMessage.textContent = 'Login realizado com sucesso!';
          loginMessage.style.color = 'green';
          loginForm.reset();
          updateUIForAuth();
          setTimeout(() => closeModal(loginModal), 1500);
          // Recarregar o carrinho após o login
          if (typeof loadCart === 'function') {
            loadCart();
          }
        } else {
          loginMessage.textContent = data.message || 'Erro ao fazer login. Verifique suas credenciais.';
          loginMessage.style.color = 'red';
        }
      } catch (error) {
        loginMessage.textContent = 'Erro de conexão. Tente novamente.';
        loginMessage.style.color = 'red';
        console.error('Erro de login:', error);
      }
    });
  }

  // Lógica de Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      updateUIForAuth();
      // Limpar o carrinho no frontend após o logout
      if (typeof clearCartUI === 'function') {
        clearCartUI();
      }
      alert('Você foi desconectado.');
    });
  }

  // Inicializar o estado da UI ao carregar a página
  updateUIForAuth();
});