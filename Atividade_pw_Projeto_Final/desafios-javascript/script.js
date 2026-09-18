const outputFor = (element) => element.closest(".challenge").querySelector("output");

document.querySelectorAll("form").forEach((form) => form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form), action = form.dataset.action, output = outputFor(form);
  if (action === "profile") output.textContent = `Nome: ${data.get("nome")}\nIdade: ${data.get("idade")}\nCidade: ${data.get("cidade")}`;
  if (action === "average") { const notes = ["n1","n2","n3","n4"].map((key) => Number(data.get(key))); const average = notes.reduce((total,note) => total + note,0) / 4; const status = average >= 7 ? "Aprovado" : average >= 5 ? "Recuperação" : "Reprovado"; output.textContent = `Média: ${average.toFixed(1)} · ${status}`; }
  if (action === "table") { const number = Number(data.get("numero")); output.textContent = Array.from({length:10},(_,index) => `${number} × ${index + 1} = ${number * (index + 1)}`).join("\n"); }
  if (action === "login") output.textContent = data.get("login") === "admin" && data.get("senha") === "1234" ? "Acesso permitido ✓" : "Acesso negado.";
  if (action === "sign") { const number = Number(data.get("numero")); output.textContent = number > 0 ? "Número positivo" : number < 0 ? "Número negativo" : "Número igual a zero"; }
}));

document.querySelector('[data-action="even"]').addEventListener("click", (event) => { outputFor(event.currentTarget).textContent = Array.from({length:10},(_,index) => (index + 1) * 2).join(" · "); });
