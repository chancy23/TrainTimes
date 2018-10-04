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

    //functions========================================================

    //gets the current time from moment.js and updates every second
    function updateClock() {
        var now = moment(),
            minute = now.minutes("mm").format("mm"),
            hour = now.hours("h").format("h");

        $("#hour").text(hour);
        $("#minute").text(minute);
        //updates the minutes 
        setTimeout(updateClock, 1000);
    };

    //Display and update current time in jumbotron
    updateClock();
    $("#ampm").append(moment().format("A"));

    //on click functions===============================================

    //onclick for submit button
    $("#submit").on("click", function(event) {
        event.preventDefault();

         //get values from inputs and assign to variables
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        //add moment.js formatting to ensure in military time (HH:mm)
        var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
        var frequency = $("#frequency").val().trim();
        
        //if values are blank then alert user via modal and don't commit to the DB
        if ((trainName === "") || (destination === "") || (firstTrainTime === "") || (frequency === "")) {
            $("#incompFormModal").modal("show");
            return false;
        }
        else {
            //display success modal
            $("#successModal").modal("show");

            //put variables in an object for DB use
            var newTrainInfo = {
                name: trainName,
                destination: destination,
                firstTime: firstTrainTime,
                frequency: frequency
            };
            //push the object for new train info to the DB to create a child node
            database.ref().push(newTrainInfo);

            //clear inputs from form
            $("#trainName").val("");
            $("#destination").val("");
            $("#firstTrainTime").val("");
            $("#frequency").val("");
        };
    });

    //on child event for DB to be called to get the snapshot values
    database.ref().on("child_added", function(snapshotChild) {
        //create a variable to hold the child value
        var cv = snapshotChild.val();

        //assign the child snapshot values to the variables
        trainName = cv.name;
        destination = cv.destination;
        firstTrainTime = cv.firstTime;
        frequency = cv.frequency;

        //Convert the first time to 1 year ago to prevent issues (and make sure its in military time again)
        var firstTrainTimeConv = moment(firstTrainTime, "HH:mm").subtract(1, "years"); 
        //Get the time difference from the current time (which is just "moment()") to the first trains arrival format in minutes
        var timeDiff = moment().diff(moment(firstTrainTimeConv), "minutes");
        //Take the remainder (modulus) of the time difference and the frequency
        var timeRemainder = timeDiff % frequency;
        //Get the minutes to the next train
        var minAway = frequency - timeRemainder; 
        //take the time from now ("moment()") and add it to minutes away variable (in minutes format)
        //change format to normal looking time
        var nextArrival = moment().add(minAway, "minutes").format("h:mm A");

        //time testing section
            // console.log("first train time converted " + firstTrainTimeConv);
            // console.log("time difference " + timeDiff);
            // console.log("remaining time: " + timeRemainder);
            // console.log("minutes until next train: " + minAway);
            // console.log("the next arrival " + nextArrival);

        //make a var for a new table row and create a td for each variable and append to the table row
        var $newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minAway)
        );

        //append table row to the tbody section of the table
        $("tbody").append($newRow);
    });
})