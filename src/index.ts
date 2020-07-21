import discord, { VoiceChannel } from 'discord.js';
import config from 'config';

const DISCORD_TOKEN = config.get<string>('discord.token');

console.log(DISCORD_TOKEN);
const voiceLines = [ `resource/voiceLines/imhereforyouboos100%.mp3` ];

const bot = new discord.Client();

bot.on('ready', async () => {
    console.log('Logged in as %s\n', bot.user?.tag);
});

bot.on('disconnect', async (errorMessage, code) => {
    console.log(`Disconnect (${code})`);
    console.log(`Error message ${errorMessage}`);
});

bot.on('message', async (message) => {
    console.log('Message Event');
    console.log(`From: ${message.author.tag}`);
    console.log(`Content: ${message.toString()}`);
});

bot.on('voiceStateUpdate', async (oldState, newState) => {
    console.log('Voice State Update');
    // console.log(oldState.member?.user.tag);
    // console.log(newState.member?.user?.tag);
    const user = newState.member?.user;
    if (!user) {
        console.log(`User not found`);
        return;
    }
    if (user.id === bot.user?.id) {
        // console.log(`It' me. Exit.`);
        return;
    }
    console.log(`User: ${user.tag}`);
    const channel = newState.member?.voice.channel;
    if (!channel) {
        console.log('Member Voice Channel Not Exists');
        return;
    }
    console.log('Joining Channel !');
    const connection = await channel.join();
    console.log('Joined Channel !');
    const dispatcher = connection.play(voiceLines[0], {
        volume: 0.5,
    });
    const leave = async () => {
        console.log('Leaving Channel !');
        await channel.leave();
        console.log('Left Channel !');
    };
    dispatcher.on('finish', async () => {
        console.log('Finished Playing !');
        await leave();
    });
    dispatcher.on('error', async () => {
        console.log('Error Playing !');
        await leave();
    });
});

bot.login(DISCORD_TOKEN);
