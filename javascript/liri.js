var inputName;
var year;
var score = 0;
var BasicCard = require("./BasicCard");
var ClozeCard = require("./ClozeCard");
// Load the NPM Package inquirer
var inquirer = require("inquirer");
// Grabs the bands variables
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");
var fs = require('fs');
var mysql = require("mysql");
var columnify = require("columnify");
var functions = require("./functions");
var bamSuper = require("./bamazonSuper");
var bamManager = require("./bamazonManager");
var bamCustomer = require("./bamazonCustomer");

var twitter = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);
var twitterParams = {
    q: 'nytimes',
    count: 20
};

var gamesArr = [BasicCard, ClozeCard];
var basicArr = [
    ["Who was the first president of the United States?", "George Washington"],
    ["How many letters are in the alphabet?", "26"],
    ["How cool is Clark?", "Very"],
    ["What comes after 7,9,11?", "13"],
    ["There are how many states in the USA?", "50"]
];
var clozeArr = [
    ["George Washington was the first president of the United States.", "George Washington"],
    ["There are 26 letters in the alphabet", "26"],
    ["Clark is very cool.", "very"],
    ["Complete this series: 7,9,11,13", "13"],
    ["There are 50 states in the USA.", "50"]
];

function titleCase(string) {

    var titleArr = string.split(" ")
    //loops through movie title array and splits words into
    //first letter and the remainder of the word
    for (i = 0; i < titleArr.length; i++) {
        //first letter is uppercased
        var upper = titleArr[i][0].toUpperCase();
        //rest of word is the string sliced at index 1
        var rest = titleArr[i].slice(1).toLowerCase();
        //word string recombined and replaces original word from .split array
        titleArr[i] = upper + rest;
    }
    //once loop through title array complete, individual words of title are recombined with " " inbetween.
    var title = titleArr.join(" ")

    return title;
};
//myTweets function
function myTweets() {
    twitter.get('search/tweets', twitterParams, function(error, tweets, response) {
        var masterArr = [];
        if (!error) {
            tweets = tweets.statuses;
            for (var i = 0; i < tweets.length; i++) {

                var outputArr = [
                    (i + 1) + ": " + tweets[i].text,
                    "",
                    "Created: " + tweets[i].created_at,
                    "--------------------------------------------"
                ];

                for (j = 0; j < outputArr.length; j++) {
                    console.log(outputArr[j]);
                    masterArr.push(outputArr[j]);
                } //end of inner for loop
            } //end of outer for loop
            writeStream(masterArr);
            /*var stream = fs.createWriteStream("log.txt",
            	{ flags: 'a',
            	encoding: null,
            	mode: 0666});
            stream.on('error', console.error);
            masterArr.forEach((str) => { 
            	stream.write(str + '\n'); 
            });//end forEach loop
            stream.end();*/
        } //end if statement
        else {
            console.log(error);
        } //end else statement
        continueLiri();
    }); //end of get
} //end myTweets();
//doWhatSays function
function doWhatSays() {
    fs.readFile('../txt/random.txt', 'utf8', function(err, data) {

        if (err) {
            return console.log(err);
        }
        var doChoiceArr = data.replace(/"/g, "").split(",");
        var choiceArrOne;

        if (!doChoiceArr[1]) {
            choiceArrOne = "";
        } else {
            choiceArrOne = doChoiceArr[1];
        }

        switch (doChoiceArr[0]) {
            case "movie-this":
                movieThis(choiceArrOne);
                break;
            case "spotify-this-song":
                spotifyThis(choiceArrOne);
                break;
            case "games":
                //add playGame logic
                gameTime();
                break;
            case "bamazon-shopping":
                bamazonNow();
                break;
            case "my-tweets":
                myTweets();
                break;
        }
    }); //end readFile
}; //end doWhatSays();

//spotifyThis function
function spotifyThis(inputName) {
    if (inputName === "") {
        inputName = "Never+Gonna+Give+You+Up";
    }

    var spotifyParams = {
        type: 'track',
        query: inputName
    };

    //console.log(spotifyParams)
    var masterArr = [];

    spotify.search(spotifyParams, function(err, data) {

        if (err) {
            return console.log('Error occurred: ' + err);
        }

        inputName = titleCase(inputName.replace(/\+/g, " "));

        for (i = 0; i < 5; i++) {

            var outputArr = [
                "----------------------",
                (i + 1) + ". " + data.tracks.items[i].artists[0].name,
                inputName,
                data.tracks.items[i].album.name,
                data.tracks.items[i].external_urls.spotify,
                "----------------------",
            ];


            for (j = 0; j < outputArr.length; j++) {
                console.log(outputArr[j]);
                masterArr.push(outputArr[j]);
            }

        }
        writeStream(masterArr);
        /*var stream = fs.createWriteStream("log.txt",
        	{
        		flags: 'a',
        		encoding: null,
        		mode: 0666
        	});
        	stream.on('error', console.error);
        	masterArr.forEach((str) => { 
        		stream.write(str + '\n'); 
        	});//end forEach
        stream.end();*/
        continueLiri();
    }); //end search
} //end spotifyThis();

//movieThis function
function movieThis(inputName, year) {

    if (inputName === "") {
        inputName = "Blade+Runner";
    }

    var omdbURL = "http://www.omdbapi.com/?t=" + inputName + "&y=" + year + "&plot=short&apikey=40e9cece";
    //console.log(omdbURL)
    request(omdbURL, function(error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            var thisJSON = JSON.parse(body);

            var outputArr = ["",
                "-------------",
                "Title: " + thisJSON.Title,
                "Rated: " + thisJSON.Rated,
                "Released: " + thisJSON.Released,
                "IMDB Rating: " + thisJSON.Ratings[0].Value,
                "Rotten Tomatoes Rating: " + thisJSON.Ratings[1].Value,
                "Country: " + thisJSON.Country,
                "Language: " + thisJSON.Language,
                "Plot: " + thisJSON.Plot,
                "Actors: " + thisJSON.Actors,
                "-------------"
            ];

            for (i = 0; i < outputArr.length; i++) {
                console.log(outputArr[i]);
            }
            writeStream(outputArr);
            /*var stream = fs.createWriteStream("log.txt",
            	{
            		flags: 'a',
            		encoding: null,
            		mode: 0666 
            	});
            	stream.on('error', console.error);
            	outputArr.forEach((str) => { 
            		stream.write(str + '\n'); 
            	});
            stream.end();*/
        } //end of if
        continueLiri();
    }); //end of request
}; //end movieThis();

