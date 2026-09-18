const prompt = require('prompt-sync')();

let numero = Number(prompt("Digite um número:"));

if (numero > 0) 
{
    console.log("Número positivo");
} 
else if (numero < 0)
{
    console.log("Número negativo");
} 
else 
{
    console.log("Número igual a zero");
}