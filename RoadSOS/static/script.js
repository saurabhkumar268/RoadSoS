/* FIREBASE CONFIG */

const firebaseConfig = {

    apiKey:
    "AIzaSyDs7vSYfGnqXVlNh3_mCbIARqVlF335wdY",

    authDomain:
    "roadsos-fd251.firebaseapp.com",

    projectId:
    "roadsos-fd251",

    storageBucket:
    "roadsos-fd251.firebasestorage.app",

    messagingSenderId:
    "302216980906",

    appId:
    "1:302216980906:web:2db5a19cab0707d6e0a3d3",

    measurementId:
    "G-KNB6038YXG"
};

firebase.initializeApp(
    firebaseConfig
);

const messaging =
firebase.messaging();

/* NOTIFICATION PERMISSION */

Notification.requestPermission()

.then(permission=>{

    if(permission === "granted"){

        console.log(
            "Notification Permission Granted"
        );
    }
});
function updateNetworkStatus(){

    const status =
    document.getElementById("networkStatus");

    const phone =
    document.querySelector(".phone");

    if(navigator.onLine){

        status.innerHTML =
        "🟢 Online";

        phone.classList.remove(
            "offline-mode"
        );
    }

    else{

        status.innerHTML =
        "🔴 Offline";

        phone.classList.add(
            "offline-mode"
        );
    }
}

window.addEventListener(
    "online",
    updateNetworkStatus
);

window.addEventListener(
    "offline",
    updateNetworkStatus
);

updateNetworkStatus();

/* ELEMENTS */

const sosBtn =
document.querySelector(".sos-btn");

const voiceBtn =
document.getElementById(
    "voiceBtn"
);

const popupOverlay =
document.getElementById(
    "popupOverlay"
);

const sosPopup =
document.querySelector(".popup");

const closePopup =
document.getElementById(
    "closePopup"
);

const locationText =
document.getElementById(
    "locationText"
);

const mapFrame =
document.getElementById(
    "mapFrame"
);

const hospitalLink =
document.getElementById(
    "hospitalLink"
);

const toast =
document.getElementById(
    "toast"
);

const sirenSound =
document.getElementById(
    "sirenSound"
);

const flashScreen =
document.getElementById(
    "flashScreen"
);

const savedEmergencyContact =
document.getElementById(
    "savedEmergencyContact"
);

const whatsappAlert =
document.getElementById(
    "whatsappAlert"
);

/* TOAST */

function showToast(message){

    toast.innerHTML =
    message;

    toast.style.top =
    "25px";

    toast.style.opacity =
    "1";

    setTimeout(()=>{

        toast.style.top =
        "-100px";

        toast.style.opacity =
        "0";

    },2500);
}

/* LOAD SAVED CONTACT */

let emergencyNumber =
localStorage.getItem(
    "emergencyContact"
);

if(emergencyNumber){

    savedEmergencyContact.innerHTML =

    "📞 " +
    emergencyNumber;
}

/* SOS FUNCTION */

function activateSOS(){

    /* VIBRATION */

    if(navigator.vibrate){

        navigator.vibrate(
            [300,100,300]
        );
    }

    /* SHOW POPUP */

    popupOverlay.style.display =
    "flex";

    sosPopup.style.display =
    "block";

    /* SHAKE */

    document.body.classList.add(
        "shake"
    );

    setTimeout(()=>{

        document.body.classList.remove(
            "shake"
        );

    },600);

    /* TOAST */

    showToast(
        "🚨 SOS Activated"
    );

    /* SIREN */

    sirenSound.currentTime = 0;

    sirenSound.play();

    /* FLASH */

    flashScreen.style.display =
    "block";

    flashScreen.classList.add(
        "flash-active"
    );

    setTimeout(()=>{

        flashScreen.classList.remove(
            "flash-active"
        );

        flashScreen.style.display =
        "none";

    },3000);

    /* LOADING LOCATION */

    locationText.innerHTML =

    "📍 Fetching Live Location...";

    /* LIVE LOCATION */

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(

            position=>{

                const latitude =
                position.coords.latitude;

                const longitude =
                position.coords.longitude;

                /* SHOW LOCATION */

                locationText.innerHTML =

                "📍 Latitude: "

                +

                latitude.toFixed(5)

                +

                "<br><br>📍 Longitude: "

                +

                longitude.toFixed(5);

                /* MAP */

                const mapURL =

                "https://maps.google.com/maps?q="

                +

                latitude

                +

                ","

                +

                longitude

                +

                "&z=15&output=embed";

                mapFrame.src =
                mapURL;

                /* HOSPITALS */

                hospitalLink.href =

                "https://www.google.com/maps/search/hospitals/@"

                +

                latitude

                +

                ","

                +

                longitude

                +

                ",15z";

/* WHATSAPP ALERT */

if(
    emergencyNumber &&
    navigator.onLine
){

    const message =

    "🚨 EMERGENCY ALERT! I need help. My live location: https://maps.google.com/?q="

    +

    latitude

    +

    ","

    +

    longitude;

    const whatsappURL =

    "https://wa.me/91"

    +

    emergencyNumber

    +

    "?text="

    +

    encodeURIComponent(
        message
    );

    whatsappAlert.href =
    whatsappURL;
}

/* OFFLINE SMS */

if(
    !navigator.onLine &&
    emergencyNumber
){

    const smsMessage =

    "🚨 HELP! I need assistance. My location: https://maps.google.com/?q="

    +

    latitude

    +

    ","

    +

    longitude;

    const smsURL =

    "sms:"

    +

    emergencyNumber

    +

    "?body="

    +

    encodeURIComponent(
        smsMessage
    );

    window.location.href =
    smsURL;

    showToast(
        "📵 Offline SMS Ready"
    );
}

/* PUSH NOTIFICATION */

if(navigator.onLine){

    new Notification(

        "🚨 Emergency Alert",

        {

            body:

            "Live location ready for emergency contact.",

            icon:

            "https://cdn-icons-png.flaticon.com/512/564/564619.png"
        }
    );
}

},

error=>{

    locationText.innerHTML =

    "❌ Unable to fetch location";
}

);

}

