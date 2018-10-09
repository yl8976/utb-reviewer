var Twit = require('twit')
var T = new Twit({
    consumer_key: 'uPQZKmaZMgMIikq48VdyS2c77',
    consumer_secret: 'SQestfPWAyriVUcoDD5ysEBTXcLh4SfnQcstIkde0Tz0kyTQuK',
    access_token: '1049744110624677894-elU0LqH0V4uGtxLhxgA3vRQfJGijxf',
    access_token_secret: 'DfVBnNKjhHQ2pdzIsUwqFe26aoYdzmAZyvb3iBdKe8YrN',
})

var users = ["10228272", "155659213", "783214"];
var stream = T.stream('statuses/filter', { follow: users });

stream.on('tweet', function (tweet) {
    if (users.indexOf(tweet.user.id_str) > -1) {
        console.log(tweet.user.name + ": " + tweet.text);
        T.post('statuses/retweet/:id', {
            id: tweet.id_str
        }, function (err, data, response) {
            console.log(data)
        })
    }
})