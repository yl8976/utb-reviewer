// Random phrases to choose from
var phraseArray = ["This post is SO good, ",
    "Hahahahahahahahahahaha ",
    "lmao ",
    "Absolute ",
    "lmfao, ",
    "ok, this is epic ",
    "LOL same. ",
    "Yes, ",
    "Jeeeeeeeez you really outdid yourself with this one. ",
    "Wow. ",
    "This deserves a Pulitzer. ",
    "Is this satire? Or is this art? ",
    "RETWEET ",
    "This is me irl. ",
    "This one's meh. SYKE! ",
    "UTB I can't even. ",
    "Great content. ",
    "UTB is perhaps one of the best publications I've ever read. ",
    "This gave me a new perspective on life. ",
    "But why? Thought-provoking... insightful... ",
    "This made me reconsider everything. ",
    "Simply ",
    "Beep, bop, boop, oops, I mean, ",
    "I didn't know I needed this in my life. "
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