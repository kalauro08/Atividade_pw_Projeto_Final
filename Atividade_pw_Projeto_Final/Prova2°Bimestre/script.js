const formNotas = document.querySelector("#formNotas");
const resultado = document.querySelector("#resultado");

formNotas.addEventListener("submit", function (event) {
  event.preventDefault();
  const nome = document.querySelector("#nomeAluno").value.trim();
  const notas = [...document.querySelectorAll(".nota")].map((input) => Number(input.value));
  const media = notas.reduce((total, nota) => total + nota, 0) / notas.length;
  const situacao = media >= 7 ? "Aprovado" : media >= 5 ? "Recuperação" : "Reprovado";
  const classe = situacao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  resultado.className = `result ${classe}`;
  resultado.innerHTML = `<span class="result-label">Resultado final</span><strong>${nome}: ${situacao} · Média ${media.toFixed(1)}</strong>`;
});
