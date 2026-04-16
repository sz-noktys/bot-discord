const { EmbedBuilder } = require('discord.js');

if (message.content.startsWith("!8ball")) {
  const question = message.content.slice(6).trim();

  if (!question) {
    return message.reply("❌ Pose une question !");
  }

  const reponses = [
    "Oui 👍",
    "Non ❌",
    "Peut-être 🤔",
    "C’est certain 🔥",
    "Absolument 💯",
    "Je ne pense pas...",
    "Impossible 😅",
    "Sans aucun doute 😎"
  ];

  const random = reponses[Math.floor(Math.random() * reponses.length)];

  const embed = new EmbedBuilder()
    .setTitle("🎱 Magic 8 Ball")
    .addFields(
      { name: "Question", value: question },
      { name: "Réponse", value: random }
    )
    .setColor("Purple");

  message.reply({ embeds: [embed] });
}