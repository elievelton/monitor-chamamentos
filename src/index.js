const { obterTotalComRetry, fecharBrowser } = require("./reader");
const { obterUltimoNumero, salvarNumero } = require("./storage");
const {
    enviarMensagem,
    enviarErro,
    montarMensagemAlteracao
} = require("./telegram");

const logger = require("./logger");

(async () => {

    logger.info("========================================");
    logger.info("Iniciando monitor de convocações");

    try {

        const totalAtual = await obterTotalComRetry();

        logger.info(`Total encontrado: ${totalAtual}`);

        const ultimo = obterUltimoNumero();

        logger.info(`Último total salvo: ${ultimo}`);

        // Primeira execução
        if (ultimo === null) {

            logger.info("Primeira execução.");

            salvarNumero(totalAtual);

            logger.info("Valor salvo.");

            return;

        }

        // Não mudou
        if (ultimo === totalAtual) {

            logger.info("Nenhuma alteração.");

            return;

        }

        // Diminuiu
        if (totalAtual < ultimo) {

            logger.warning(
                "O total diminuiu. Confirmando novamente em 15 segundos..."
            );

            await new Promise(resolve =>
                setTimeout(resolve, 15000)
            );

            const confirmacao = await obterTotalComRetry();

            logger.info(
                `Nova leitura: ${confirmacao}`
            );

            if (confirmacao >= ultimo) {

                logger.warning(
                    "Queda descartada. Painel voltou ao valor esperado."
                );

                return;

            }

            logger.warning(
                "Queda confirmada."
            );

            const mensagem = montarMensagemAlteracao(
                ultimo,
                confirmacao
            );

            await enviarMensagem(mensagem);

            salvarNumero(confirmacao);

            return;

        }

        // Aumentou

        logger.info(
            "Novo registro encontrado."
        );

        const mensagem = montarMensagemAlteracao(
            ultimo,
            totalAtual
        );

        await enviarMensagem(mensagem);

        salvarNumero(totalAtual);

        logger.info("Telegram enviado.");

    } catch (erro) {

        logger.erro(
            erro.stack || erro.message
        );

        try {

            await enviarErro(erro);

        } catch {

            logger.erro(
                "Não foi possível enviar o erro para o Telegram."
            );

        }

    } finally {

        await fecharBrowser();

        logger.info("Browser encerrado.");

        logger.info("Monitor finalizado.");
        logger.info("========================================\n");

    }

})();