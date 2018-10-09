// var users = ["10228272", "155659213", "783214"];
// var stream = T.stream('statuses/filter', { follow: users });

// stream.on('tweet', function (tweet) {
//     if (users.indexOf(tweet.user.id_str) > -1) {
//         console.log(tweet.user.name + ": " + tweet.text);
//         T.post('statuses/retweet/:id', {
//             id: tweet.id_str
//         }, function (err, data, response) {
//             console.log(data)
//         })
//     }
// })


var Twit = require(‘twit’);
var TwitterBot = require(‘node-twitterbot’).TwitterBot;
var Bot = new TwitterBot({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});
var phraseArray = ["hey twitter",
    "im tweeting",
    "tweet tweet",
    "tweetstorm time... 1/22",
    "plz RT v important",
    "delete ur account",
    "it me",
    "same",
    "#dogpants go on 4 legs!!",
    "#thedress is blue and black"];
function chooseRandom(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}
var phrase = chooseRandom(phraseArray) + ", " + chooseRandom(phraseArray);
Bot.tweet(phrase);