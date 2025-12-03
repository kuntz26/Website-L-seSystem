let doors = [
    { id: 1, name: "Hoveddør", locked: true },
    { id: 2, name: "Bagdør", locked: false }
];

let selectedDoor = 0; // første dør i listen

// Når siden loader
window.onload = () => {
    loadDoors();
    updateUI();
};

function loadDoors() {
    const select = document.getElementById("doorSelect");
    doors.forEach((door, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.innerText = door.name;
        select.appendChild(option);
    });
}

function updateUI() {
    const door = doors[selectedDoor];

    // Opdater top bar
    document.getElementById("doorState").innerText =
        door.locked ? "Låst 🔒" : "Ulåst 🔓";

    // Opdater knap
    const btn = document.getElementById("lockBtn");
    btn.innerText = door.locked ? "Lås op" : "Lås";
    btn.className = door.locked ? "locked" : "unlocked";
}

function toggleLock() {
    // Skift tilstand
    doors[selectedDoor].locked = !doors[selectedDoor].locked;

    // Opdater UI
    updateUI();

    // Her kan du sende API-kald til din ESP32 / server
    console.log("Door " + doors[selectedDoor].name + " toggled");
}

function changeDoor() {
    selectedDoor = document.getElementById("doorSelect").value;
    updateUI();
}

function changeEmail() {
    const mail = document.getElementById("emailSelect").value;
    console.log("2FA email changed to: " + mail);

    // Her opdaterer du email i databasen eller API
}
// DIN BACKEND URL
const backendUrl = "http://localhost:5242";

// Check om backend er tilgængelig
async function callBackend(endpoint, data) {
    try {
        const response = await fetch(`${backendUrl}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Backend returned an error");

        return await response.json();
    }
    catch (e) {
        console.log("Backend ikke tilgængelig → GitHub fallback aktiveret");
        return null;
    }
}

// SEND 2FA KODE
async function send2FA() {
    const mail = document.getElementById("emailSelect").value;

    const result = await callBackend("/api/send", { email: mail });

    if (result) {
        alert("RIGTIG 2FA kode sendt til " + mail);
        showCodePopup();
    } else {
        alert("Backend offline (GitHub-mode): Kode er: 123456");
        fakeCode = "123456";
        showCodePopup();
    }
}

// VERIFICER 2FA KODE
let fakeCode = null;

async function verify2FA() {
    const mail = document.getElementById("emailSelect").value;
    const code = document.getElementById("codeInput").value;

    // Først prøver vi backend
    const result = await callBackend("/api/verify", { email: mail, code: code });

    if (result) {
        alert("Kode korrekt! (RIGTIG backend)");
        closeCodePopup();
        return;
    }

    // GitHub fallback
    if (fakeCode && code === fakeCode) {
        alert("Kode korrekt! (GITHUB mode)");
        closeCodePopup();
    } else {
        alert("Forkert kode!");
    }
}

// Popup kontrol
function showCodePopup() {
    document.getElementById("codePopup").style.display = "flex";
}

function closeCodePopup() {
    document.getElementById("codePopup").style.display = "none";
}
