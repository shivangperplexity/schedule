// In real setup: replace with Netlify Identity + Git Gateway API
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const loginSection = document.getElementById("login-section");
  const eventsSection = document.getElementById("events-section");
  const eventList = document.getElementById("event-list");
  const form = document.getElementById("event-form");

  let events = [];

  // Dummy Login
  loginBtn.addEventListener("click", () => {
    loginSection.style.display = "none";
    eventsSection.style.display = "block";
    loadEvents();
  });

  // Load Events
  function loadEvents() {
    events = [
      { id: 1, title: "पहिला कार्यक्रम", date: "2025-09-15", place: "पुणे", description: "मोठा सभा", map: "#" },
      { id: 2, title: "दुसरा कार्यक्रम", date: "2025-09-18", place: "मुंबई", description: "भेट व संवाद", map: "#" }
    ];
    renderEvents();
  }

  function renderEvents() {
    eventList.innerHTML = "";
    events.forEach(ev => {
      const li = document.createElement("li");
      li.innerHTML = `
        <b>${ev.title}</b> (${ev.date}) - ${ev.place}
        <button onclick="editEvent(${ev.id})">✏️</button>
        <button onclick="deleteEvent(${ev.id})">🗑</button>
      `;
      eventList.appendChild(li);
    });
  }

  // Form Submit
  form.addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("event-id").value;
    const newEvent = {
      id: id ? Number(id) : Date.now(),
      title: document.getElementById("title").value,
      date: document.getElementById("date").value,
      place: document.getElementById("place").value,
      map: document.getElementById("map").value,
      description: document.getElementById("description").value,
    };

    if (id) {
      // Update
      events = events.map(ev => ev.id === Number(id) ? newEvent : ev);
    } else {
      // Add
      events.push(newEvent);
    }

    form.reset();
    document.getElementById("event-id").value = "";
    renderEvents();
  });

  // Expose edit/delete
  window.editEvent = id => {
    const ev = events.find(e => e.id === id);
    document.getElementById("event-id").value = ev.id;
    document.getElementById("title").value = ev.title;
    document.getElementById("date").value = ev.date;
    document.getElementById("place").value = ev.place;
    document.getElementById("map").value = ev.map;
    document.getElementById("description").value = ev.description;
  };

  window.deleteEvent = id => {
    events = events.filter(ev => ev.id !== id);
    renderEvents();
  };
});
