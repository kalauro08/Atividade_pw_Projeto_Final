/*Igor Gabriel Kalauro de Abreu*/
const numeros = [10, 5, 8, 3, 12, 7, 4, 9, 2, 6];

let soma = 0;
let maior = numeros[0];
let menor = numeros[0];
let pares = 0;
let impares = 0;

for (let i = 0; i < numeros.length; i++) 
{
    soma += numeros[i];

    if (numeros[i] > maior)
    {
        maior = numeros[i];
    }

    if (numeros[i] < menor) 
    {
        menor = numeros[i];
    }

    if (numeros[i] % 2 === 0) 
    {
        pares++;
    } else 
    {
        impares++;
    }
}

let media = soma / numeros.length;

console.log("A soma de todos os numeros é: ", soma);
console.log("A média de todos os numeros é: ", media);
console.log("O maior número é: ", maior);
console.log("O menor número é: ", menor);
console.log("Os numeros pares são: ", pares);
console.log("Os numeros ímpares são: ", impares);