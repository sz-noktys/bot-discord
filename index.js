const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!ask")) return;

  const prompt = message.content.slice(5).trim();

  try {
    await message.channel.sendTyping();

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`
        }
      }
    );

    const text = response.data[0]?.generated_text || "Pas de réponse";

    message.reply(text);

  } catch (err) {
    console.log(err.response?.data || err);
    message.reply("❌ Erreur IA");
  }
});

client.once("ready", () => {
  console.log(`🤖 Bot IA connecté : ${client.user.tag}`);
});

client.login(process.env.TOKEN);