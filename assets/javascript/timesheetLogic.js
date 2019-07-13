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

    alert('Train successfully added');

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
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    // Train info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFirstTime);
    console.log(trainFrequency);

    // Prettify next arrival time
    var trainNextArrivalPretty = moment.unix(trainFirstTime).format('LT');

    // Calculate time
    var minAway;
    var firstTrainNew = moment(childSnapshot.val().trainFirstTime, 'hh:mm').subtract(1, 'years');
    // Dif between current and firstTrainTime
    var diffTime = moment().diff(moment(firstTrainNew), 'minutes');
    var remainder = diffTime % childSnapshot.val().frequency;
    // Minutes until next train
    var minAway = childSnapshot.val().frequency - remainder;
    // Next train time
    var trainMinutesAway = moment().add(minAway, 'minutes');
    trainMinutesAway = moment(trainMinutesAway).format('hh:mm');
    // var trainNextArrival = moment().add(minAway, 'minutes');
    // trainNextArrival = moment(trainNextArrival).format('hh:mm');
    // // Minutes away
    // var trainMinutesAway = childSnapshot.val().trainFrequency - remainder;

    // Create the new row
    var newRow = $('<tr>').append(
        $('<td>').text(trainName),
        $('<td>').text(trainDestination),
        $('<td>').text(trainFrequency),
        $('<td>').text(trainNextArrivalPretty),
        $('<td>').text(trainMinutesAway)
    );

    // Append the new row to the table
    $('#train-table > tbody').append(newRow);
});