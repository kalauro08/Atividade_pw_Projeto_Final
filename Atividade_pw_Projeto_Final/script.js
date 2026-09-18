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

  form?.addEventListener("submit", (event) => {
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

    const corpo = [
      "Olá,",
      "",
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Telefone: ${telefone}`,
      "",
      "Mensagem:",
      mensagem,
      "",
      "Atenciosamente,",
      nome
    ].join("\n");

    const mailtoLink = `mailto:${perfil.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

    feedback.className = "text-success mt-3";
    feedback.textContent = "Abrindo seu e-mail para enviar a mensagem...";
    window.location.href = mailtoLink;
    form.reset();
  });
});
