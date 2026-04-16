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
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "mistralai/mistral-7b-instruct",
    messages: [
      { role: "user", content: prompt }
    ]
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

const text = response.data.choices[0].message.content;
message.reply(text);



  } catch (err) {
    console.log("ERREUR COMPLETE :", err.response?.data || err.message);
    message.reply("❌ " + (err.response?.data?.error || "Erreur IA"));
  }
});

client.once("ready", () => {
  console.log(`🤖 Bot IA connecté : ${client.user.tag}`);
});

client.login(process.env.TOKEN);