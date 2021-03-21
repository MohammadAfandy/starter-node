const TG = require('telegram-bot-api');
const { baseUrl, telegram } = appRequire("config");

class TelegramApi extends TG {
  async sendLogMessage(req, res) {
    try {
      let message = await renderFile('templates/telegram_log', {
        timestamp: new Date(),
        baseUrl,
        requestUrl: req.originalUrl,
        requestIp: getIpAddress(req),
        userAgent: req.headers['user-agent'],
        requestBody: JSON.stringify(maskSensitive(req.body), null, 2),
        response: JSON.stringify(res, null, 2),
      });
      await this.sendMessage({
        chat_id: telegram.logChatId,
        text: message,
        parse_mode: 'HTML',
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new TelegramApi({
  token: telegram.token,
});
