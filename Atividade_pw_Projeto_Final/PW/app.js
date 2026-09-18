const formAluno = document.querySelector("#formAluno");
const listaAlunos = document.querySelector("#listaAlunos");
const mensagemForm = document.querySelector("#mensagemForm");
const alunosSalvos = JSON.parse(localStorage.getItem("pw-alunos") || "[]");

function situacaoDaMedia(media) {
  if (media >= 7) return { nome: "Aprovado", classe: "approved" };
  if (media >= 5) return { nome: "Recuperação", classe: "recovery" };
  return { nome: "Reprovado", classe: "failed" };
}

function atualizarPainel() {
  const total = alunosSalvos.length;
  const aprovados = alunosSalvos.filter((aluno) => aluno.situacao === "Aprovado").length;
  const media = total ? alunosSalvos.reduce((soma, aluno) => soma + aluno.media, 0) / total : 0;

  document.querySelector("#totalAlunos").textContent = total;
  document.querySelector("#totalAprovados").textContent = aprovados;
  document.querySelector("#mediaTurma").textContent = media.toFixed(1).replace(".", ",");
  listaAlunos.innerHTML = total ? "" : '<li class="empty-list">Nenhum aluno cadastrado ainda.</li>';

  alunosSalvos.forEach((aluno) => {
    const item = document.createElement("li");
    item.innerHTML = `<div class="student-info"><strong>${aluno.nome}</strong><span>${aluno.curso} · ${aluno.turma}</span></div><div class="student-result ${aluno.classe}"><strong>${aluno.media.toFixed(1)}</strong><span>${aluno.situacao}</span></div><button class="remove-student" type="button" data-id="${aluno.id}" aria-label="Remover ${aluno.nome}">×</button>`;
    listaAlunos.appendChild(item);
  });
  localStorage.setItem("pw-alunos", JSON.stringify(alunosSalvos));
}

formAluno.addEventListener("submit", function (event) {
  event.preventDefault();
  const notas = [...document.querySelectorAll(".nota")].map((input) => Number(input.value));
  const media = notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
  const situacao = situacaoDaMedia(media);
  const aluno = {
    id: Date.now(),
    nome: document.querySelector("#nomeAluno").value.trim(),
    email: document.querySelector("#emailAluno").value.trim(),
    curso: document.querySelector("#cursoAluno").value.trim(),
    turma: document.querySelector("#turmaAluno").value.trim(),
    media,
    situacao: situacao.nome,
    classe: situacao.classe
  };

  alunosSalvos.unshift(aluno);
  atualizarPainel();
  formAluno.reset();
  mensagemForm.textContent = `${aluno.nome} foi cadastrado com sucesso.`;
  mensagemForm.className = "form-message success-message";
});

listaAlunos.addEventListener("click", function (event) {
  const botao = event.target.closest(".remove-student");
  if (!botao) return;
  const indice = alunosSalvos.findIndex((aluno) => String(aluno.id) === botao.dataset.id);
  if (indice >= 0) alunosSalvos.splice(indice, 1);
  atualizarPainel();
});

document.querySelector("#limparAlunos").addEventListener("click", function () {
  alunosSalvos.splice(0, alunosSalvos.length);
  atualizarPainel();
  mensagemForm.textContent = "Todos os registros foram removidos.";
  mensagemForm.className = "form-message";
});

atualizarPainel();
