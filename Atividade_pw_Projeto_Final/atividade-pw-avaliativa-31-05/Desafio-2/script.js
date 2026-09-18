// Igor Gabriel Kalauro de Abreu

const inputAluno = document.querySelector("#nomeAluno");
const btnAluno = document.querySelector("#btnAdicionarAluno");
const listaAlunos = document.querySelector("#listaAlunos");

const total = document.querySelector("#total");
const presentes = document.querySelector("#presentes");
const ausentes = document.querySelector("#ausentes");

let alunos = [];

btnAluno.addEventListener("click", function () {

    let nome = inputAluno.value;

    if (nome == "") {
        alert("Digite um nome!");
    } else {

        alunos.push({
            nome: nome,
            presente: false
        });

        inputAluno.value = "";

        atualizarAlunos();
    }
});

function atualizarAlunos() {

    listaAlunos.innerHTML = "";

    let contPresentes = 0;

    for (let i = 0; i < alunos.length; i++) {

        let li = document.createElement("li");

        if (alunos[i].presente == true) {

            li.textContent = "✔ " + alunos[i].nome;

            li.classList.add("presente");

            contPresentes++;

        } else {

            li.textContent = "✖ " + alunos[i].nome;
        }

        li.addEventListener("click", function () {

            if (alunos[i].presente == true) {
                alunos[i].presente = false;
            } else {
                alunos[i].presente = true;
            }

            atualizarAlunos();
        });

        listaAlunos.appendChild(li);
    }

    total.textContent =
        "Total de alunos: " + alunos.length;

    presentes.textContent =
        "Presentes: " + contPresentes;

    ausentes.textContent =
        "Ausentes: " + (alunos.length - contPresentes);
}