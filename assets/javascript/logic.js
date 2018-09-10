$(document).ready(function() {

    //initialize firebase
    var config = {
        apiKey: "AIzaSyAdubbT7GaczbM1StBJT93HVLxDf6VB1Jg",
        authDomain: "train-arrival-predictor.firebaseapp.com",
        databaseURL: "https://train-arrival-predictor.firebaseio.com",
        projectId: "train-arrival-predictor",
        storageBucket: "",
        messagingSenderId: "999365448386"
    };

    firebase.initializeApp(config);

    //create variable to call database
    var database = firebase.database();

    //global variables=================================================
    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";

    //functions========================================================

    function timePredictor() {
        

    };

    //on click functions===============================================

    //onclick for submit button
    $("#submit").on("click", function(event) {
        event.preventDefault();

        //get values from inputs and assign to variables
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        //add moment js formatting to ensure in military time HH:mm
        //firstTrainTime = $("#firstTrainTime").val().trim();
        firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
        frequency = $("#frequency").val().trim();

        //put variables in an object for database use
        var newTrainInfo = {
            name: trainName,
            destination: destination,
            firstTime: firstTrainTime,
            frequency: frequency
        };

        //database.ref().push object for new train info to create a child node
        database.ref().push(newTrainInfo);

        //alert new train added successfully (change to boostrap modal later?)
        alert("New Train Add Successfully");

        //clear inputs after submit
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");
    });

    //on value or on child event for datbase to be call
    database.ref().on("child_added", function(snapshotChild) {
        //create a variable to hold the child value
        var cv = snapshotChild.val();

        //assign the child snapshot values to the  variables
        trainName = cv.name;
        destination = cv.destination;
        firstTrainTime = cv.firstTrainTime;
        frequency = cv.frequency;

        //testing section
        console.log(trainName);
        console.log(destination);
        console.log("first train time " + firstTrainTime);
        console.log("frequency " + frequency);

        //convert the first time to 1 year ago to prevent issues
        var firstTrainTimeConv = moment(firstTrainTime).subtract(1, "years");
            console.log("first train time converted " + firstTrainTimeConv);

        //take the difference from the first time and the current time (current time is moment())
        var currentTime = moment().format("HH:mm");
            console.log("current time: " + currentTime);

        //get the time difference in minutes
        var timeDiff = moment().diff(moment(firstTrainTimeConv), "minutes");
            console.log("time difference " + timeDiff);

        var timeRemainder = timeDiff % frequency;
            console.log("this is the remaining time: " + timeRemainder);

        //get the minutes to the next train
        var minAway = frequency - timeRemainder;
            console.log("this is minutes until next train: " + minAway);

        //take the time from the first arrival to current time and assign to var for next arrival based on the frequency
        var nextArrival = moment().add(minAway, "minutes");
        //convert time into am/pm format using momentjs
        var nextArrivalPretty = moment(nextArrival).format("hh:mm a");
            console.log("This is the pretty time: " + nextArrivalPretty);

        //make a var for a new table row
        var newRow = $("<tr>").append(
        //create a td for each variable and append to the table row
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrivalPretty),
        $("<td>").text(minAway)
        );

        //append table row to the tbody section of the table
        $("tbody").append(newRow);
    });

})