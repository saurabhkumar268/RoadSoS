/* =============================================
   ROADSOS — script.js  (v1.0)
   ============================================= */

/* ─── ELEMENTS ─── */
const sosBtn                = document.getElementById("sosBtn");
const popupOverlay          = document.getElementById("popupOverlay");
const closePopup            = document.getElementById("closePopup");
const locationText          = document.getElementById("locationText");
const mapLink               = document.getElementById("mapLink");
const hospitalLink          = document.getElementById("hospitalLink");
const toast                 = document.getElementById("toast");
const sirenSound            = document.getElementById("sirenSound");
const flashScreen           = document.getElementById("flashScreen");
const savedEmergencyContact = document.getElementById("savedEmergencyContact");
const whatsappAlert         = document.getElementById("whatsappAlert");
const smsAlert              = document.getElementById("smsAlert");
const noContactWarning      = document.getElementById("noContactWarning");
const sosStatusText         = document.getElementById("sosStatusText");

/* ─── NETWORK STATUS ─── */
function updateNetworkStatus() {
    const statusEl = document.getElementById("networkStatus");
    const phone    = document.querySelector(".phone");

    if (navigator.onLine) {
        statusEl.innerHTML = '<span class="status-dot"></span> Online';
        statusEl.style.cssText = 'color:var(--green); border-color:var(--green-border); background:var(--green-subtle)';
        phone.classList.remove("offline-mode");
    } else {
        statusEl.innerHTML = '<span class="status-dot"></span> Offline';
        statusEl.style.cssText = 'color:var(--red); border-color:var(--red-border); background:var(--red-subtle)';
        phone.classList.add("offline-mode");
    }
}
window.addEventListener("online",  updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
updateNetworkStatus();

/* ─── TOAST ─── */
function showToast(message) {
    toast.textContent   = message;
    toast.style.top     = "25px";
    toast.style.opacity = "1";
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.top     = "-80px";
        toast.style.opacity = "0";
    }, 3200);
}

/* ─── LOAD SAVED CONTACT ─── */
let emergencyNumber = localStorage.getItem("emergencyContact") || "";
if (emergencyNumber) {
    savedEmergencyContact.textContent = "📞 " + emergencyNumber;
}

/* ─── CLOSE SOS HELPER ─── */
function closeSOS() {
    popupOverlay.style.display = "none";
    sirenSound.pause();
    sirenSound.currentTime = 0;
}

/* ══════════════════════════════════════════
   SOS FUNCTION
   ══════════════════════════════════════════ */
function activateSOS() {
    if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);

    popupOverlay.style.display = "flex";
    popupOverlay.scrollTop = 0;

    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);

    showToast("🚨 SOS Activated — Fetching Location...");

    sirenSound.currentTime = 0;
    sirenSound.play().catch(() => {});

    flashScreen.style.display = "block";
    flashScreen.classList.add("flash-active");
    setTimeout(() => {
        flashScreen.classList.remove("flash-active");
        flashScreen.style.display = "none";
    }, 1900);

    /* RESET UI */
    locationText.innerHTML = '<span class="loc-ping"></span> 📍 Fetching Live Location...';
    sosStatusText.textContent = "Fetching your location...";
    mapLink.style.display      = "none";
    hospitalLink.style.display = "none";
    whatsappAlert.style.display = "none";
    smsAlert.style.display      = "none";
    noContactWarning.style.display = "none";

    if (!emergencyNumber) {
        noContactWarning.style.display = "block";
    }

    if (!navigator.geolocation) {
        locationText.innerHTML = "❌ Geolocation not supported on this device";
        sosStatusText.textContent = "Location unavailable";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat      = position.coords.latitude.toFixed(6);
            const lng      = position.coords.longitude.toFixed(6);
            const accuracy = Math.round(position.coords.accuracy);
            const mapsUrl  = `https://maps.google.com/?q=${lat},${lng}`;

            locationText.innerHTML =
                `<span class="loc-ping"></span>
                 <div style="display:flex;flex-direction:column;gap:6px;width:100%;">
                   <div style="display:flex;align-items:center;gap:10px;flex-wrap:nowrap;">
                     <span style="opacity:0.6;font-size:10px;letter-spacing:1px;min-width:24px;">LAT</span>
                     <strong style="font-size:13px;letter-spacing:0.5px;">${lat}</strong>
                     <span style="opacity:0.3;margin:0 2px;">|</span>
                     <span style="opacity:0.6;font-size:10px;letter-spacing:1px;min-width:24px;">LNG</span>
                     <strong style="font-size:13px;letter-spacing:0.5px;">${lng}</strong>
                   </div>
                   <div style="opacity:0.55;font-size:11px;letter-spacing:0.5px;">📡 Accuracy: ~${accuracy}m</div>
                 </div>`;

            sosStatusText.textContent = "✅ Location captured!";

            mapLink.href = mapsUrl;
            mapLink.style.display = "block";

            hospitalLink.href = `https://www.google.com/maps/search/hospitals/@${lat},${lng},15z`;
            hospitalLink.style.display = "block";

            if (emergencyNumber) {
                const waNumber = emergencyNumber.startsWith("+")
                    ? emergencyNumber.replace("+", "")
                    : emergencyNumber.length === 10
                        ? "91" + emergencyNumber
                        : emergencyNumber;

                const waMsg = `🚨 *EMERGENCY ALERT!*\n\nI need urgent help! 🆘\n\n📍 *My Live Location:*\n${mapsUrl}\n\nCoords: ${lat}, ${lng}\n\nPlease call me or send help immediately!\n\n_Sent via RoadSoS Emergency App_`;

                if (navigator.onLine) {
                    whatsappAlert.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;
                    whatsappAlert.style.display = "block";
                    showToast("✅ Tap WhatsApp to alert your contact!");
                } else {
                    const smsMsg = `🚨 EMERGENCY! My location: ${mapsUrl} | Coords: ${lat},${lng}`;
                    smsAlert.href = `sms:${emergencyNumber}?body=${encodeURIComponent(smsMsg)}`;
                    smsAlert.style.display = "block";
                    showToast("📵 Offline — SMS ready to send");
                }
            }

            if (
                navigator.onLine &&
                typeof Notification !== "undefined" &&
                Notification.permission === "granted"
            ) {
                try {
                    new Notification("🚨 Emergency Alert", {
                        body: `Location: ${lat}, ${lng} (accuracy ~${accuracy}m)`,
                        icon: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
                    });
                } catch (e) {}
            }
        },
        (error) => {
            let errMsg = "❌ Unable to fetch location";
            if (error.code === 1) errMsg = "❌ Permission denied — allow location in browser";
            if (error.code === 2) errMsg = "❌ GPS unavailable — try outdoors";
            if (error.code === 3) errMsg = "❌ Timed out — tap SOS again";
            locationText.innerHTML = `<span class="loc-ping"></span> ${errMsg}`;
            sosStatusText.textContent = "Location error";
            showToast("⚠️ " + errMsg);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
}