//writeStream function
function writeStream(array) {
    var stream = fs.createWriteStream("../txt/log.txt", {
        flags: 'a',
        encoding: null,
        mode: 0666
    });
    stream.on('error', console.error);
    array.forEach((str) => {
        stream.write(str + '\n');
    }); //end forEach loop
    stream.end();
}; //end writeStream();

//begin writeFile function
function writeFile(text) {
    fs.writeFile('../txt/log.txt', text, function(err) {
        if (err) throw err;
    });
}; //end writeFile()

//begin appendFile
function appendFile(text) {
    fs.appendFile('../txt/log.txt', text + '\n', function(err) {
        if (err) throw err;
    });
}; //end appendFile()

//basicGame function
function basicGame(array, i) {
    var limit = array.length;

    if (i === 0) {
        console.log("--------------------");
        console.log("Welcome! Let's play.")
        console.log("--------------------");

        writeStream(
            ["--------------------",
                "Welcome! Let's play.",
                "--------------------"
            ]);
    }

    function keepPlaying() {
        if (i < limit) { //begin if statement
            inquirer.prompt([{
                type: "input",
                message: i + 1 + ". " + array[i].front,
                name: "answer"
            }, {
                type: "list",
                message: "Are you sure?",
                choices: ["Yes", "No"],
                name: "yesNo"
            }]).then(function(response) {
                if (response.yesNo === "Yes") {
                    if (response.answer.toLowerCase() === array[i].back.toLowerCase()) {
                        console.log("Correct!");
                        console.log("--------------------");
                        writeStream([(i + 1) + ". Correct!", "--------------------"]);
                        score++;
                    } else {
                        console.log("You are wrong!");
                        console.log("The correct answer is: " + array[i].back);
                        console.log("--------------------");
                        writeStream([(i + 1) + ". You are wrong!", "The correct answer is: " + array[i].back, "--------------------"]);
                    }
                    i++;
                    basicGame(array, i);
                } else {
                    keepPlaying();
                } //end else
            });
        } else {
            console.log("Game Over!");
            console.log("You got " + score + "/" + limit + " correct!");
            console.log("--------------------");
            writeStream(["Game Over!", "You got " + score + "/" + limit + " correct!", "--------------------"]);
            inquirer.prompt([{
                type: "list",
                message: "Would you like to play again?",
                choices: ["Yes", "No"],
                name: "yesNo"
            }]).then(function(response) {
                score = 0;
                if (response.yesNo === "Yes") {
                    basicGame(array, 0);
                } else {
                    console.log("Till next time!");
                    console.log("--------------------")
                    appendFile("Till next time!");
                    appendFile("--------------------");
                    continueLiri();
                } //end else
            }); //end inquirer
        } //end else
    }; //end keepPlaying
    setTimeout(keepPlaying, 1000);
} //end basicGame();

