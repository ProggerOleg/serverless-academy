const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_KEY = process.env.API_KEY;
const city = 'Kyiv';
const scheduledMessages = {};
let lat, long;

const bot = new TelegramBot(token, { polling: true });


const getCityCoords = async (city) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        lat = response.data[0].lat;
        long = response.data[0].lon;
        return { lat, long };
    } catch (error) {
        console.error(error);
    }
};

const getWeatherForecast = async (city) => {
    try {
        await getCityCoords(city);
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Вітаю! Виберіть, який прогноз погоди вас цікавить:', {
        reply_markup: {
            keyboard: [['Прогноз в Києві']],
        },
    });
});

bot.onText(/Прогноз в Києві/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Який інтервал вас цікавить?', {
        reply_markup: {
            keyboard: [['З інтервалом 3 години', 'З інтервалом 6 годин']],
        },
    });
});

const sendScheduledMessage = async (chatId, city, hours) => {
    try {
        const weatherData = await getWeatherForecast(city);
        await bot.sendMessage(chatId, JSON.stringify(weatherData.weather));
    } catch (error) {
        bot.sendMessage(chatId, 'Помилка отримання погоди. Спробуйте ще раз.');
    } finally {
        scheduledMessages[chatId] = setTimeout(() => sendScheduledMessage(chatId, city), hours * 60 * 60 * 1000);
    }
};

const cancelScheduledMessages = (chatId) => {
    if (scheduledMessages[chatId]) {
        clearTimeout(scheduledMessages[chatId]);
        delete scheduledMessages[chatId];
    }
};

bot.onText(/З інтервалом 3 години/, (msg) => {
    const chatId = msg.chat.id;
    cancelScheduledMessages(chatId);
    sendScheduledMessage(chatId, city, 3);
});

bot.onText(/З інтервалом 6 годин/, (msg) => {
    const chatId = msg.chat.id;
    sendScheduledMessage(chatId, city, 6);
});
