//Igor Gabriel Kalauro de Abreu
document.addEventListener("DOMContentLoaded", () => {
iniciarRecursosLocais();
const loader = document.getElementById("loader");

if (loader) {
    setTimeout(() => loader.classList.add("loader-hide"), 900);
}

iniciarNavbar();
iniciarScrollSuave();
destacarMenu();
iniciarContador();
iniciarDarkMode();
controlarBotaoTopo();
iniciarFormularios();
iniciarReveal();
});

function iniciarRecursosLocais() {
const imagens = {
    "photo-1500648767791-00dcc994a43e": "assets/images/cliente-joao.jpg",
    "photo-1494790108377-be9c29b29330": "assets/images/cliente-maria.jpg",
    "photo-1506794778202-cad84cf45f1d": "assets/images/cliente-carlos.jpg"
};

document.querySelectorAll('img[src*="images.unsplash.com"]').forEach((imagem) => {
    const arquivo = Object.entries(imagens).find(([chave]) => imagem.src.includes(chave));
    if (arquivo) imagem.src = arquivo[1];
});

}

function iniciarNavbar() {
const navbar = document.querySelector(".navbar");
if (!navbar) return;

window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
    navbar.classList.add("navbar-scroll");
    } else {
    navbar.classList.remove("navbar-scroll");
    }
});
}

function iniciarScrollSuave() {
const links = document.querySelectorAll('a[href^="#"]');

links.forEach((link) => {
    link.addEventListener("click", (event) => {
    const seletor = link.getAttribute("href");
    if (!seletor || seletor === "#") return;

    let destino;
    try {
        destino = document.querySelector(seletor);
    } catch {
        return;
    }

    if (!destino) return;

    event.preventDefault();
    destino.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
}

function destacarMenu() {
const secoes = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".navbar .nav-link");

const verificar = () => {
    let atual = "inicio";

    secoes.forEach((secao) => {
    const topo = secao.offsetTop - 140;
    const altura = secao.clientHeight;

    if (window.scrollY >= topo && window.scrollY < topo + altura) {
        atual = secao.getAttribute("id");
    }
    });

    links.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${atual}`);
    });
};

verificar();
window.addEventListener("scroll", verificar);
}

function iniciarContador() {
const contadores = document.querySelectorAll(".counter");

contadores.forEach((contador) => {
    const alvo = Number(contador.dataset.target || 0);
    let valor = 0;
    const incremento = Math.ceil(alvo / 70);

    const atualizar = () => {
if (valor < alvo) {
        valor += incremento;
        contador.textContent = Math.min(valor, alvo);
        requestAnimationFrame(atualizar);
    } else {
        contador.textContent = alvo;
    }
    };

    atualizar();
});
}

function iniciarDarkMode() {
const body = document.body;
const botao = document.getElementById("btnDarkMode");
const temaSalvo = localStorage.getItem("theme");

if (temaSalvo === "dark") {
    body.classList.add("dark-mode");
}

if (botao) {
    const atualizarIcone = () => {
    botao.innerHTML = body.classList.contains("dark-mode")
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
        : '<i class="fa-regular fa-moon" aria-hidden="true"></i>';
    };

    atualizarIcone();

    botao.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const darkAtivo = body.classList.contains("dark-mode");
    localStorage.setItem("theme", darkAtivo ? "dark" : "light");
    atualizarIcone();
    });
}
}

function controlarBotaoTopo() {
const botaoTopo = document.getElementById("btnTopo");
if (!botaoTopo) return;

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
    botaoTopo.style.opacity = "1";
    botaoTopo.style.visibility = "visible";
    botaoTopo.style.transform = "translateY(0)";
    } else {
    botaoTopo.style.opacity = "0";
    botaoTopo.style.visibility = "hidden";
    botaoTopo.style.transform = "translateY(30px)";
    }
});

botaoTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
}

function iniciarFormularios() {
const toast = document.getElementById("toast");
const formularios = document.querySelectorAll("#formContato, #formNewsletter");

formularios.forEach((form) => {
    form.addEventListener("submit", (event) => {
        if (!form.action.includes("SEU_EMAIL_AQUI")) return;

        event.preventDefault();
        if (!toast) return;

        toast.textContent = "Configure o e-mail de destino do formulário antes de enviar.";
        toast.classList.add("mostrar", "erro");

        setTimeout(() => toast.classList.remove("mostrar"), 3500);
    });
});
}

function iniciarReveal() {
const elementos = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .zoom");
const ativar = (elemento) => {
    elemento.classList.add("active");

    if (elemento.classList.contains("reveal-left")) {
        elemento.classList.add("active-left");
    }

    if (elemento.classList.contains("reveal-right")) {
        elemento.classList.add("active-right");
    }

    if (elemento.classList.contains("zoom")) {
        elemento.classList.add("zoom-active");
    }
};

if (!("IntersectionObserver" in window)) {
    elementos.forEach(ativar);
    return;
}

const observer = new IntersectionObserver(
    (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
        ativar(entry.target);
        observer.unobserve(entry.target);
        }
    });
    },
    { threshold: 0.15 }
);

elementos.forEach((elemento) => observer.observe(elemento));
}

const tituloOriginal = document.title;

document.addEventListener("visibilitychange", () => {
if (document.hidden) {
    document.title = "👋 Volte! Ainda temos novidades.";
} else {
    document.title = tituloOriginal;
}
});

console.log("DESENVOLVIMENTO WEB - Template carregado com sucesso!");
