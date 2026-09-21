# Portfolio Igor Gabriel

Portfolio profissional com formulario de contato persistido em SQLite.

## Executar

```bash
npm install
npm start
```

Depois, acesse `http://localhost:3000`. O arquivo `portfolio.db` e criado automaticamente na primeira inicializacao.

O formulario envia os dados para `POST /api/contatos`, valida os campos no servidor e salva cada mensagem com status `novo` e data de recebimento.