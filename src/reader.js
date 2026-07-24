const { criarPagina, fecharBrowser } = require("./browser");
const config = require("./config");

const REGEX_PAGINACAO = /^(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)$/;

async function obterTotal() {

    const page = await criarPagina();

    try {

        await page.goto(config.lookerUrl, {
            waitUntil: "domcontentloaded",
            timeout: 120000
        });

        const locator = page.getByText(/\d+\s*-\s*\d+\s*\/\s*\d+/);

        await locator.waitFor({
            state: "visible",
            timeout: 30000
        });

        const texto = (await locator.textContent()).trim();

        const match = texto.match(REGEX_PAGINACAO);

        if (!match) {
            throw new Error(
                `Formato inesperado encontrado: "${texto}"`
            );
        }

        const primeiroRegistro = Number(match[1]);
        const ultimoRegistro = Number(match[2]);
        const total = Number(match[3]);

        if (
            Number.isNaN(total) ||
            total < ultimoRegistro ||
            ultimoRegistro < primeiroRegistro
        ) {
            throw new Error(
                `Valores inconsistentes encontrados: ${texto}`
            );
        }

        return total;

    } finally {

        await page.close();

    }

}

async function obterTotalComRetry() {

    let ultimoErro;

    for (
        let tentativa = 1;
        tentativa <= config.retryAttempts;
        tentativa++
    ) {

        try {

            console.log(
                `🔎 Tentativa ${tentativa}/${config.retryAttempts}`
            );

            return await obterTotal();

        } catch (erro) {

            ultimoErro = erro;

            console.log(
                `❌ ${erro.message}`
            );

            if (tentativa < config.retryAttempts) {

                const espera =
                    config.retryDelay * tentativa;

                console.log(
                    `⏳ Nova tentativa em ${espera / 1000}s`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, espera)
                );

            }

        }

    }

    throw ultimoErro;

}

module.exports = {
    obterTotalComRetry,
    fecharBrowser
};