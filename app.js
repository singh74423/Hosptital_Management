// app.js - Doctor Dashboard Application (Updated with robust login handling)

/* ======= Data Storage and API Simulation ======= */
class DataStore {
  constructor() {
    this.data = {
      doctors: [
        { id: 1, name: "Dr. Alice", specialty: "Cardiology" },
        { id: 2, name: "Dr. Bob", specialty: "Neurology" }
      ],
      patients: [
        {
          id: 1,
          name: "John Doe",
          age: 45,
          gender: "Male",
          condition: "Hypertension",
          status: "Recovered",
          notes: "Stable",
          admissionDate: "2025-07-15",
          doctorId: 1
        },
        {
          id: 2,
          name: "Jane Smith",
          age: 60,
          gender: "Female",
          condition: "Stroke",
          status: "In Operation",
          notes: "Under observation",
          admissionDate: "2025-07-20",
          doctorId: 2
        }
      ],
      appointments: [
        {
          id: 1,
          patientId: 1,
          doctorId: 1,
          title: "Follow-up",
          start: "2025-07-25T09:00",
          end: "2025-07-25T09:30"
        },
        {
          id: 2,
          patientId: 2,
          doctorId: 2,
          title: "Consultation",
          start: "2025-07-26T10:00",
          end: "2025-07-26T10:30"
        }
      ],
      trainings: [
        {
          id: 1,
          topic: "Medical Training with Dr. Richard",
          date: "2025-08-01",
          status: "Upcoming"
        }
      ]
    };

    this.currentUser = null;
    this.listeners = [];
  }

  // Simulate async latency
  async delay(ms = 100) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* ======= Authentication ======= */
  async login(email, password) {
    await this.delay();
    // Allow any email with password "password" for demo purposes
    if (password === "password") {
      this.currentUser = { id: 1, name: "Dr. Alice", email };
      return { token: "mock-jwt-token", user: this.currentUser };
    }
    throw new Error("Invalid credentials");
  }

  logout() {
    this.currentUser = null;
  }

  /* ======= Statistics ======= */
  getStatistics() {
    return {
      totalPatients: this.data.patients.length,
      recovered: this.data.patients.filter((p) => p.status === "Recovered").length,
      operation: this.data.patients.filter((p) => p.status === "In Operation").length,
      monthlyAdmissions: [20, 25, 18, 30, 28, 22, 27, 35, 31, 29, 26, 24]
    };
  }

  /* ======= CRUD Operations ======= */
  async getPatients() {
    await this.delay();
    return [...this.data.patients];
  }

  async addPatient(patient) {
    await this.delay();
    const newId = Math.max(0, ...this.data.patients.map((p) => p.id)) + 1;
    const newPatient = {
      ...patient,
      id: newId,
      admissionDate: new Date().toISOString().split("T")[0]
    };
    this.data.patients.push(newPatient);
    this.notifyListeners();
    return newPatient;
  }

  async updatePatient(id, updates) {
    await this.delay();
    const idx = this.data.patients.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.patients[idx] = { ...this.data.patients[idx], ...updates };
      this.notifyListeners();
      return this.data.patients[idx];
    }
    throw new Error("Patient not found");
  }

  async deletePatient(id) {
    await this.delay();
    this.data.patients = this.data.patients.filter((p) => p.id !== id);
    this.notifyListeners();
  }

  async getAppointments() {
    await this.delay();
    return [...this.data.appointments];
  }

  async addAppointment(appointment) {
    await this.delay();
    const newId = Math.max(0, ...this.data.appointments.map((a) => a.id)) + 1;
    const newAppointment = { ...appointment, id: newId };
    this.data.appointments.push(newAppointment);
    this.notifyListeners();
    return newAppointment;
  }

  async deleteAppointment(id) {
    await this.delay();
    this.data.appointments = this.data.appointments.filter((a) => a.id !== id);
    this.notifyListeners();
  }

  async getTrainings() {
    await this.delay();
    return [...this.data.trainings];
  }

  async addTraining(training) {
    await this.delay();
    const newId = Math.max(0, ...this.data.trainings.map((t) => t.id)) + 1;
    const newTraining = { ...training, id: newId, status: "Upcoming" };
    this.data.trainings.push(newTraining);
    this.notifyListeners();
    return newTraining;
  }

  async updateTraining(id, updates) {
    await this.delay();
    const idx = this.data.trainings.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.data.trainings[idx] = { ...this.data.trainings[idx], ...updates };
      this.notifyListeners();
      return this.data.trainings[idx];
    }
    throw new Error("Training not found");
  }

  getDoctors() {
    return [...this.data.doctors];
  }

  /* ======= Export / Import ======= */
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    this.data = { ...this.data, ...parsed };
    this.notifyListeners();
  }

  /* ======= Reactive listeners ======= */
  addListener(cb) {
    this.listeners.push(cb);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }
}

