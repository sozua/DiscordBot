const Discord = require("discord.js");
const qs = require("qs");
const axios = require("axios");
const config = require("../config.json");

async function getImage(template, boxes) {
  const params = qs.stringify({
    template_id: template,
    username: process.env.IMGFLIP_USERNAME,
    password: process.env.IMGFLIP_PASS,
    boxes: boxes.map((text) => ({ text })),
  });

  const resp = await axios.get(
    `https://api.imgflip.com/caption_image?${params}`
  );
  const { data } = await resp;
  return data;
}

module.exports = {
  name: "meme",
  description: "Crie seu meme",
  aliases: ["criar", "maker"],
  emoji: ":zany_face:",
  async execute(message) {
    const sentMessage = await message.channel.send(config.messages.waitMessage);
    try {
      const mensagem = Array.from(message.content.split(" "));
      const id = mensagem[2];
      // Dividi as mensagens longas em 2 e remove o "!s meme [id]" da primeira parte da string
      const longBoxes = Array.from(
        message.content.split(" ").slice(3).join(" ").split(",")
      );
      if (longBoxes) {
        const { data } = await getImage(id, longBoxes);
        const embed = await new Discord.MessageEmbed()
          .setTitle("Meme criado com sucesso! =D")
          .setColor("#0099ff")
          .setURL(data.url)
          .setImage(data.url);
        sentMessage.edit(config.messages.finishedMessage, embed);
      } else {
        const boxes = Array.from(mensagem.slice(3));
        const { data } = await getImage(id, boxes);
        const embed = await new Discord.MessageEmbed()
          .setTitle("Meme criado com sucesso! =D")
          .setColor("#0099ff")
          .setURL(data.url)
          .setImage(data.url);
        sentMessage.edit(config.messages.finishedMessage, embed);
      }
    } catch {
      sentMessage.edit(config.messages.errorMessage);
    }
  },
};
