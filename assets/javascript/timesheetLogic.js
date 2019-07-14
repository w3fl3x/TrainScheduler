// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBEHlnQoWHNnbMjiizaWzWyZJ4jv6NOoSQ",
        authDomain: "train-schedule-hw-dd48c.firebaseapp.com",
        databaseURL: "https://train-schedule-hw-dd48c.firebaseio.com",
        projectId: "train-schedule-hw-dd48c",
        storageBucket: "",
        messagingSenderId: "1088296213702",
        appId: "1:1088296213702:web:a7014f7783395d5e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

function currentTime() {
    var current = moment().format('LT');
    $('#currentTime').html(current);
    setTimeout(currentTime, 1000);
};

// Button for adding train
$('#add-train-btn').on('click', function(event) {
    event.preventDefault();

   // Grab user iput
   var trainName = $('#train-input').val().trim();
   var trainDestination = $('#destination-input').val().trim();
   var trainFirstTime = $('#first-time-input').val().trim();
   var trainFrequency = $('#frequency-input').val().trim();

   // Create Local 'temp' object for holding train data
   var newTrain = {
       train: trainName,
       destination: trainDestination,
       time: trainFirstTime,
       frequency: trainFrequency
   };

   // Upload train data to database
   database.ref().push(newTrain);

   // Console log everything
   console.log(newTrain.train);
   console.log(newTrain.destination);
   console.log(newTrain.time);
   console.log(newTrain.frequency);

//    alert('Train successfully added');

   // Clear all of text boxes
   $('#train-input').val('');
   $('#destination-input').val('');
   $('#first-time-input').val('');
   $('#frequency-input').val('');
});

// Create Firebase event for adding train to database and row in html
database.ref().on('child_added', function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable
    var trainName = childSnapshot.val().train;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;
    var key = childSnapshot.key;

    // Train info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFirstTime);
    console.log(trainFrequency);

    // Prettify next arrival time
    var trainNextArrival = moment.unix(trainFirstTime).format('LT');

    // Calculate time
    var trainMinutesAway;
    var firstTrain = moment(childSnapshot.val().time, 'hh:mm').subtract(1, 'years');
    // Dif between current and firstTrainTime
    var diffTime = moment().diff(moment(firstTrain), 'minutes');
    var remainder = diffTime % childSnapshot.val().frequency;
    // Minutes until next train
    var trainMinutesAway = childSnapshot.val().frequency - remainder;
    // Next train time
    var trainNextArrival = moment().add(trainMinutesAway, 'minutes').format('LT');

    // Create the new row
    var newRow = $('<tr>').append(
        $('<td>').text(trainName),
        $('<td>').text(trainDestination),
        $('<td>').text(trainFrequency),
        $('<td>').text(trainNextArrival),
        $('<td>').text(trainMinutesAway),
        $("<td class='text-center'><button class='delete btn btn-sr-only btn-xs' data-key='" + key + "'>X</button></td>")
    );

    // Append the new row to the table
    $('#train-table > tbody').append(newRow);
});

// Click event to delete row of train data
$(document).on('click', '.delete', function() {
    keyref = $(this).attr('data-key');
    // alert(keyref)
    window.location.reload;
    database.ref().child(keyref).remove();
    window.location.reload();
});

// Reload page every 60 seconds and show latest minutes away
currentTime();

setInterval(function() {
    window.location.reload();
}, 60000);