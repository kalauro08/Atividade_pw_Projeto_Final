const prompt = require('prompt-sync')();

let nota1 = Number(prompt("Digite a primeira nota:"));
let nota2 = Number(prompt("Digite a segunda nota:"));
let nota3 = Number(prompt("Digite a terceira nota:"));
let nota4 = Number(prompt("Digite a quarta nota:"));

let media = (nota1 + nota2 + nota3 + nota4) / 4;

console.log("Média Anual:", media);

if (media >= 7) 
    {
        console.log("Situação: Aprovado");
    } 
else if (media >= 5) 
    {
        console.log("Situação: Recuperação");
    } 
else 
    {
        console.log("Situação: Reprovado");
    }