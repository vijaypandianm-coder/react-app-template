import {  useState } from "react";

const API_BASE = "http://localhost:5169"; // change number to your backend URL

function App() {
  const [date, setDate] = useState("2025-09-12");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("10:00");
  const [items, setItems] = useState([]);

  async function load() {
    const res = await fetch(`${API_BASE}/api/appointments?date=${date}`);
    const data = await res.json();
    setItems(data);
  }

  async function add() {
    const body = { title, date, time };
    await fetch(`${API_BASE}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setTitle("");
    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Calendar</h2>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <br /><br />

      <input type="text" placeholder="Title" value={title}
        onChange={e => setTitle(e.target.value)} />
      <input type="time" value={time}
        onChange={e => setTime(e.target.value)} />
      <button onClick={add}>Add</button>

      <h3>Appointments:</h3>
      <ul>
        {items.map(a => (
          <li key={a.id}>{a.time} - {a.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;