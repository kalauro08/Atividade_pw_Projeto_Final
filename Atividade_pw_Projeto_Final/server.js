const path = require("node:path");
const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const port = process.env.PORT || 3000;
const database = new Database(path.join(__dirname, "portfolio.db"));

database.pragma("journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT DEFAULT '',
    assunto TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'novo',
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const inserirContato = database.prepare(`
  INSERT INTO contatos (nome, email, telefone, assunto, mensagem)
  VALUES (@nome, @email, @telefone, @assunto, @mensagem)
`);

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

app.post("/api/contatos", (request, response) => {
  const { nome, email, telefone = "", assunto, mensagem } = request.body || {};
  const dados = {
    nome: String(nome || "").trim(),
    email: String(email || "").trim(),
    telefone: String(telefone || "").trim(),
    assunto: String(assunto || "").trim(),
    mensagem: String(mensagem || "").trim()
  };

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email);
  if (dados.nome.length < 3 || !emailValido || dados.assunto.length < 3 || dados.mensagem.length < 10) {
    return response.status(400).json({ erro: "Preencha os campos obrigatorios corretamente." });
  }

  const resultado = inserirContato.run(dados);
  return response.status(201).json({ id: resultado.lastInsertRowid, mensagem: "Contato recebido com sucesso." });
});

app.get("/api/contatos", (_request, response) => {
  const contatos = database.prepare(`
    SELECT id, nome, email, telefone, assunto, mensagem, status, criado_em
    FROM contatos
    ORDER BY id DESC
  `).all();
  response.json(contatos);
});

app.listen(port, () => {
  console.log(`Portfolio disponivel em http://localhost:${port}`);
});