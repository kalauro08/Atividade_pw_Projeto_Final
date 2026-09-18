// Igor Gabriel Kalauro de Abreu

const inputProduto = document.querySelector("#produto");
const btnProduto = document.querySelector("#btnAdicionarProduto");
const listaProdutos = document.querySelector("#listaProdutos");
const contadorProdutos = document.querySelector("#contadorProdutos");

let produtos = [];

btnProduto.addEventListener("click", function () {

    let nome = inputProduto.value;

    if (nome == "") {
        alert("Digite um produto!");
    } else {

        produtos.push(nome);

        inputProduto.value = "";

        atualizarProdutos();
    }
});

function atualizarProdutos() {

    listaProdutos.innerHTML = "";

    for (let i = 0; i < produtos.length; i++) {

        let li = document.createElement("li");

        li.textContent = produtos[i];

        let btn = document.createElement("button");

        btn.textContent = "Remover";

        btn.classList.add("remover");

        btn.addEventListener("click", function () {

            produtos.splice(i, 1);

            atualizarProdutos();
        });

        li.appendChild(btn);

        listaProdutos.appendChild(li);
    }

    contadorProdutos.textContent =
        "Total de produtos: " + produtos.length;
}