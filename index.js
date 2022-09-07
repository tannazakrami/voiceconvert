const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

const impF = require('./importFile.js');

bot.on("voice", async(msg) => {
    const chatID = msg.chat.id;
    const fileID = msg.voice.file_id;
    const fileLink = await bot.getFileLink(fileID);
    bot.sendMessage(chatID, 'Подождите, конвертируем ваше голосовое!')
    
    var audio = await impF.convertFile(fileLink);
    
    bot.sendAudio(chatID, audio);
})