/* ======= Global State ======= */
const dataStore = new DataStore();
let currentPage = "dashboard";
let currentMonth = new Date();
let currentTheme = "light";

/* ======= App Bootstrapping ======= */
window.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  setupDataListeners();
  showLoginScreen();
}

function setupEventListeners() {
  /* --- Auth --- */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", handleLogout);

  /* --- Sidebar & Navigation --- */
  const sidebarToggle = document.getElementById("sidebar-toggle");
  sidebarToggle?.addEventListener("click", toggleSidebar);

  document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  /* --- Patients --- */
  document.getElementById("add-patient-btn")?.addEventListener("click", () => openPatientModal());
  document.getElementById("patient-form")?.addEventListener("submit", handlePatientSubmit);

  /* --- Appointments --- */
  document.getElementById("new-appointment-btn")?.addEventListener("click", () => openAppointmentModal());
  document.getElementById("appointment-form")?.addEventListener("submit", handleAppointmentSubmit);

  /* --- Training --- */
  document.getElementById("add-training-btn")?.addEventListener("click", () => openTrainingModal());
  document.getElementById("training-form")?.addEventListener("submit", handleTrainingSubmit);

  /* --- Modals Close --- */
  document.querySelectorAll(".modal-close, [id^='cancel-']").forEach((btn) => {
    btn.addEventListener("click", closeModals);
  });

  /* --- Filter Chips --- */
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", handleFilterChip);
  });

  /* --- Settings --- */
  document.getElementById("theme-selector")?.addEventListener("change", handleThemeChange);
  document.getElementById("export-data-btn")?.addEventListener("click", handleDataExport);
  document.getElementById("import-data-btn")?.addEventListener("click", () => document.getElementById("import-file").click());
  document.getElementById("import-file")?.addEventListener("change", handleDataImport);

  /* --- Calendar navigation --- */
  document.getElementById("prev-month")?.addEventListener("click", () => navigateMonth(-1));
  document.getElementById("next-month")?.addEventListener("click", () => navigateMonth(1));

  /* --- Global Search --- */
  document.getElementById("global-search")?.addEventListener("input", handleGlobalSearch);

  /* --- Training banner quick action --- */
  document.getElementById("add-to-schedule-btn")?.addEventListener("click", () => {
    showPage("training");
    openTrainingModal();
  });
}

function setupDataListeners() {
  dataStore.addListener(() => {
    updateStatistics();
    if (currentPage === "patients") renderPatientsTable();
    if (currentPage === "appointments") renderCalendar();
    if (currentPage === "training") renderTrainingList();
    if (currentPage === "analytics") renderAnalytics();
  });
}

/* ======= Auth Handlers ======= */
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await dataStore.login(email, password);
    showMainApp();
    updateStatistics();
    populateDropdowns();
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

function handleLogout() {
  dataStore.logout();
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("main-app").classList.add("hidden");
}

function showMainApp() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("main-app").classList.remove("hidden");
  showPage("dashboard");
}

/* ======= Navigation ======= */
function handleNavigation(e) {
  e.preventDefault();
  const page = e.currentTarget.getAttribute("data-page");
  showPage(page);
}

function showPage(page) {
  currentPage = page;

  document.querySelectorAll(".nav-item").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-page") === page);
  });

  document.querySelectorAll(".page").forEach((pg) => pg.classList.remove("active"));
  document.getElementById(`${page}-page`).classList.add("active");

  switch (page) {
    case "patients":
      renderPatientsTable();
      break;
    case "appointments":
      renderCalendar();
      break;
    case "training":
      renderTrainingList();
      break;
    case "analytics":
      renderAnalytics();
      break;
  }
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

/* ======= Dashboard Statistics ======= */
function updateStatistics() {
  const stats = dataStore.getStatistics();
  document.getElementById("total-patients").textContent = stats.totalPatients;
  document.getElementById("patients-recovered").textContent = stats.recovered;
  document.getElementById("patients-operation").textContent = stats.operation;
}

