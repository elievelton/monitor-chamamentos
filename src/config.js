require("dotenv").config();

module.exports = {
    lookerUrl: process.env.LOOKER_URL,

    telegramToken: process.env.TELEGRAM_BOT_TOKEN,

    telegramChatId: process.env.TELEGRAM_CHAT_ID,

    headless: process.env.HEADLESS !== "false",

    retryAttempts: Number(process.env.RETRY_ATTEMPTS || 3),

    retryDelay: Number(process.env.RETRY_DELAY || 5000),
};