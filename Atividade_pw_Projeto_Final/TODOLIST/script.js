let botao = document.querySelector("#adicionar");

let input = document.querySelector("#tarefa");

let lista = document.querySelector("#lista");

let contador = document.querySelector("#contador");

let total = 0;

botao.addEventListener("click", function () {
    let texto = input.value;

    if (texto == "") {

        alert("Informe uma tarefa!");

        return;
    }

    let item = document.createElement("li");

    item.innerHTML = `
<span>${texto}</span>
<div>
    <button class="concluir">Ok</button>
    <button class="remover">X</button>
</div>
`;

    lista.appendChild(item);

    total++;

    contador.innerHTML = "Total de Tarefas: " + total;

    input.value = "";

    let btnConcluir = item.querySelector(".concluir");

    btnConcluir.addEventListener("click", function () {

        item.classList.toggle("concluida");

    });

    let btnRemover = item.querySelector(".remover");

    btnRemover.addEventListener("click", function () {

        item.remove();

        total--;

        contador.innerHTML = "Total de tarefas: " + total;
    });
});