/* Igor Gabriel Kalauro de Abreu */
function calcularAreaRetangulo() {
    const base = parseFloat(document.getElementById('baseRetangulo').value);
    const altura = parseFloat(document.getElementById('alturaRetangulo').value);
    const erro = document.getElementById("erroRetangulo");
    const resultado = document.getElementById('resultadoAreaRetangulo');

    if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
        erro.style.display = "block";
        erro.textContent = "Base e altura devem ser maiores que zero!";
        resultado.textContent = "";
        return;
    }

    erro.style.display = "none";

    const area = base * altura;
    resultado.textContent = area.toFixed(2);

    localStorage.setItem("ultimoResultado", area.toFixed(2));
    localStorage.setItem("tipoResultado", "retangulo");
}

function animateResult(element) {
    if (!element) return;

    element.classList.remove('result-animate', 'result-glow');
    void element.offsetWidth;
    element.classList.add('result-animate', 'result-glow');

    setTimeout(() => {
        element.classList.remove('result-glow');
    }, 900);
}

function calcularHipotenusa() {
    const a = parseFloat(document.getElementById('catetoA').value);
    const b = parseFloat(document.getElementById('catetoB').value);
    const erro = document.getElementById("erroHipotenusa");
    const resultado = document.getElementById('resultadoHipotenusa');

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        erro.style.display = "block";
        erro.textContent = "Valores inválidos!";
        resultado.textContent = "";
        return;
    }

    erro.style.display = "none";

    const h = Math.sqrt(a * a + b * b);
    resultado.textContent = h.toFixed(2);

    localStorage.setItem("ultimoResultado", h.toFixed(2));
    localStorage.setItem("tipoResultado", "hipotenusa");
}

function calcularAreaCirculo() {
    const raio = parseFloat(document.getElementById('raioCirculo').value);
    const erro = document.getElementById("erroCirculo");
    const resultado = document.getElementById('resultadoCirculo');

    if (isNaN(raio) || raio <= 0) {
        erro.style.display = "block";
        erro.textContent = "Raio inválido!";
        resultado.textContent = "";
        return;
    }

    erro.style.display = "none";

    const area = Math.PI * raio * raio;
    resultado.textContent = area.toFixed(2);

    localStorage.setItem("ultimoResultado", area.toFixed(2));
    localStorage.setItem("tipoResultado", "circulo");
}

document.addEventListener('DOMContentLoaded', function () {

    const btnAreaRetangulo = document.getElementById('btnAreaRetangulo');
    btnAreaRetangulo.addEventListener('click', function () {
        calcularAreaRetangulo();
        animateResult(document.getElementById('resultadoAreaRetangulo'));
    });

    const btnHipotenusa = document.getElementById('btnCalcularHipotenusa');
    btnHipotenusa.addEventListener('click', function () {
        calcularHipotenusa();
        animateResult(document.getElementById('resultadoHipotenusa'));
    });

    const btnCirculo = document.getElementById('btnCirculo');
    btnCirculo.addEventListener('click', function () {
        calcularAreaCirculo();
        animateResult(document.getElementById('resultadoCirculo'));
    });

    document.getElementById('btnLimparTudo').addEventListener('click', function () {
        document.querySelectorAll('input').forEach(i => i.value = '');
        document.querySelectorAll('span').forEach(s => s.textContent = '');
        document.querySelectorAll('.erro').forEach(e => e.style.display = "none");
    });

    document.getElementById('btnUltimoResultado').addEventListener('click', function () {

        const valor = localStorage.getItem("ultimoResultado");
        const tipo = localStorage.getItem("tipoResultado");

        if (!valor || !tipo) {
            alert("Nenhum resultado salvo ainda!");
            return;
        }

        if (tipo === "retangulo") {
            document.getElementById('resultadoAreaRetangulo').textContent = valor;
        } else if (tipo === "hipotenusa") {
            document.getElementById('resultadoHipotenusa').textContent = valor;
        } else if (tipo === "circulo") {
            document.getElementById('resultadoCirculo').textContent = valor;
        }
    });

});