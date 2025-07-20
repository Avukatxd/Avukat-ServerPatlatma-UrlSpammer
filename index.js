const { Client, Intents, Collection, GatewayIntentBits } = require("discord.js");
const discord = require("discord.js");
const botConfig = require("./botConfig.json");
const ascii = require("ascii-table");
const table = new ascii("Commands");
table.setHeading("Command", "Status");
const fs = require("fs");


const client = new Client({ intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b) });
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js") && file !== "urlspammer.js");
for(const file of commandFiles) {
   const command = require(`./commands/${file}`);
 client.commands.set(command.help.name, command);
    if(file) {
        table.addRow(file, "✅");
    } else {
        table.addRow(file, "❌");
    }
}

const urlSokucu = require('./commands/urlspammer');
const token = botConfig.token;
const vanity = ''; // Almak istediğin URL
const guildId = ''; // Sunucu ID
new urlSokucu(vanity, guildId, token);

// Bot login edildikten sonra çalıştırılmalı
client.once("ready", () => {
    console.log(`${client.user.tag} başarıyla giriş yaptı!`);
    client.user.setPresence({
        status: "dnd",
        activities: [
            {
                name: "AVUKAT 💗 FODGE",
                type: "STREAMING"
            }
        ]
    });
});


console.log(table.toString());
client.once("ready", () => {   
    console.log(`Prod By Avukat`);
});

client.on("messageCreate", async message => {
    if(message.author.bot) return;
    var prefix = botConfig.prefix;
    var messageArray = message.content.split(" ");
    var command = messageArray[0];
    if(!message.content.startsWith(prefix)) return;
    var commandData  = client.commands.get(command.slice(prefix.length));
    if(!commandData) return;
    var arguments  = messageArray.slice(1);
    try {
        await commandData.run(client, message, arguments);
    } catch (error) {
        console.log(error);
        var errorEmbed = new discord.MessageEmbed()
            .setDescription(`AVUKAT`);
        await message.reply({ embeds: [errorEmbed] });
    }
});
client.login(botConfig.token);