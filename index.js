// This will later fetch from events folder (Netlify CMS / GitHub)
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("events-container");

  // Dummy data for now
  const events = [
    { title: "पहिला कार्यक्रम", date: "2025-09-15", place: "पुणे", description: "मोठा सभा", map: "#" },
    { title: "दुसरा कार्यक्रम", date: "2025-09-18", place: "मुंबई", description: "भेट व संवाद", map: "#" }
  ];

  container.innerHTML = "";
  events.forEach(ev => {
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = `
      <h3>${ev.title}</h3>
      <p><b>तारीख:</b> ${ev.date}</p>
      <p><b>ठिकाण:</b> ${ev.place}</p>
      <p>${ev.description}</p>
      <a href="${ev.map}" target="_blank">🗺 नकाशा</a>
    `;
    container.appendChild(div);
  });
});
