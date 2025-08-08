const os = require('os');
const fs = require('fs');
const path = require('path');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: ' *𝙱𝙾𝚃𝙻𝙰 𝙱𝙾𝚃* ' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        const botInfo = `ʜᴀʏʏ👋
📡𝙱𝙾𝚃𝙻𝙰 𝚒𝚜 𝙰𝚌𝚝𝚒𝚟𝚎 𝚊𝚗𝚍 𝚊𝚕𝚒𝚟𝚎

🔸 *📼𝙱𝙾𝚃𝙻𝙰 Speed:* ${ping} ms
🔸 *🖥Uptime:* ${uptimeFormatted}
🔸 🧠 *CPU:* 54%
🔸 💽 *Disk:* 198G / 387G
🔸 💾 *RAM:* 94.21MB / 3000MB
🔸 📀 *ROM:* 612.77MB /8.00GB
🔸 🖥️ *Host:* katabump
🔸 🐧 *OS:* Ubuntu/google
🔸 🎛️ *Prefix:* . 
   ᴍᴀᴅᴇ ᴡɪᴛʜ ᴛᴀɴᴠɪʀ 
`.trim();

        const imagePath = path.join(__dirname, '../assets/alive_image.jpg');
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: botInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: botInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get bot status.' }, { quoted: message });
    }
}

module.exports = pingCommand;
