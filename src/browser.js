const { chromium } = require("playwright");
const config = require("./config");

let browser = null;

async function iniciarBrowser() {
    if (browser) {
        return browser;
    }

    browser = await chromium.launch({
        headless: config.headless,
    });

    return browser;
}

async function criarPagina() {
    const navegador = await iniciarBrowser();

    const page = await navegador.newPage({
        viewport: {
            width: 1400,
            height: 900,
        },
    });

    page.setDefaultTimeout(30000);

    return page;
}

async function fecharBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

module.exports = {
    criarPagina,
    fecharBrowser,
};