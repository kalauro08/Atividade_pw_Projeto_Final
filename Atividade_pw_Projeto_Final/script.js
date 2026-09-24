document.addEventListener("DOMContentLoaded", () => {
  const perfil = {
    nome: "Igor Gabriel Kalauro de Abreu",
    email: "igor.gabriel@email.com",
    telefone: "+55 (11) 99999-9999"
  };

  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const topButton = document.querySelector("#btnTopo");
  const progress = document.querySelector("#barraProgresso");
  const darkButton = document.querySelector("#btnDarkMode");
  const form = document.querySelector("#formContato");
  const cadastroForm = document.querySelector("#formCadastro");
  const cadastroModalElement = document.querySelector("#modalCadastroInicial");

  document.title = `${perfil.nome} | Desenvolvimento Web`;
  const brand = document.querySelector(".navbar-brand");
  if (brand) {
    brand.innerHTML = `<i class="bi bi-code-slash"></i> ${perfil.nome}`;
  }

  const setTheme = (enabled, save = true) => {
    body.classList.toggle("dark-mode", enabled);
    const icon = darkButton?.querySelector("i");
    icon?.classList.toggle("bi-moon-stars-fill", enabled);
    icon?.classList.toggle("bi-sun-fill", !enabled);
    if (save) localStorage.setItem("tema", enabled ? "dark" : "light");
  };

  const savedTheme = localStorage.getItem("tema");
  const systemPrefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme ? savedTheme === "dark" : systemPrefersDark, false);

  darkButton?.addEventListener("click", () => setTheme(!body.classList.contains("dark-mode")));

  const exibirPerguntaCadastro = async () => {
    if (!cadastroModalElement || sessionStorage.getItem("perguntaCadastroExibida") || localStorage.getItem("cadastroRealizado") === "true") return;
    try {
      const response = await fetch("/api/sessao");
      if (response.ok) {
        localStorage.setItem("cadastroRealizado", "true");
        return;
      }
    } catch {
      // A página pode estar sendo aberta sem o servidor local.
    }
    const cadastroModal = new bootstrap.Modal(cadastroModalElement);
    cadastroModal.show();
    sessionStorage.setItem("perguntaCadastroExibida", "true");
  };
  exibirPerguntaCadastro();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const updateScrollUI = () => {
    navbar?.classList.toggle("navbar-scroll", scrollY > 50);
    topButton?.classList.toggle("visivel", scrollY > 400);
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progress) progress.style.width = height ? `${(scrollY / height) * 100}%` : "0";
  };

  addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();
  topButton?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("active"); });
  }, { threshold: .15 }) : null;
  document.querySelectorAll(".reveal").forEach((item) => observer ? observer.observe(item) : item.classList.add("active"));

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    let valid = true;

    form.querySelectorAll("input, textarea").forEach((field) => {
      const value = field.value.trim();
      const minimum = field.tagName === "TEXTAREA" ? 10 : 3;
      const isEmailField = field.type === "email";
      const isPhoneField = field.type === "tel";
      const okay = isEmailField
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        : isPhoneField
          ? value.length === 0 || value.length >= 8
          : value.length >= minimum;

      field.classList.toggle("is-invalid", !okay);
      valid &&= okay;
    });

    const feedback = document.querySelector("#formFeedback");
    if (!valid) {
      feedback.className = "text-danger mt-3";
      feedback.textContent = "Revise os campos destacados antes de enviar.";
      return;
    }

    const nome = document.querySelector("#nome")?.value.trim() || "Não informado";
    const email = document.querySelector("#email")?.value.trim() || "Não informado";
    const telefone = document.querySelector("#telefone")?.value.trim() || "Não informado";
    const assunto = document.querySelector("#assunto")?.value.trim() || "Sem assunto";
    const mensagem = document.querySelector("#mensagem")?.value.trim() || "";

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Salvando...";

    try {
      const response = await fetch("/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, assunto, mensagem })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.erro || "Não foi possível salvar o contato.");

      feedback.className = "text-success mt-3";
      feedback.textContent = "Mensagem recebida! Em breve entrarei em contato.";
      form.reset();
    } catch (error) {
      feedback.className = "text-danger mt-3";
      feedback.textContent = error.message || "Não foi possível enviar agora. Tente novamente.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar mensagem";
    }
  });

  cadastroForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nome = document.querySelector("#nomeCadastro");
    const email = document.querySelector("#emailCadastro");
    const senha = document.querySelector("#senhaCadastro");
    const consentimento = document.querySelector("#consentimentoCadastro");
    const feedback = document.querySelector("#cadastroFeedback");
    const valid = nome.value.trim().length >= 3 && email.validity.valid && senha.value.length >= 8 && consentimento.checked;

    [nome, email, senha, consentimento].forEach((field) => field.classList.toggle("is-invalid", !field.checkValidity()));
    if (!valid) {
      feedback.className = "text-danger mt-3 mb-0";
      feedback.textContent = "Revise os dados e confirme o aviso de privacidade.";
      return;
    }

    const submitButton = cadastroForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Criando...';
    try {
      const response = await fetch("/api/cadastros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.value.trim(), email: email.value.trim(), senha: senha.value, marketing: document.querySelector("#consentimentoMarketing").checked })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.erro || "Não foi possível concluir o cadastro.");
      feedback.className = "text-success mt-3 mb-0";
      feedback.textContent = "Cadastro criado com sucesso. Seus dados foram registrados com segurança.";
      cadastroForm.reset();
    } catch (error) {
      feedback.className = "text-danger mt-3 mb-0";
      feedback.textContent = error.message || "Não foi possível cadastrar agora. Tente novamente.";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="bi bi-person-plus" aria-hidden="true"></i> Criar cadastro';
    }
  });
});