//clozeGame
function clozeGame(array, i) {
    var limit = array.length;

    if (i === 0) {
        console.log("--------------------");
        console.log("Welcome! Let's play.");
        console.log("--------------------");

        writeStream(
            ["--------------------",
                "Welcome! Let's play.",
                "--------------------"
            ]);
    }

    function keepPlaying() {
        if (i < limit) { //begin if statement
            inquirer.prompt([{
                type: "input",
                message: i + 1 + ". " + array[i].partial(),
                name: "answer"
            }, {
                type: "list",
                message: "Are you sure?",
                choices: ["Yes", "No"],
                name: "yesNo"
            }]).then(function(response) {
                if (response.yesNo === "Yes") {
                    if (response.answer.toLowerCase() === array[i].cloze.toLowerCase()) {
                        console.log("Correct!");
                        console.log("--------------------");
                        writeStream([(i + 1) + ". Correct!", "--------------------"]);
                        score++;
                    } else {
                        console.log("You are wrong!");
                        console.log("The correct answer is: " + array[i].cloze);
                        console.log("--------------------");
                        writeStream([(i + 1) + ". You are wrong!", "The correct answer is: " + array[i].cloze, "--------------------"]);
                    }
                    i++;
                    clozeGame(array, i);
                } else {
                    keepPlaying();
                } //end else
            });
        } else {
            console.log("Game Over!");
            console.log("You got " + score + "/" + limit + " correct!");
            console.log("--------------------");
            writeStream(["Game Over!", "You got " + score + "/" + limit + " correct!", "--------------------"]);
            inquirer.prompt([{
                type: "list",
                message: "Would you like to play again?",
                choices: ["Yes", "No"],
                name: "yesNo"
            }]).then(function(response) {
                score = 0;
                if (response.yesNo === "Yes") {
                    clozeGame(array, 0);
                } else {
                    console.log("Till next time!");
                    appendFile("Till next time!");
                    continueLiri();
                } //end else
            }); //end inquirer
        } //end else
    }; //end keepPlaying
    setTimeout(keepPlaying, 1000);
} //end clozeGame();

