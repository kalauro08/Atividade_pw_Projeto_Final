const path = require("node:path");
const crypto = require("node:crypto");
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;
const database = new Database(path.join(__dirname, "portfolio.db"));
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || process.env.SMTP_USER,
  destination: process.env.CONTACT_EMAIL
};
const mailer = emailConfig.host && emailConfig.user && emailConfig.pass && emailConfig.destination
  ? nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: { user: emailConfig.user, pass: emailConfig.pass }
    })
  : null;

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
  );

  CREATE TABLE IF NOT EXISTS cadastros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    senha_hash TEXT NOT NULL,
    senha_salt TEXT NOT NULL,
    marketing INTEGER NOT NULL DEFAULT 0,
    consentido_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recuperacoes_senha (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    solicitado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const inserirContato = database.prepare(`
  INSERT INTO contatos (nome, email, telefone, assunto, mensagem)
  VALUES (@nome, @email, @telefone, @assunto, @mensagem)
`);
const inserirCadastro = database.prepare(`
  INSERT INTO cadastros (nome, email, senha_hash, senha_salt, marketing)
  VALUES (@nome, @email, @senhaHash, @senhaSalt, @marketing)
`);
const buscarCadastroPorEmail = database.prepare(`SELECT id, nome, email, senha_hash, senha_salt FROM cadastros WHERE email = ? COLLATE NOCASE`);
const inserirRecuperacao = database.prepare(`
  INSERT INTO recuperacoes_senha (email, token_hash)
  VALUES (?, ?)
`);

app.use(express.json({ limit: "20kb" }));
app.use(session({
  secret: process.env.SESSION_SECRET || "chave-local-apenas-desenvolvimento",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 1000 * 60 * 60 * 8 }
}));
app.use(express.static(__dirname));

app.post("/api/contatos", async (request, response) => {
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

  if (!mailer) {
    return response.status(503).json({ erro: "O envio de e-mail ainda nao foi configurado no servidor." });
  }

  try {
    await mailer.sendMail({
      from: emailConfig.from,
      to: emailConfig.destination,
      replyTo: dados.email,
      subject: `[Portfolio] ${dados.assunto}`,
      text: `Nome: ${dados.nome}\nE-mail: ${dados.email}\nTelefone: ${dados.telefone || "Nao informado"}\n\n${dados.mensagem}`
    });
    const resultado = inserirContato.run(dados);
    return response.status(201).json({ id: resultado.lastInsertRowid, mensagem: "Mensagem enviada com sucesso." });
  } catch (error) {
    console.error("Falha ao enviar contato:", error.message);
    return response.status(502).json({ erro: "Nao foi possivel enviar a mensagem agora. Tente novamente mais tarde." });
  }
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

app.post("/api/cadastros", (request, response) => {
  const { nome, email, senha, marketing = false } = request.body || {};
  const dados = { nome: String(nome || "").trim(), email: String(email || "").trim(), senha: String(senha || "") };
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email);
  if (dados.nome.length < 3 || dados.nome.length > 120 || !emailValido || dados.senha.length < 8 || dados.senha.length > 200) {
    return response.status(400).json({ erro: "Preencha os campos obrigatorios corretamente." });
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const senhaHash = crypto.scryptSync(dados.senha, salt, 64).toString("hex");
  try {
    const resultado = inserirCadastro.run({ nome: dados.nome, email: dados.email, senhaHash, senhaSalt: salt, marketing: marketing === true ? 1 : 0 });
    return response.status(201).json({ id: resultado.lastInsertRowid, mensagem: "Cadastro criado com sucesso." });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return response.status(409).json({ erro: "Este e-mail ja possui cadastro." });
    return response.status(500).json({ erro: "Nao foi possivel concluir o cadastro." });
  }
});

app.post("/api/login", (request, response) => {
  const email = String(request.body?.email || "").trim();
  const senha = String(request.body?.senha || "");
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido || !senha) return response.status(400).json({ erro: "Informe um e-mail e uma senha validos." });

  const cadastro = buscarCadastroPorEmail.get(email);
  const senhaInformada = cadastro
    ? crypto.scryptSync(senha, cadastro.senha_salt, 64)
    : crypto.scryptSync(senha, "login-fallback-salt", 64);
  const senhaArmazenada = cadastro ? Buffer.from(cadastro.senha_hash, "hex") : Buffer.alloc(64);
  const senhaValida = cadastro && senhaInformada.length === senhaArmazenada.length && crypto.timingSafeEqual(senhaInformada, senhaArmazenada);

  if (!senhaValida) return response.status(401).json({ erro: "E-mail ou senha incorretos." });
  request.session.usuario = { id: cadastro.id, nome: cadastro.nome, email: cadastro.email };
  return response.json({ mensagem: "Login realizado com sucesso.", usuario: request.session.usuario });
});

app.get("/api/sessao", (request, response) => {
  if (!request.session.usuario) return response.status(401).json({ autenticado: false });
  return response.json({ autenticado: true, usuario: request.session.usuario });
});

app.post("/api/logout", (request, response) => {
  request.session.destroy(() => response.status(204).end());
});

app.post("/api/recuperar-senha", (request, response) => {
  const email = String(request.body?.email || "").trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) return response.status(400).json({ erro: "Informe um e-mail valido." });

  const cadastro = buscarCadastroPorEmail.get(email);
  if (cadastro) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    inserirRecuperacao.run(email, tokenHash);
    // O envio do token depende da configuração de um provedor de e-mail.
  }

  return response.status(200).json({ mensagem: "Se houver uma conta para este e-mail, as instrucoes de recuperacao serao enviadas." });
});