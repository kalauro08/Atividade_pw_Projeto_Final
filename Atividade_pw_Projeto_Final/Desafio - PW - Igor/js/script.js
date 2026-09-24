// Igor Gabriel Kalauro de Abreu
let produtos = [];

// Guarda se estamos editando (id do produto) ou cadastrando (null)
let editandoId = null;

// Guarda o id do produto que está pendente de exclusão, usado pelo modal
let idParaExcluir = null;

// Referências aos elementos usados várias vezes
const form = document.querySelector('#formProduto');
const tabela = document.querySelector('#tabelaProdutos');
const alertaContainer = document.querySelector('#alertaContainer');
const btnCadastrar = document.querySelector('#btnCadastrar');
const btnLimpar = document.querySelector('#btnLimpar');
const inputPesquisa = document.querySelector('#pesquisa');
const selectOrdenar = document.querySelector('#ordenar');
const btnModoEscuro = document.querySelector('#btnModoEscuro');

// Carrega os produtos salvos assim que a página abre
carregarProdutos();
renderizarTabela();
carregarModoEscuro();

// ---- Eventos principais ----

form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  salvarProduto();
});

btnLimpar.addEventListener('click', limparFormulario);

inputPesquisa.addEventListener('input', renderizarTabela);
selectOrdenar.addEventListener('change', renderizarTabela);

btnModoEscuro.addEventListener('click', alternarModoEscuro);

document.querySelector('#btnConfirmarExclusao').addEventListener('click', function () {
  excluirProduto(idParaExcluir);
  const modal = bootstrap.Modal.getInstance(document.querySelector('#modalExcluir'));
  modal.hide();
});

// ---- Funções de dados (localStorage) ----

function carregarProdutos() {
  const dados = localStorage.getItem('produtos');
  produtos = dados ? JSON.parse(dados) : [];
}

function salvarNoLocalStorage() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// ---- Cadastro / Edição ----

function salvarProduto() {
  const nome = document.querySelector('#nome').value.trim();
  const categoria = document.querySelector('#categoria').value.trim();
  const preco = parseFloat(document.querySelector('#preco').value);
  const quantidade = parseInt(document.querySelector('#quantidade').value);

  const erro = validarProduto(nome, categoria, preco, quantidade);
  if (erro) {
    mostrarAlerta(erro);
    return;
  }

  if (editandoId) {
    // Atualiza o produto existente
    const produto = produtos.find(p => p.id === editandoId);
    produto.nome = nome;
    produto.categoria = categoria;
    produto.preco = preco;
    produto.quantidade = quantidade;
  } else {
    // Cria um novo produto
    produtos.push({
      id: Date.now(), // id simples e único baseado no horário
      nome,
      categoria,
      preco,
      quantidade
    });
  }

  salvarNoLocalStorage();
  renderizarTabela();
  limparFormulario();
}

function validarProduto(nome, categoria, preco, quantidade) {
  if (!nome || !categoria || isNaN(preco) || isNaN(quantidade)) {
    return 'Todos os campos são obrigatórios.';
  }
  if (preco <= 0) {
    return 'O preço deve ser maior que zero.';
  }
  if (quantidade < 0) {
    return 'A quantidade não pode ser negativa.';
  }
  return null;
}

function limparFormulario() {
  form.reset();
  document.querySelector('#produtoId').value = '';
  editandoId = null;
  btnCadastrar.textContent = 'Cadastrar';
  alertaContainer.innerHTML = '';
}

// ---- Edição ----

function editarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  document.querySelector('#produtoId').value = produto.id;
  document.querySelector('#nome').value = produto.nome;
  document.querySelector('#categoria').value = produto.categoria;
  document.querySelector('#preco').value = produto.preco;
  document.querySelector('#quantidade').value = produto.quantidade;

  editandoId = produto.id;
  btnCadastrar.textContent = 'Salvar Alterações';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Exclusão ----

function pedirConfirmacaoExclusao(id) {
  idParaExcluir = id;
  const modal = new bootstrap.Modal(document.querySelector('#modalExcluir'));
  modal.show();
}

function excluirProduto(id) {
  produtos = produtos.filter(p => p.id !== id);
  salvarNoLocalStorage();
  renderizarTabela();
}

// ---- Renderização da tabela (com pesquisa e ordenação aplicadas) ----

function renderizarTabela() {
  let listaExibida = [...produtos];

  const termoPesquisa = inputPesquisa.value.toLowerCase();
  if (termoPesquisa) {
    listaExibida = listaExibida.filter(p => p.nome.toLowerCase().includes(termoPesquisa));
  }

  const ordenacao = selectOrdenar.value;
  if (ordenacao === 'crescente') {
    listaExibida.sort((a, b) => a.preco - b.preco);
  } else if (ordenacao === 'decrescente') {
    listaExibida.sort((a, b) => b.preco - a.preco);
  }

  tabela.innerHTML = '';

  if (listaExibida.length === 0) {
    tabela.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum produto encontrado.</td></tr>';
    return;
  }

  listaExibida.forEach(produto => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>R$ ${produto.preco.toFixed(2)}</td>
      <td>${produto.quantidade}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarProduto(${produto.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="pedirConfirmacaoExclusao(${produto.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// ---- Alertas ----

function mostrarAlerta(mensagem) {
  alertaContainer.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

// ---- Modo escuro ----

function alternarModoEscuro() {
  document.body.classList.toggle('dark-mode');
  const ativado = document.body.classList.contains('dark-mode');
  localStorage.setItem('modoEscuro', ativado ? 'sim' : 'nao');
}

function carregarModoEscuro() {
  const ativado = localStorage.getItem('modoEscuro') === 'sim';
  if (ativado) {
    document.body.classList.add('dark-mode');
  }
}
