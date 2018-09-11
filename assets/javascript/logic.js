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
    // var trainName = "";
    // var destination = "";
    // var firstTrainTime = "";
    // var frequency = "";

    //functions========================================================

    function timePredictor() {
        

    };

    //on click functions===============================================

    //onclick for submit button
    $("#submit").on("click", function(event) {
        event.preventDefault();

        //get values from inputs and assign to variables
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        //add moment js formatting to ensure in military time HH:mm
        var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
        var frequency = $("#frequency").val().trim();

        //put variables in an object for database use
        var newTrainInfo = {
            name: trainName,
            destination: destination,
            firstTime: firstTrainTime,
            frequency: frequency
        };

        //push the object for new train info to the DB to create a child node
        database.ref().push(newTrainInfo);

        //alert new train added successfully (change to boostrap modal later?)
        alert("New Train Added Successfully");

        //clear inputs after submit is hit
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");

        //testing
        // console.log("train time input: " + trainName);
        // console.log("this is destination input: " + destination);
        // console.log("this is the first train time input: " + firstTrainTime);
        // console.log("thhi is the frequency input: " + frequency);
    });

    //on child event for datbase to be call to get the snapshot values
    database.ref().on("child_added", function(snapshotChild) {
        //create a variable to hold the child value
        var cv = snapshotChild.val();

        //assign the child snapshot values to the  variables
        trainName = cv.name;
        destination = cv.destination;
        firstTrainTime = cv.firstTime;
        frequency = cv.frequency;

        //testing section
        console.log(trainName);
        console.log(destination);
        console.log("first train time " + firstTrainTime);
        console.log("frequency " + frequency);

        //convert the first time to 1 year ago to prevent issues (and make sure its in military time)
        var firstTrainTimeConv = moment(firstTrainTime, "HH:mm").subtract(1, "years"); 

        //get the time difference from the current time (which is just "moment()") to the first trains arrival in minutes
        var timeDiff = moment().diff(moment(firstTrainTimeConv), "minutes");
    
        //take the modulus of the time difference and the frequency (this is the remaining time variable)
        var timeRemainder = timeDiff % frequency;

        //get the minutes to the next train by subtracting the remaining time variable from the frequency
        var minAway = frequency - timeRemainder; 

        //take the time from now ("moment()") and add it to minutes away variable (in minutes format),
        //assign it to var for next arrival,
        //change format to normal looking time
        var nextArrival = moment().add(minAway, "minutes").format("hh:mm A");

        //time testing section
        console.log("first train time converted " + firstTrainTimeConv);
        console.log("time difference " + timeDiff);
        console.log("remaining time: " + timeRemainder);
        console.log("minutes until next train: " + minAway);
        console.log("the next arrival " + nextArrival);

        //make a var for a new table row
        var newRow = $("<tr>").append(
        //create a td for each variable and append to the table row
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minAway)
        );

        //append table row to the tbody section of the table
        $("tbody").append(newRow);
    });

})