//gameTime function
function gameTime() {
    inquirer.prompt([{
        type: "list",
        message: "Which game would you like to play?",
        choices: gamesArr,
        name: "thisGame"
    }]).then(function(response) {
        appendFile(response.thisGame);
        switch (response.thisGame) {
            case "BasicCard":
                /*console.log("--------------------");
                console.log("--------card1-------");
                console.log("--------------------");
                console.log(card1.front);
                console.log(card1.back);*/
                var cardsArr = [];
                for (var i = 0; i < basicArr.length; i++) {
                    var current = basicArr[i]
                    var card = new BasicCard(current[0], current[1]);
                    cardsArr.push(card);
                    //console.log(card);
                }

                basicGame(cardsArr, 0);

                //console.log(cardsArr);s
                break;
            case "ClozeCard":
                /*console.log("--------------------");
                console.log("--------card2-------");
                console.log("--------------------");
                console.log(card2.fullText);
                console.log(card2.partial());
                console.log(card2.cloze);*/
                var cardsArr = [];
                for (var i = 0; i < clozeArr.length; i++) {
                    var current = clozeArr[i]
                    var card = new ClozeCard(current[0], current[1]);
                    cardsArr.push(card);
                    //console.log(card);
                }
                //console.log(cardsArr);

                clozeGame(cardsArr, 0);

                break;
        } //end switch
        //continueLiri();
    }); //end then
}; //end gameTime();

function bamazonNow() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '#Dubnium105#',
        database: 'bamazondb'
    });
    connection.connect(function(err) {
        if (err) {
            console.log("error connecting: " + err.stack);
            return;
        }
        console.log("Welcome to Bamazon! Your one stop node.js shop. " + connection.threadId);

        inquirer.prompt([{
            type: 'list',
            message: 'Are you a: ',
            choices: ['customer', 'manager', 'supervisor'],
            name: 'choice'
        }]).then(function(response) {
            writeStream([response.choice, "--------------------"]);
            switch (response.choice) {
                case 'customer':
                    bamCustomer.startApp(connection);
                    break;
                case 'manager':
                    bamManager.startApp(connection);
                    break;
                case 'supervisor':
                    bamSuper.startApp(connection);
                    break;
            }
        });
    });
}; //end bamazonNow()

//switchify function
function switchify(choice) {
    switch (choice) { //complete switch with prompt for more info when necessary
        case "bamazon-shopping":
            console.log("Loading Bamazon...");
            setTimeout(bamazonNow, 1500);
            break;
        case "games":
            gameTime();
            //<<<add writeStream logic for game output.
            break;
        case "movie-this":
            inquirer.prompt([{
                    type: "input",
                    message: "What movie shall I look up for you?",
                    name: "movie"
                },
                {
                    type: "input",
                    message: "What year? (Hit enter if not sure.)",
                    name: "year"
                }
            ]).then(function(resp) {
                movieThis(resp.movie, resp.year);
            })
            break;
        case "spotify-this-song":
            inquirer.prompt([{
                type: "input",
                message: "What song shall I look up for you?",
                name: "song"
            }]).then(function(resp) {
                spotifyThis(resp.song);
            }); //end then
            break;
        case "do-what-it-says":
            doWhatSays();
            break;
        case "my-tweets":
            myTweets();
            break;
    } //end switch statement
}; //end switchify();

//function continue
function continueLiri(callback) {
    function goodbye() {
        console.log("Goodbye...")
    };

    function waitThis() {
        inquirer.prompt([{
            type: "list",
            message: "Anything else I can do for you?",
            choices: ["Yes", "No"],
            name: "yesNo"
        }]).then(function(response) {
            if (response.yesNo === "Yes") {
                startApp();
            } else {
                setTimeout(goodbye, 1000);
                writeFile("");
            }
        }); //end inner inquirer prompt call
    };
    setTimeout(waitThis, 1000);
} //end continue();

//startPrompt function
function startApp(callback) {
    inquirer.prompt([ //make into function and use recursion to keep calling until user chooses to stop	
        {
            type: "list",
            message: "What can I do for you?",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "games", "bamazon-shopping", "do-what-it-says"],
            name: "choice"
        }
    ]).then(function(response) {
        appendFile(response.choice);
        switchify(response.choice);
    }); //end prompt call
}; //end startPrompt function
startApp();

exports.startApp = function() {
    startApp();
}