const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "..", "data", "ultimo_numero.json");

function obterDados() {

    if (!fs.existsSync(arquivo)) {
        return null;
    }

    return JSON.parse(
        fs.readFileSync(arquivo, "utf8")
    );

}

function obterUltimoNumero() {

    const dados = obterDados();

    return dados ? dados.total : null;

}

function salvarNumero(total) {

    const agora = new Date().toISOString();

    const dados = {
        total,
        ultimaVerificacao: agora,
        ultimaNotificacao: agora
    };

    fs.writeFileSync(
        arquivo,
        JSON.stringify(dados, null, 2)
    );

}

module.exports = {
    obterUltimoNumero,
    salvarNumero,
    obterDados
};