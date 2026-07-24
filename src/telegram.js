const axios = require("axios");
const config = require("./config");

const api = axios.create({
    baseURL: `https://api.telegram.org/bot${config.telegramToken}`,
    timeout: 15000,
});

async function enviarMensagem(texto) {

    try {

        await api.post("/sendMessage", {
            chat_id: config.telegramChatId,
            text: texto,
            parse_mode: "Markdown"
        });

        console.log("📨 Telegram: mensagem enviada.");

    } catch (erro) {

        console.error("❌ Erro ao enviar mensagem para o Telegram.");

        if (erro.response) {
            console.error(erro.response.data);
        } else {
            console.error(erro.message);
        }

        throw erro;

    }

}

async function enviarErro(erro) {

    const mensagem =
`🚨 *Monitor de Convocações*

O monitor encontrou um erro.

\`\`\`
${erro.message}
\`\`\`

🕒 ${new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo"
})}`;

    await enviarMensagem(mensagem);

}

function montarMensagemAlteracao(anterior, atual) {

    const diferenca = atual - anterior;

    const emoji =
        diferenca > 0
            ? "📈"
            : diferenca < 0
            ? "📉"
            : "➡️";

    const sinal = diferenca > 0 ? "+" : "";

    return `🚨 *Monitor de Convocações*

${emoji} O painel foi atualizado.

📊 *Total anterior:* ${anterior}
📊 *Total atual:* ${atual}
📈 *Diferença:* ${sinal}${diferenca}

🕒 ${new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    })}`;

}

module.exports = {
    enviarMensagem,
    enviarErro,
    montarMensagemAlteracao
};