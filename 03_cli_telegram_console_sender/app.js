#!/usr/bin/env node
import TelegramBot from 'node-telegram-bot-api';
import { program } from 'commander';

// Я не став хардкодити змінні, для роботи програми необхіден .env файл;
const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Removes DeprecationWarning 
process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 0;
// Removes DeprecationWarning

const bot = new TelegramBot(token, { polling: false });

program
    .version('1.0.0')
    .description('Telegram Bot CLI');

program
    .command('send-message <message>')
    .alias('m')
    .description('Send a message to the Telegram bot')
    .action(async (message) => {
        try {
            await bot.sendMessage(CHAT_ID, message);
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

program
    .command('send-photo <path>')
    .alias('p')
    .description('Send a photo to the Telegram bot')
    .action(async (path) => {
        try {
            await bot.sendPhoto(CHAT_ID, path);
            console.log('Photo sent successfully');
        } catch (error) {
            console.error('Error sending photo: something went wrong, check the path you provide');
        }
    });

program.parse(process.argv);
