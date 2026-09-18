/*Igor Gabriel Kalauro de Abreu*/
const assentos = [
    ["L", "O", "L", "O"],
    ["O", "O", "L", "L"],
    ["L", "L", "O", "O"]
];

let livres = 0;
let ocupados = 0;

for (let i = 0; i < assentos.length; i++)
{
    for (let j = 0; j < assentos[i].length; j++) 
    {
        if (assentos[i][j] === "L") 
        {
            livres++;
        } else 
        {
            ocupados++;
        }
    }
}

console.log("Assentos livres:", livres);
console.log("Assentos ocupados:", ocupados);