else{

    locationText.innerHTML =

    "❌ Geolocation not supported";
}
}

/* SOS CLICK */

sosBtn.addEventListener(

    "click",

    activateSOS
);

/* CLOSE SOS */

closePopup.addEventListener(
    "click",
    ()=>{

        popupOverlay.style.display =
        "none";

        sosPopup.style.display =
        "none";

        sirenSound.pause();

        sirenSound.currentTime = 0;
    }
);

/* VOICE SOS */

voiceBtn.addEventListener(
    "click",
    ()=>{

        if(

            !window.SpeechRecognition

            &&

            !window.webkitSpeechRecognition
        ){

            alert(
                "Voice recognition not supported"
            );

            return;
        }

        const recognition =

        new(

            window.SpeechRecognition ||

            window.webkitSpeechRecognition

        )();

        recognition.lang =
        "en-US";

        recognition.start();

        voiceBtn.innerHTML =

        "🎙️ Listening...";

        recognition.onresult =

        function(event){

            const command =

            event.results[0][0]
            .transcript
            .toLowerCase();

            if(

                command.includes(
                    "help"
                )

                ||

                command.includes(
                    "sos"
                )

                ||

                command.includes(
                    "emergency"
                )
            ){

                activateSOS();
            }

            voiceBtn.innerHTML =

            "🎤 Voice SOS";
        };

        recognition.onerror =

        function(){

            voiceBtn.innerHTML =

            "🎤 Voice SOS";
        };
    }
);

/* FIRST AID */

const firstAidCard =
document.getElementById(
    "firstAidCard"
);

const firstAidPopup =
document.getElementById(
    "firstAidPopup"
);

const closeAidPopup =
document.getElementById(
    "closeAidPopup"
);

firstAidCard.addEventListener(
    "click",
    ()=>{

        firstAidPopup.style.display =
        "block";
    }
);

closeAidPopup.addEventListener(
    "click",
    ()=>{

        firstAidPopup.style.display =
        "none";
    }
);

/* VEHICLE */

const vehicleCard =
document.getElementById(
    "vehicleCard"
);

const vehiclePopup =
document.getElementById(
    "vehiclePopup"
);

const closeVehiclePopup =
document.getElementById(
    "closeVehiclePopup"
);

vehicleCard.addEventListener(
    "click",
    ()=>{

        vehiclePopup.style.display =
        "block";
    }
);

closeVehiclePopup.addEventListener(
    "click",
    ()=>{

        vehiclePopup.style.display =
        "none";
    }
);

/* POLICE */

const policeCard =
document.getElementById(
    "policeCard"
);

const policePopup =
document.getElementById(
    "policePopup"
);

const closePolicePopup =
document.getElementById(
    "closePolicePopup"
);

policeCard.addEventListener(
    "click",
    ()=>{

        policePopup.style.display =
        "block";
    }
);

closePolicePopup.addEventListener(
    "click",
    ()=>{

        policePopup.style.display =
        "none";
    }
);

/* AMBULANCE */

const ambulanceCard =
document.getElementById(
    "ambulanceCard"
);

