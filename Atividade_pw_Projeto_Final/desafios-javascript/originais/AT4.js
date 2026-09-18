const prompt = require('prompt-sync')();

let numero = Number(prompt("Informe o numero para a tabuada: "));

for (let i = 1; i <= 10; i++) 
{
    console.log(numero + " x " + i + "=" + (numero * i));
}