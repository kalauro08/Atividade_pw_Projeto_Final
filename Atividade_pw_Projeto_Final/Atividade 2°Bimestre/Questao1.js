/*Igor Gabriel Kalauro de Abreu*/
const prompt = require('prompt-sync')();

const notas = [8, 5, 7, 10, 6, 4, 0, 2];

let aprovados = 0;

for (let i=0; i< notas.length; i++) 
{
    if(notas[i] >= 6)
        
    {
        aprovados++;
    }
}

console.log("Informe a Quantidade de alunos aprovados: " + aprovados);
