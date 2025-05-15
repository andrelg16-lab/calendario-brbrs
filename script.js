let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let currentUser = null;

const users = {
  "alopez": "directiva2527",
  "mdhernandez": "directiva2527"
};

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (users[username] === password) {
    currentUser = username;
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("calendarScreen").style.display = "block";
    renderCalendar();
    loadGeneralNote();
  } else {
    document.getElementById("errorMsg").textContent = "Usuario o contraseña incorrectos.";
  }
}

function renderCalendar() {
  const daysContainer = document.getElementById("days");
  daysContainer.innerHTML = "";
  const monthYear = document.getElementById("monthYear");
  const date = new Date(currentYear, currentMonth, 1);
  const monthName = date.toLocaleString("es-ES", { month: "long" });
  monthYear.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${currentYear}`;
  
  const firstDay = date.getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    daysContainer.appendChild(empty);
  }

  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement("div");
    cell.classList.add("day");
    if (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      cell.classList.add("today");
    }
    cell.textContent = d;
    cell.onclick = () => selectDay(d);
    daysContainer.appendChild(cell);
  }
}

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
  document.getElementById("selectedDate").textContent = "Selecciona un día";
  document.getElementById("noteInput").value = "";
  document.getElementById("lastEditedInfo").textContent = "";
}

function selectDay(day) {
  selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  document.getElementById("selectedDate").textContent = `Notas para el ${selectedDate}`;
  const saved = JSON.parse(localStorage.getItem("notes") || "{}");
  document.getElementById("noteInput").value = saved[selectedDate]?.text || "";
  document.getElementById("lastEditedInfo").textContent = saved[selectedDate]?.user ? `Último cambio por ${saved[selectedDate].user}` : "";
}

function saveNote() {
  if (!selectedDate) return alert("Selecciona un día");
  const notes = JSON.parse(localStorage.getItem("notes") || "{}");
  notes[selectedDate] = {
    text: document.getElementById("noteInput").value,
    user: currentUser
  };
  localStorage.setItem("notes", JSON.stringify(notes));
  document.getElementById("lastEditedInfo").textContent = `Último cambio por ${currentUser}`;
}

function saveGeneralNote() {
  const general = {
    text: document.getElementById("generalNote").value,
    user: currentUser
  };
  localStorage.setItem("generalNote", JSON.stringify(general));
  document.getElementById("lastGeneralEditedInfo").textContent = `Último cambio por ${currentUser}`;
}

function loadGeneralNote() {
  const general = JSON.parse(localStorage.getItem("generalNote") || "{}");
  document.getElementById("generalNote").value = general.text || "";
  document.getElementById("lastGeneralEditedInfo").textContent = general.user ? `Último cambio por ${general.user}` : "";
}
// Permitir login con Enter
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && document.getElementById("loginScreen").style.display !== "none") {
    login();
  }
});