/* ─── SOS BUTTON ─── */
sosBtn.addEventListener("click", activateSOS);

/* ─── CLOSE SOS ─── */
closePopup.addEventListener("click", closeSOS);
popupOverlay.addEventListener("click", e => {
    if (e.target === popupOverlay) closeSOS();
});

/* ─── CARD MODALS ─── */
const modalPairs = [
    ["firstAidCard",   "firstAidPopup",   "closeAidPopup"],
    ["vehicleCard",    "vehiclePopup",    "closeVehiclePopup"],
    ["policeCard",     "policePopup",     "closePolicePopup"],
    ["ambulanceCard",  "ambulancePopup",  "closeAmbulancePopup"],
    ["settingsBtn",    "settingsPopup",   "closeSettingsPopup"],
    ["callBtn",        "nearbyPopup",     "closeNearbyPopup"],
];

modalPairs.forEach(([openId, popupId, closeId]) => {
    const popup = document.getElementById(popupId);
    document.getElementById(openId).addEventListener("click", () => {
        popup.style.display = "block";
    });
    document.getElementById(closeId).addEventListener("click", () => {
        popup.style.display = "none";
    });
    popup.addEventListener("click", e => {
        if (e.target === popup) popup.style.display = "none";
    });
});

/* ─── DARK / LIGHT MODE ─── */
const themeToggle = document.getElementById("themeToggle");
const themeLabel  = document.getElementById("themeLabel");
let isDark = true;

themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    document.body.classList.toggle("light-mode", !isDark);
    themeToggle.textContent = isDark ? "Disable" : "Enable";
    if (themeLabel) themeLabel.textContent = isDark ? "Dark" : "Light";
    showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
});

/* ─── SAVE CONTACT ─── */
const saveContactBtn = document.getElementById("saveContactBtn");
const contactInput   = document.getElementById("contactInput");

saveContactBtn.addEventListener("click", () => {
    const num = contactInput.value.trim();
    if (!/^\d{7,15}$/.test(num)) {
        showToast("⚠️ Enter a valid number (digits only)");
        return;
    }
    localStorage.setItem("emergencyContact", num);
    emergencyNumber = num;
    savedEmergencyContact.textContent = "📞 " + emergencyNumber;
    contactInput.value = "";
    showToast("✅ Contact Saved: " + num);
    noContactWarning.style.display = "none";
});

contactInput.addEventListener("keydown", e => {
    if (e.key === "Enter") saveContactBtn.click();
});

/* ─── LIVE TIME ─── */
function updateTime() {
    const now = new Date();
    document.getElementById("liveTime").textContent =
        `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
}
setInterval(updateTime, 1000);
updateTime();

/* ─── BATTERY ─── */
if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
        function refreshBattery() {
            const pct = Math.floor(battery.level * 100);
            document.getElementById("batteryLevel").textContent =
                battery.charging ? `⚡ ${pct}%` : `🔋 ${pct}%`;
        }
        refreshBattery();
        battery.addEventListener("levelchange",    refreshBattery);
        battery.addEventListener("chargingchange", refreshBattery);
    }).catch(() => {});
}

/* ─── NOTIFICATION PERMISSION ─── */
if (typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
}

/* ─── LOADING SCREEN ─── */
window.addEventListener("load", () => {
    setTimeout(() => {
        const ls = document.getElementById("loadingScreen");
        if (!ls) return;
        ls.style.opacity = "0";
        setTimeout(() => {
            ls.style.display = "none";
            showToast("✅ Emergency System Ready");
        }, 600);
    }, 2400);
});