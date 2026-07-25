const fs = require("fs");
const path = require("path");

const caminhoArquivo = path.join(__dirname, "..", "data", "ultimo_numero.json");

function obterDados() {
    if (!fs.existsSync(caminhoArquivo)) {
        return null;
    }

    try {
        const conteudo = fs.readFileSync(caminhoArquivo, "utf8");
        return JSON.parse(conteudo);
    } catch {
        return null;
    }
}

function obterUltimoNumero() {
    const dados = obterDados();

    if (!dados) {
        return null;
    }

    return dados.total;
}

function salvarNumero(total) {
    const dados = {
        total,
        atualizadoEm: new Date().toISOString()
    };

    fs.writeFileSync(
        caminhoArquivo,
        JSON.stringify(dados, null, 2),
        "utf8"
    );
}

module.exports = {
    obterDados,
    obterUltimoNumero,
    salvarNumero
};