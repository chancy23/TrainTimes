$(document).ready(function() {

    //initialize firebase

    //create variable to call database

    //on click functions===============================================

    //onclick for submit button
    $("#submit").on("click", function(event) {
        event.preventDefault();

        //get values from inputs and assign to variables
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        //add moment js formatting to ensure in military time HH:mm
        var firstTrainTime = $("#firstTrainTime").val().trim();
        var frequency = $("#frequency").val().trim();

        //put variables in an object for database use
        var newTrainInfo = {
            name: trainName,
            destination: destination,
            firstTime: firstTrainTime,
            frequency: frequency
        };

        //testing section
        console.log(newTrainInfo.name);
        console.log(newTrainInfo.destination);
        console.log(newTrainInfo.firstTime);
        console.log(newTrainInfo.frequency);

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
    database.ref().on("child_added", function() {

        //make new local variables for each input to hold the snapshot value of each item

        //convert time using momentjs into military time

        //take the difference from the current time and last train arrival and set as a var

        //take the time from the first arrival to current time and assign to var for next arrival 
        //convert time into am/pm format using momentjs

        //make a var for a new table row

        //create a td for each variable and append to the table row

        //append table row to the tbody section of the table
    });

})