/* ======= Patient Management ======= */
function populateDropdowns() {
  const doctors = dataStore.getDoctors();

  // Doctor select in patient modal
  const patDocSelect = document.getElementById("patient-doctor");
  patDocSelect.innerHTML = '<option value="">Select Doctor</option>';
  doctors.forEach((d) => {
    patDocSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });

  // Doctor select in appointment modal
  const aptDocSelect = document.getElementById("appointment-doctor");
  aptDocSelect.innerHTML = '<option value="">Select Doctor</option>';
  doctors.forEach((d) => {
    aptDocSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
}

async function renderPatientsTable() {
  const patients = await dataStore.getPatients();
  const doctors = dataStore.getDoctors();
  const tbody = document.getElementById("patients-table-body");
  tbody.innerHTML = "";

  patients.forEach((p) => {
    const doctor = doctors.find((d) => d.id === p.doctorId);
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.condition}</td>
        <td><span class="status status--${statusClass(p.status)}">${p.status}</span></td>
        <td>${p.admissionDate}</td>
        <td>${doctor ? doctor.name : "N/A"}</td>
        <td>
          <button class="btn btn--outline btn--sm" onclick="editPatient(${p.id})">Edit</button>
          <button class="btn btn--outline btn--sm" onclick="deletePatient(${p.id})">Delete</button>
        </td>
      </tr>`;
  });

  // Update patient dropdown in appointment modal
  const patSelect = document.getElementById("appointment-patient");
  patSelect.innerHTML = '<option value="">Select Patient</option>';
  patients.forEach((p) => {
    patSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });
}

function statusClass(status) {
  switch (status) {
    case "Recovered":
      return "success";
    case "In Operation":
      return "warning";
    default:
      return "info";
  }
}

function openPatientModal(patient = null) {
  const modal = document.getElementById("patient-modal");
  const form = document.getElementById("patient-form");
  const titleEl = document.getElementById("patient-modal-title");

  if (patient) {
    titleEl.textContent = "Edit Patient";
    form.dataset.editId = patient.id;
    document.getElementById("patient-name").value = patient.name;
    document.getElementById("patient-age").value = patient.age;
    document.getElementById("patient-gender").value = patient.gender;
    document.getElementById("patient-condition").value = patient.condition;
    document.getElementById("patient-status").value = patient.status;
    document.getElementById("patient-doctor").value = patient.doctorId;
    document.getElementById("patient-notes").value = patient.notes || "";
  } else {
    titleEl.textContent = "Add Patient";
    form.reset();
    delete form.dataset.editId;
  }

  modal.classList.remove("hidden");
}

async function handlePatientSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const patientData = {
    name: document.getElementById("patient-name").value,
    age: parseInt(document.getElementById("patient-age").value, 10),
    gender: document.getElementById("patient-gender").value,
    condition: document.getElementById("patient-condition").value,
    status: document.getElementById("patient-status").value,
    doctorId: parseInt(document.getElementById("patient-doctor").value, 10),
    notes: document.getElementById("patient-notes").value
  };

  try {
    if (form.dataset.editId) {
      await dataStore.updatePatient(parseInt(form.dataset.editId, 10), patientData);
    } else {
      await dataStore.addPatient(patientData);
    }
    closeModals();
  } catch (err) {
    alert("Error saving patient: " + err.message);
  }
}

async function editPatient(id) {
  const patients = await dataStore.getPatients();
  const patient = patients.find((p) => p.id === id);
  if (patient) openPatientModal(patient);
}

async function deletePatient(id) {
  if (confirm("Delete this patient?")) {
    try {
      await dataStore.deletePatient(id);
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  }
}

window.editPatient = editPatient;
window.deletePatient = deletePatient;

function handleFilterChip(e) {
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  e.target.classList.add("active");
  filterPatientsTable(e.target.dataset.filter);
}

async function filterPatientsTable(filter) {
  const all = await dataStore.getPatients();
  const list = filter === "all" ? all : all.filter((p) => p.status === filter);
  const doctors = dataStore.getDoctors();
  const tbody = document.getElementById("patients-table-body");
  tbody.innerHTML = "";
  list.forEach((p) => {
    const doctor = doctors.find((d) => d.id === p.doctorId);
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.condition}</td>
        <td><span class="status status--${statusClass(p.status)}">${p.status}</span></td>
        <td>${p.admissionDate}</td>
        <td>${doctor ? doctor.name : "N/A"}</td>
        <td>
          <button class="btn btn--outline btn--sm" onclick="editPatient(${p.id})">Edit</button>
          <button class="btn btn--outline btn--sm" onclick="deletePatient(${p.id})">Delete</button>
        </td>
      </tr>`;
  });
}

/* ======= Appointment Management ======= */
async function renderCalendar() {
  const appointments = await dataStore.getAppointments();
  const patients = await dataStore.getPatients();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  document.getElementById("current-month").textContent = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  // Add weekday headers
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
    const h = document.createElement("div");
    h.textContent = day;
    h.style.fontWeight = "bold";
    h.style.textAlign = "center";
    h.style.padding = "8px";
    grid.appendChild(h);
  });

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.innerHTML = `<div>${date.getDate()}</div>`;

    appointments
      .filter((apt) => new Date(apt.start).toDateString() === date.toDateString())
      .forEach((apt) => {
        const patient = patients.find((p) => p.id === apt.patientId);
        const ev = document.createElement("div");
        ev.className = "calendar-event";
        ev.textContent = `${apt.title} – ${patient ? patient.name : "Unknown"}`;
        ev.onclick = () => deleteAppointment(apt.id);
        cell.appendChild(ev);
      });

    grid.appendChild(cell);
  }
}

