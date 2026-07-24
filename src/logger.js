const fs = require("fs");
const path = require("path");

const pastaLogs = path.join(__dirname, "..", "logs");

if (!fs.existsSync(pastaLogs)) {
    fs.mkdirSync(pastaLogs, { recursive: true });
}

const arquivoLog = path.join(pastaLogs, "monitor.log");

function timestamp() {
    return new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });
}

function escrever(nivel, mensagem) {

    const linha = `[${timestamp()}] [${nivel}] ${mensagem}`;

    console.log(linha);

    fs.appendFileSync(
        arquivoLog,
        linha + "\n",
        "utf8"
    );

}

function info(mensagem) {
    escrever("INFO", mensagem);
}

function warning(mensagem) {
    escrever("WARN", mensagem);
}

function erro(mensagem) {
    escrever("ERRO", mensagem);
}

async function salvarScreenshot(page) {

    try {

        const pasta = path.join(__dirname, "..", "screenshots");

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        const nomeArquivo =
            new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/\..+/, "");

        const caminho = path.join(
            pasta,
            `erro-${nomeArquivo}.png`
        );

        await page.screenshot({
            path: caminho,
            fullPage: true
        });

        info(`Screenshot salva em ${caminho}`);

    } catch (e) {

        erro(`Falha ao salvar screenshot: ${e.message}`);

    }

}

module.exports = {
    info,
    warning,
    erro,
    salvarScreenshot
};