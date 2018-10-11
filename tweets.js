// Random phrases to choose from
var phraseArray = ["This post is SO good, 10/10. ",
    "Hahahahahahahahahahaha 10/10. ",
    "lmao 10/10. ",
    "Absolute 10/10. ",
    "lmfao, 10/10. ",
    "ok, this is epic 10/10. ",
    "LOL same 10/10.. ",
    "Yes 10/10.. ",
    "Jeeeeeeeez you really outdid yourself with this one. 10/10. ",
    "Wow. 10/10. ",
    "This deserves a Pulitzer. 10/10. ",
    "Is this satire? Or is this art? 10/10. ",
    "RETWEET 10/10. ",
    "This is me irl. 10/10. ",
    "This one's meh. SYKE! 10/10. ",
    "UTB I can't even. 10/10. ",
    "Great content. 10/10. ",
    "UTB is perhaps one of the best publications I've ever read. 10/10. ",
    "This gave me a new perspective on life. 10/10. ",
    "But why? Thought-provoking... insightful... 10/10. ",
    "This made me reconsider everything. 10/10. ",
    "Simply 10/10. ",
    "Beep, bop, boop, oops, I mean, 10/10! ",
    "I didn't know I needed this in my life. 10/10. "
];

// Chooses a random array element
function chooseRandom(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}

// Export code to other JS files to remove redundancy
module.exports = {
    phraseArray: phraseArray,
    chooseRandom: chooseRandom
};