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