function navigateMonth(offset) {
  currentMonth.setMonth(currentMonth.getMonth() + offset);
  renderCalendar();
}

function openAppointmentModal() {
  document.getElementById("appointment-form").reset();
  document.getElementById("appointment-modal").classList.remove("hidden");
}

async function handleAppointmentSubmit(e) {
  e.preventDefault();
  const patientId = parseInt(document.getElementById("appointment-patient").value, 10);
  const doctorId = parseInt(document.getElementById("appointment-doctor").value, 10);
  const date = document.getElementById("appointment-date").value;
  const time = document.getElementById("appointment-time").value;
  const title = document.getElementById("appointment-title").value;

  try {
    await dataStore.addAppointment({
      patientId,
      doctorId,
      title,
      start: `${date}T${time}`,
      end: `${date}T${time}`
    });
    closeModals();
  } catch (err) {
    alert("Error scheduling: " + err.message);
  }
}

async function deleteAppointment(id) {
  if (confirm("Delete this appointment?")) {
    try {
      await dataStore.deleteAppointment(id);
    } catch (err) {
      alert("Error deleting appointment: " + err.message);
    }
  }
}

window.deleteAppointment = deleteAppointment;

/* ======= Training ======= */
async function renderTrainingList() {
  const list = await dataStore.getTrainings();
  const container = document.getElementById("training-list");
  container.innerHTML = "";

  list.forEach((t) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card__body flex justify-between items-center">
        <div>
          <h4>${t.topic}</h4>
          <p>Date: ${t.date}</p>
          <span class="status status--${t.status === "Completed" ? "success" : "info"}">${t.status}</span>
        </div>
        <div>
          ${
            t.status === "Upcoming"
              ? `<button class="btn btn--primary btn--sm" onclick="markTrainingCompleted(${t.id})">Mark Completed</button>`
              : "✓ Completed"
          }
        </div>
      </div>`;
    container.appendChild(card);
  });
}

function openTrainingModal() {
  document.getElementById("training-form").reset();
  document.getElementById("training-modal").classList.remove("hidden");
}

async function handleTrainingSubmit(e) {
  e.preventDefault();
  const topic = document.getElementById("training-topic").value;
  const date = document.getElementById("training-date").value;
  try {
    await dataStore.addTraining({ topic, date });
    closeModals();
  } catch (err) {
    alert("Error adding training: " + err.message);
  }
}

async function markTrainingCompleted(id) {
  try {
    await dataStore.updateTraining(id, { status: "Completed" });
  } catch (err) {
    alert("Error updating training: " + err.message);
  }
}

window.markTrainingCompleted = markTrainingCompleted;

/* ======= Analytics ======= */
function renderAnalytics() {
  renderAdmissionsChart();
  renderStatusChart();
}

function renderAdmissionsChart() {
  const ctx = document.getElementById("admissions-chart").getContext("2d");
  const stats = dataStore.getStatistics();
  if (window._admissionsChart) window._admissionsChart.destroy();
  window._admissionsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Admissions",
          data: stats.monthlyAdmissions,
          borderColor: "#1FB8CD",
          backgroundColor: "rgba(31,184,205,0.1)",
          tension: 0.4
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function renderStatusChart() {
  const ctx = document.getElementById("status-chart").getContext("2d");
  const stats = dataStore.getStatistics();
  if (window._statusChart) window._statusChart.destroy();
  window._statusChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Recovered", "In Operation", "Under Treatment"],
      datasets: [
        {
          data: [
            stats.recovered,
            stats.operation,
            stats.totalPatients - stats.recovered - stats.operation
          ],
          backgroundColor: ["#1FB8CD", "#FFC185", "#B4413C"]
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

/* ======= Settings ======= */
function handleThemeChange(e) {
  currentTheme = e.target.value;
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else if (currentTheme === "light") {
    document.documentElement.setAttribute("data-color-scheme", "light");
  } else {
    document.documentElement.removeAttribute("data-color-scheme");
  }
}

function handleDataExport() {
  const dataStr = dataStore.exportData();
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "doctor-dashboard-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function handleDataImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      dataStore.importData(evt.target.result);
      alert("Data imported!");
    } catch (err) {
      alert("Invalid JSON");
    }
  };
  reader.readAsText(file);
}

/* ======= Misc ======= */
function closeModals() {
  document.querySelectorAll(".modal").forEach((m) => m.classList.add("hidden"));
}

function handleGlobalSearch(e) {
  const q = e.target.value.toLowerCase();
  if (!q) return;
  dataStore.getPatients().then((patients) => {
    const results = patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q)
    );
    console.log("Search results", results);
  });
}
