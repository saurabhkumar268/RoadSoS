window.onload = function(){

    setTimeout(function(){

        document.getElementById("loader").style.display = "none";

        document.getElementById("mainContent").style.display = "block";

    },3000);
};

function activateSOS(){

    document.getElementById("popup").style.display = "block";

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);

    }
}

function showPosition(position){

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    document.getElementById("locationText").innerHTML =
    "📍 Latitude: " + latitude +
    "<br>📍 Longitude: " + longitude;

    let mapURL =
    "https://maps.google.com/maps?q="
    + latitude + "," + longitude +
    "&z=15&output=embed";

    document.getElementById("mapFrame").src = mapURL;

    let hospitalURL =
    "https://www.google.com/maps/search/hospitals/@"
    + latitude + "," + longitude + ",15z";

    document.getElementById("hospitalLink").href = hospitalURL;
}

function startVoiceSOS(){

    const recognition =
    new(window.SpeechRecognition ||
        window.webkitSpeechRecognition)();

    recognition.lang = "en-US";

    recognition.start();

    alert("🎤 Speak 'HELP'");

    recognition.onresult = function(event){

        const command =
        event.results[0][0].transcript;

        if(command.toLowerCase().includes("help")){

            activateSOS();

        }
    };
}