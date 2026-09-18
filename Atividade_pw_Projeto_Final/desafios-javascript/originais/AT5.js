const prompt = require('prompt-sync')();

let login = prompt("Digite o login:");
let senha = prompt("Digite a senha:");


if (login === "admin" && senha === "1234") 
{
    console.log("Acesso permitido");
} 
else 
{
    console.log("Acesso negado");
}