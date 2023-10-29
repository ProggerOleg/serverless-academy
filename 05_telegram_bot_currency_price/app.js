const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const NodeCache = require("node-cache");

const token = process.env.TELEGRAM_BOT_TOKEN;
const myCache = new NodeCache({ stdTTL: 300 });

const getMonobankCurrency = async () => {
    try {
        const response = await axios.get('https://api.monobank.ua/bank/currency');
        if (response.status === 200) {
            const data = response.data;
            const usd = data.find(item => (item.currencyCodeA === 840 && item.currencyCodeB === 980));
            const eur = data.find(item => (item.currencyCodeA === 978 && item.currencyCodeB === 980));

            if (usd && eur) {
                myCache.set('USD', usd);
                myCache.set('EUR', eur);
                return { eur, usd };
            } else {
                const cachedEur = myCache.get('EUR');
                const cachedUsd = myCache.get('USD');

                if (cachedEur && cachedUsd) {
                    return { eur: cachedEur, usd: cachedUsd };
                } else {
                    throw new Error('Currency data not found');
                }
            }
        } else {
            const cachedEur = myCache.get('EUR');
            const cachedUsd = myCache.get('USD');

            if (cachedEur && cachedUsd) {
                return { eur: cachedEur, usd: cachedUsd };
            } else {
                throw new Error('Currency data not found');
            }
        }
    } catch (error) {
        console.log(error);
    }
};


const getPrivatCurrency = async () => {
    try {
        const response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привіт, цей бот створений аби допомогти тобі дізнатися актуальні курси валют!', {
        reply_markup: {
            keyboard: [['Курс валют']],
        },
    });
});


bot.onText(/Курс валют/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Курс якого банку вас цікавить?', {
        reply_markup: {
            keyboard: [['Приватбанк', 'Monobank']],
        },
    });
});

bot.onText(/Приватбанк/, async (msg) => {
    const chatId = msg.chat.id;
    const data = await getPrivatCurrency();
    const [eur, usd] = data.slice(0, 2);
    bot.sendMessage(chatId, `Приватбанк:
Купляємо / Продаємо
🇺🇸 Долар: ${financial(usd.buy)} / ${financial(usd.sale)}
🇪🇺 Євро: ${financial(eur.buy)} / ${financial(eur.sale)}`);
});

bot.onText(/Monobank/, async (msg) => {
    const chatId = msg.chat.id;
    const { eur, usd } = await getMonobankCurrency();
    bot.sendMessage(chatId, `Монобанк:
Купляємо / Продаємо
🇺🇸 Долар: ${financial(usd.rateBuy)} / ${financial(usd.rateSell)}
🇪🇺 Євро: ${financial(eur.rateBuy)} / ${financial(eur.rateSell)}`);
});
