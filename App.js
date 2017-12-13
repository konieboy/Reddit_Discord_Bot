const Discord = require("discord.js");
const Client = new Discord.Client();
const settings = require('./settings.json');
var fetch = require('node-fetch');
const retryAttempts = 25; //Return an error if bot can't find an image after 20 tries



// Some Subs format the JSON response data different than others
// In this case you can get the image from the 'link' attribute
function getPostLink(message, url) {
    fetch(url)
        .then(res => res.json())
        .then(res => res.data.children)
        .then(res => res.map(post => ({
            link: post.data.url,
        })))
        .then(res => {

            console.log(res.length);

            // Check if the random post is in an image format
            // If not, try again
            // Will try 'retryAttempts' times
            for (var i = 0; i < retryAttempts; i++) {
                var imgIndex = Math.floor(Math.random() * res.length + 1);
                var content = res[imgIndex].link;

                if (content.toLowerCase().endsWith("png") || content.toLowerCase().endsWith("jpg") || content.toLowerCase().endsWith("bmp") || content.toLowerCase().endsWith("jpeg")) {
                    message.reply(res[imgIndex].link)
                    return 0;
                }
            }
            message.reply("Error, could not find an image in the Subreddit: " + url);
            return 0;
        })
}

Client.on('ready', () => {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    console.log("Bot Start... \n\nCurrent date: " + datetime);
})

Client.on('message', message => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
})

Client.on('message', message => {
    message.author
    if (message.content === 'Hello'.toLowerCase()) {
        message.reply('Hello to you, ' + message.author);
    }

    if (message.content.toLowerCase().startsWith("/reddit")) {
        // Creating forming the request URL
        var subreddit = message.content.slice(7).replace(/\s/g, ''); // Cut first 7 char and remove whitespace
        var messageUrl = "https://www.reddit.com/r/" + subreddit + ".json";

        getPostLink(message, messageUrl);
    }

})


Client.login(settings.token);