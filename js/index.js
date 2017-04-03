//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
nlp = window.nlp_compromise;

var messages = [], //array that hold the record of each string in chat
    lastUserMessage = "", //keeps track of the most recent input string from the user
    botMessage = "", //var keeps track of what the chatbot is going to say
    botName = 'Chatbot', //name of the chatbot
    talking = true, //when false the speach function doesn't work
    counter = 0,
    info = {};
data_output = false; //true if the yelp api call has been made
access_token = "t9tChAnMypsFLyTcn1_TOIXY9jQ4pVjeZbGWWFik7G4EP6bgj7XLtAX--f3_Fm33dIQ3ThqJ3hzSVZdX9pgt0bwDvdqTTUJ21XXRWxMEvee7T9L1G4p9SHS6iQPeWHYx",
    output_messages = ["First of all, I need to ask a few basic questions. What zip code are you in?", "What is your price range on a scale of 1 to 4?", "Give me a second to load some results for you. Say 'y' when you're ready for some Yelp reccomendations!"];
//
//
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//edit this function to change what the chatbot says
function chatbotResponse() {
    talking = true;
    if (data_output) {
        if (counter > info.length - 1) {
            botMessage = "I'm out of reccomendations, sorry!";
        }
        if (counter == 2) {
            if (lastUserMessage.toLowerCase() == "y") {
                botMessage = "How about " + info.businesses[counter - 2].name + "? say y for more information, say n for another suggestion.";
            } else {
                botMessage = "Too bad, here's a reccomendation anyway." + " How about " + info.businesses[counter - 2].name + "? say y for more information, say n for another suggestion.";
            }
            counter++;
        } else if (counter > 2) { //first reccomendation is already out
            if (lastUserMessage.toLowerCase() === "y") {
                botMessage = "You can call " + info.businesses[counter - 3].name + " at " + info.businesses[counter - 3].phone + ". Here's a link to see where it is on Google Maps: https://www.google.com/maps/dir//" + info.businesses[counter - 3].location.address1 + "+" + info.businesses[counter - 3].location.city + "+" + info.businesses[counter - 3].location.state + "+" + info.businesses[counter - 3].location.zip_code + "/" + ". Say n for another suggestion!";
            } else if (lastUserMessage.toLowerCase() === "n") {
                botMessage = "How about " + info.businesses[counter - 2].name + "? say y for more information, say n for another suggestion.";
            } else {
                botMessage = "say either y or n.";
                counter--;
            }
            counter++;
        }
    } else {
        botMessage = "Be Patient!"
        if (counter === 2) {
            if (messages[2] == parseInt(messages[2]) && messages[4] == parseInt(messages[4])) {
                call_yelp(messages[2], messages[4]);
                botMessage = output_messages[counter];
            } else {
                botMessage = "You need to input numbers for both your zip code and price. Refresh this page and try again.";
            }
        }
        if (counter < 2) {
            botMessage = output_messages[counter];
            counter++;
        }
    }

}

//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//
//
//
//this runs each time enter is pressed.
//It controls the overall input and output
function newEntry() {
    //if the message from the user isn't empty then run
    if (document.getElementById("chatbox").value != "") {
        //pulls the value from the chatbox ands sets it to lastUserMessage
        lastUserMessage = document.getElementById("chatbox").value;
        //sets the chat box to be clear
        document.getElementById("chatbox").value = "";
        //adds the value of the chatbox to the array messages
        messages.push(lastUserMessage);
        //Speech(lastUserMessage);  //says what the user typed outloud
        //sets the variable botMessage in response to lastUserMessage
        chatbotResponse();
        if (counter == 2) {
            setTimeout(function() {


            }, 5000);
        }
        //add the chatbot's name and message to the array messages
        messages.push("<b>" + botName + ":</b> " + botMessage);
        // says the message using the text to speech function written below
        Speech(botMessage);
        //outputs the last few array elements of messages to html
        for (var i = 1; i < 8; i++) {
            if (messages[messages.length - i])
                document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
        }
    }
}

//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
    if ('speechSynthesis' in window && talking) {
        var utterance = new SpeechSynthesisUtterance(say);
        //msg.voice = voices[10]; // Note: some voices don't support altering params
        //msg.voiceURI = 'native';
        //utterance.volume = 1; // 0 to 1
        //utterance.rate = 0.1; // 0.1 to 10
        //utterance.pitch = 1; //0 to 2
        //utterance.text = 'Hello World';
        //utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
    var x = e || window.event;
    var key = (x.keyCode || x.which);
    if (key == 13 || key == 3) {
        //runs this function when enter is pressed
        newEntry();
    }
    if (key == 38) {
        console.log('hi')
        //document.getElementById("chatbox").value = lastUserMessage;
    }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
    document.getElementById("chatbox").placeholder = "";
}

function call_yelp(zip, price) {
    $.ajax({
        url: 'https://yelp-chatbot.herokuapp.com/',
        type: 'GET',
        dataType: 'json',
        data: {
            location: zip,
            price: price
        },
        success: function(data) {
            console.log(data);
            info = data;
            data_output = true;
        },
        error: function() {
            alert("you didn't put in numbers for your zip and price!Refresh this page and try again.");
        }
    });
}
