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
  "https://api-inference.huggingface.co/models/google/flan-t5-large",
  {
    inputs: prompt,
    parameters: {
      max_new_tokens: 200
    }
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json"
    }
  }
);

// SAFE CHECK
let text = "Pas de réponse";

if (Array.isArray(response.data) && response.data[0]?.generated_text) {
  text = response.data[0].generated_text;
} else if (response.data?.generated_text) {
  text = response.data.generated_text;
} else {
  text = "⚠️ IA occupée, réessaie dans quelques secondes";
}

message.reply(text);

  } catch (err) {
    console.log("ERREUR IA :", err.response?.data || err.message);
    message.reply("❌ Erreur IA");
  }
});

client.once("ready", () => {
  console.log(`🤖 Bot IA connecté : ${client.user.tag}`);
});

client.login(process.env.TOKEN);