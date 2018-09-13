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
    function updateClock() {
        var now = moment(),
            minute = now.minutes("mm").format("mm"),
            hour = now.hours("h").format("h");

        $("#hour").text(hour);
        $("#minute").text(minute);

        setTimeout(updateClock, 1000);
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
        
        //if values are blank then alert user via modal and don't commit to db
        if ((trainName === "") || (destination === "") || (firstTrainTime === "") || (frequency === "")) {
            $("#incompFormModal").modal("show");
            return false;
        }
        else {
            //display success modal
            $("#successModal").modal("show");

            //put variables in an object for database use
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

    //on child event for datbase to be call to get the snapshot values
    database.ref().on("child_added", function(snapshotChild) {
        //create a variable to hold the child value
        var cv = snapshotChild.val();

        //assign the child snapshot values to the  variables
        trainName = cv.name;
        destination = cv.destination;
        firstTrainTime = cv.firstTime;
        frequency = cv.frequency;

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
        var nextArrival = moment().add(minAway, "minutes").format("h:mm A");

        //time testing section
        // console.log("first train time converted " + firstTrainTimeConv);
        // console.log("time difference " + timeDiff);
        // console.log("remaining time: " + timeRemainder);
        // console.log("minutes until next train: " + minAway);
        // console.log("the next arrival " + nextArrival);

        //make a var for a new table row and create a td for each variable and append to the table row
        var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minAway)
        );

        //append table row to the tbody section of the table
        $("tbody").append(newRow);
    });

    //Display and update current time in jumbotron
    $("#ampm").append(moment().format("A"));
    updateClock();
})