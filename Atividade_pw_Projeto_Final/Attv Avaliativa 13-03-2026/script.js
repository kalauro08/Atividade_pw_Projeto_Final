/* Igor Gabriel Kalauro de Abreu */

// ---- FUNÇÃO 1: Saudação ao carregar a página ----
window.onload = function() {
    exibirSaudacao();
    configurarFormulario();
    configurarDestaque();
};

function exibirSaudacao() {
    const hora = new Date().getHours()
    let saudacao = "";
    if (hora >= 6 && hora < 12) {
        saudacao = "Bom dia!";
    } else if (hora >= 12 && hora < 18) {
        saudacao = "Boa tarde!";
    } else {
        saudacao = "Boa noite!";
    }

    const cabecalho = document.querySelector("header p")
    cabecalho.textContent = saudacao + " Seja bem-vindo ao meu portfólio!";
}


// ---- FUNÇÃO 2: Validação do formulário ----
function configurarFormulario() {
    const formulario = document.querySelector("form");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (nome === "" || email === "" || mensagem === "") {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        if (!email.includes("@")) {
            alert("Por favor, insira um e-mail válido!");
            return;
        }

        alert("Mensagem enviada com sucesso! Obrigado, " + nome + ".");
        formulario.reset()
    });
}


// ---- FUNÇÃO 3: Destaque de habilidades na tabela ----
function configurarDestaque() {
    const linhas = document.querySelectorAll("table tr");

    linhas.forEach(function (linha, indice) {
        if (indice === 0) return;

        const nivel = linha.querySelector("td:last-child")

        if (nivel) {
            const texto = nivel.textContent.toLowerCase();

            if (texto === "intermediário") {
                linha.style.backgroundColor = "#d4edda";
            } else if (texto === "básico") {
                linha.style.backgroundColor = "#fff3cd"
            } else if (texto === "iniciante") {
                linha.style.backgroundColor = "#f8d7da";
            }
        }
    });
}


// ---- FUNÇÃO 4: Rolagem suave para âncoras ----
const links = document.querySelectorAll('nav a[href^="#"]');

links.forEach(function (link) {
    link.addEventListener("click", function (evento){
    {
        evento.preventDefault();

        const alvo = document.querySelector(this.getAttribute("href"))

        if (alvo) {
            alvo.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }
});
});