//Igor Gabriel Kalauro de Abreu

const prompt = require("prompt-sync")();

let nome = prompt("Digite seu nome: ");

let notas = [
    [8, 9, 10],
    [7, 8, 9],
    [10, 9, 8]
];

let soma = 0;

for (let linha = 0; linha < notas.length; linha++) {

    for (let coluna = 0; coluna < notas[linha].length; coluna++) {

        soma = soma + notas[linha][coluna];

    }
}

let quantidade = 0;

for (let linha = 0; linha < notas.length; linha++) {
    quantidade += notas[linha].length;
}

let media = soma / quantidade;

if (media >= 8) {

    let codigo = [
        80, 97, 114, 97, 98, 233, 110, 115, 32,
        118, 111, 99, 234, 32, 102, 111, 105, 32,
        97, 112, 114, 111, 118, 97, 100, 111
    ];

    let mensagem = "";

    for (let i = 0; i < codigo.length; i++) {

        mensagem = mensagem + String.fromCharCode(codigo[i]);

    }

    console.log(nome + ": " + mensagem);

} else {

    console.log(nome + ": Aluno reprovado");

}