const ambulancePopup =
document.getElementById(
    "ambulancePopup"
);

const closeAmbulancePopup =
document.getElementById(
    "closeAmbulancePopup"
);

ambulanceCard.addEventListener(
    "click",
    ()=>{

        ambulancePopup.style.display =
        "block";
    }
);

closeAmbulancePopup.addEventListener(
    "click",
    ()=>{

        ambulancePopup.style.display =
        "none";
    }
);

/* SETTINGS */

const settingsBtn =
document.getElementById(
    "settingsBtn"
);

const settingsPopup =
document.getElementById(
    "settingsPopup"
);

const closeSettingsPopup =
document.getElementById(
    "closeSettingsPopup"
);

settingsBtn.addEventListener(
    "click",
    ()=>{

        settingsPopup.style.display =
        "block";
    }
);

closeSettingsPopup.addEventListener(
    "click",
    ()=>{

        settingsPopup.style.display =
        "none";
    }
);

/* CALL POPUP */

const callBtn =
document.getElementById(
    "callBtn"
);

const nearbyPopup =
document.getElementById(
    "nearbyPopup"
);

const closeNearbyPopup =
document.getElementById(
    "closeNearbyPopup"
);

callBtn.addEventListener(
    "click",
    ()=>{

        nearbyPopup.style.display =
        "block";
    }
);

closeNearbyPopup.addEventListener(
    "click",
    ()=>{

        nearbyPopup.style.display =
        "none";
    }
);

/* DARK MODE */

const themeToggle =
document.getElementById(
    "themeToggle"
);

let darkMode = true;

themeToggle.addEventListener(
    "click",
    ()=>{

if(darkMode){

    document.body.style.background =
    "#dfe6e9";

    document.querySelector(
        ".phone"
    ).style.background =
    "#f5f6fa";

    document.querySelector(
        ".phone"
    ).style.color =
    "black";

    document.querySelectorAll(".card p")

    .forEach(text=>{

        text.style.color =
        "black";

    });

    themeToggle.innerHTML =
    "Enable";

    darkMode = false;
}

else{

    document.body.style.background =
    "#050816";

    document.querySelector(
        ".phone"
    ).style.background =
    "#091120";

    document.querySelector(
        ".phone"
    ).style.color =
    "white";

    document.querySelectorAll(".card p")

    .forEach(text=>{

        text.style.color =
        "white";

    });

    themeToggle.innerHTML =
    "Disable";

    darkMode = true;
}
    }
);

/* SAVE CONTACT */

const saveContactBtn =
document.getElementById(
    "saveContactBtn"
);

const contactInput =
document.getElementById(
    "contactInput"
);

saveContactBtn.addEventListener(
    "click",
    ()=>{

        const newContact =
        contactInput.value.trim();

        if(newContact !== ""){

            localStorage.setItem(
                "emergencyContact",
                newContact
            );

            emergencyNumber =
            newContact;

            savedEmergencyContact.innerHTML =

            "📞 " +
            emergencyNumber;

            showToast(
                "✅ Emergency Contact Saved"
            );

            contactInput.value =
            "";
        }
    }
);

/* LIVE TIME */

const liveTime =
document.getElementById(
    "liveTime"
);

function updateTime(){

    const now =
    new Date();

    let hours =
    now.getHours();

    let minutes =
    now.getMinutes();

    if(minutes < 10){

        minutes =
        "0" + minutes;
    }

    liveTime.innerHTML =

    hours + ":" + minutes;
}

setInterval(
    updateTime,
    1000
);

updateTime();

/* BATTERY */

const batteryLevel =
document.getElementById(
    "batteryLevel"
);

if(navigator.getBattery){

    navigator.getBattery().then(

        battery=>{

            function updateBattery(){

                let level =

                Math.floor(
                    battery.level * 100
                );

                if(battery.charging){

                    batteryLevel.innerHTML =

                    "⚡ " +
                    level + "%";
                }

                else{

                    batteryLevel.innerHTML =

                    "🔋 " +
                    level + "%";
                }
            }

            updateBattery();

            battery.addEventListener(
                "levelchange",
                updateBattery
            );

            battery.addEventListener(
                "chargingchange",
                updateBattery
            );
        }
    );
}

/* LOADING SCREEN */

window.addEventListener(
    "load",
    ()=>{

        const loadingScreen =
        document.getElementById(
            "loadingScreen"
        );

        setTimeout(()=>{

            loadingScreen.style.opacity =
            "0";

            setTimeout(()=>{

                loadingScreen.style.display =
                "none";

            },500);

            showToast(
                "✅ Emergency System Ready"
            );

        },2200);
    }
);