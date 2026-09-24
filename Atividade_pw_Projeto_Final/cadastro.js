document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  const cadastroForm = document.querySelector("#formCadastroPagina");
  const loginForm = document.querySelector("#formLogin");
  const recuperacaoForm = document.querySelector("#formRecuperacao");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.dataset.panel;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.id === panelId;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    });
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#emailLogin");
    const senha = document.querySelector("#senhaLogin");
    const feedback = document.querySelector("#feedbackLogin");
    if (!email.checkValidity() || !senha.value) {
      feedback.className = "feedback error";
      feedback.textContent = "Informe seu e-mail e sua senha.";
      return;
    }

    const button = loginForm.querySelector("button");
    button.disabled = true;
    button.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Entrando...';
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value.trim(), senha: senha.value })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.erro || "Não foi possível entrar.");
      feedback.className = "feedback success";
      feedback.textContent = `Olá, ${result.usuario.nome}! Login realizado com sucesso.`;
      loginForm.reset();
      window.location.href = "index.html";
    } catch (error) {
      feedback.className = "feedback error";
      feedback.textContent = error.message || "Não foi possível entrar.";
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-box-arrow-in-right" aria-hidden="true"></i> Entrar';
    }
  });

  cadastroForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nome = document.querySelector("#nomeCadastroPagina");
    const email = document.querySelector("#emailCadastroPagina");
    const senha = document.querySelector("#senhaCadastroPagina");
    const consentimento = document.querySelector("#consentimentoPagina");
    const feedback = document.querySelector("#feedbackCadastroPagina");

    if (!nome.checkValidity() || !email.checkValidity() || !senha.checkValidity() || !consentimento.checked) {
      feedback.className = "feedback error";
      feedback.textContent = "Preencha os campos e confirme o aviso de privacidade.";
      return;
    }

    const button = cadastroForm.querySelector("button");
    button.disabled = true;
    button.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Criando...';
    try {
      const response = await fetch("/api/cadastros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.value.trim(),
          email: email.value.trim(),
          senha: senha.value,
          marketing: document.querySelector("#marketingPagina").checked
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.erro || "Não foi possível concluir o cadastro.");
      feedback.className = "feedback success";
      feedback.textContent = "Cadastro criado com sucesso.";
      localStorage.setItem("cadastroRealizado", "true");
      cadastroForm.reset();
    } catch (error) {
      feedback.className = "feedback error";
      feedback.textContent = error.message || "Não foi possível concluir o cadastro.";
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-person-plus" aria-hidden="true"></i> Criar cadastro';
    }
  });

  recuperacaoForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#emailRecuperacao");
    const feedback = document.querySelector("#feedbackRecuperacao");
    if (!email.checkValidity()) {
      feedback.className = "feedback error";
      feedback.textContent = "Informe um e-mail válido.";
      return;
    }

    const button = recuperacaoForm.querySelector("button");
    button.disabled = true;
    button.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Enviando...';
    try {
      const response = await fetch("/api/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value.trim() })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.erro || "Não foi possível registrar o pedido.");
      feedback.className = "feedback success";
      feedback.textContent = result.mensagem;
      recuperacaoForm.reset();
    } catch (error) {
      feedback.className = "feedback error";
      feedback.textContent = error.message || "Não foi possível registrar o pedido.";
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-envelope" aria-hidden="true"></i> Solicitar recuperação';
    }
  });
});
