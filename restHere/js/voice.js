// voice
"use strict";

$(document).ready(function () {

    $("#voc").click(function (event) {
        var text = "Would you like to have a rest now?";
        playAudio(text);
        setTimeout(function () { switchRecognition(); }, 3000);
    });
});

var recognition;

function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function (event) {
        updateRec();
    };
    recognition.onresult = function (event) {
        var text = "", i;
        for (i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);

        // Send to socket server
        // socket.emit('speak', text);
        stopRecognition();
    };
    recognition.onend = function () {
        stopRecognition();

    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}

function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function setInput(text) {
     // $("#input").val(text);
    setResponse("Demo:" + text);
    playAudio("OK, I got it.");
}

function updateRec() {
    $("#voc").text(recognition ? "Listening" : "Voice");

}

//var socket = io();

function playAudio(text) {
    var u = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(u);
}

function setResponse(val) {
    $("#response").text(val);
}

