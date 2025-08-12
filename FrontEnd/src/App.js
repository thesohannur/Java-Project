import React, { useState } from "react";
import "./App.css";

const roles = ["Donor", "Receiver", "NGO", "Admin"];

const SimpleLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = () => {
    if (!username || !password || !role) {
      alert("Please enter username, password, and select a role.");
      return;
    }
    onLogin({ username, role });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="inputField"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="inputField"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="inputField"
      >
        <option value="">Select Role</option>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button onClick={handleLogin} className="buttonPrimary">
        Login
      </button>
    </div>
  );
};

const DonorDashboard = ({ onLogout, events, donateToEvent }) => {
  const [donorName, setDonorName] = useState("");
  const [donationType, setDonationType] = useState("Money");
  const [donorContact, setDonorContact] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [trackingMessages, setTrackingMessages] = useState([]);

  const handleRegister = () => {
    if (!donorName.trim()) return alert("Enter donor name");
    if (!donationAmount || Number(donationAmount) <= 0)
      return alert("Enter a valid donation amount");
    if (!selectedEvent) return alert("Select an event to contribute to");

    donateToEvent(selectedEvent, Number(donationAmount));

    alert(
      `Donor Registered:
Name: ${donorName}
Donation Type: ${donationType}
Contact: ${donorContact}
Amount: ${donationAmount}
Event: ${selectedEvent}
Message: ${donationMessage || "(No message)"}`
    );

    setTrackingMessages([
      `Your donation has reached ${selectedEvent}.`,
      `Your donation helped families in affected areas.`,
    ]);

    setDonorName("");
    setDonationType("Money");
    setDonorContact("");
    setDonationAmount("");
    setDonationMessage("");
    setSelectedEvent("");
  };

  return (
    <div className="container">
      <h2>Donor Dashboard</h2>
      <input
        placeholder="Name"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
        className="inputField"
      />
      <select
        value={donationType}
        onChange={(e) => setDonationType(e.target.value)}
        className="inputField"
      >
        <option value="Money">Money</option>
        <option value="Food">Food</option>
        <option value="Clothes">Clothes</option>
        <option value="Books">Books</option>
      </select>
      <input
        placeholder="Contact Info"
        value={donorContact}
        onChange={(e) => setDonorContact(e.target.value)}
        className="inputField"
      />
      <input
        type="number"
        placeholder="Amount"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        className="inputField"
        min={1}
      />
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="inputField"
      >
        <option value="">Select Event</option>
        {events.map((event, idx) => (
          <option key={idx} value={event.title}>
            {event.title}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Message (optional)"
        value={donationMessage}
        onChange={(e) => setDonationMessage(e.target.value)}
        className="textareaField"
      />
      <button onClick={handleRegister} className="buttonPrimary">
        Register Donation
      </button>

      {trackingMessages.length > 0 && (
        <div className="trackingContainer">
          <h4>Tracking Updates:</h4>
          <ul>
            {trackingMessages.map((msg, i) => (
              <li key={i}>📩 {msg}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onLogout} className="buttonSecondary">
        Logout
      </button>
    </div>
  );
};

const ReceiverDashboard = ({ onLogout, events, onSubmitRequest }) => {
  const [receiverName, setReceiverName] = useState("");
  const [neededItem, setNeededItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [contact, setContact] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleSubmit = () => {
    if (!receiverName || !neededItem || !quantity || !selectedEvent) {
      alert("Please complete all fields.");
      return;
    }

    onSubmitRequest({
      receiverName,
      neededItem,
      quantity,
      contact,
      selectedEvent,
      status: "Pending",
    });

    alert("Request submitted for approval.");
    setReceiverName("");
    setNeededItem("");
    setQuantity("");
    setContact("");
    setSelectedEvent("");
  };

  return (
    <div className="container">
      <h2>Receiver Dashboard</h2>
      <input
        placeholder="Name"
        value={receiverName}
        onChange={(e) => setReceiverName(e.target.value)}
        className="inputField"
      />
      <input
        placeholder="Item Needed"
        value={neededItem}
        onChange={(e) => setNeededItem(e.target.value)}
        className="inputField"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="inputField"
      />
      <input
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="inputField"
      />
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="inputField"
      >
        <option value="">Select Event</option>
        {events.map((event, idx) => (
          <option key={idx} value={event.title}>
            {event.title}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit} className="buttonPrimary">
        Submit Request
      </button>
      <button onClick={onLogout} className="buttonSecondary">
        Logout
      </button>
    </div>
  );
};

const NGODashboard = ({ onLogout, onCreateEvent, events }) => {
  const [ngoName, setNgoName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleCreate = () => {
    if (!eventTitle.trim()) return alert("Event title required");
    if (!targetAmount || Number(targetAmount) <= 0)
      return alert("Please provide a valid donation target");

    onCreateEvent({
      title: eventTitle,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
    });

    alert(`New event "${eventTitle}" created by ${ngoName || "NGO"}`);
    setEventTitle("");
    setTargetAmount("");
  };

  return (
    <div className="container">
      <h2>NGO Dashboard</h2>
      <input
        placeholder="NGO Name"
        value={ngoName}
        onChange={(e) => setNgoName(e.target.value)}
        className="inputField"
      />
      <input
        placeholder="Event Title"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
        className="inputField"
      />
      <input
        type="number"
        placeholder="Target Donation Amount"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        className="inputField"
      />
      <button onClick={handleCreate} className="buttonPrimary">
        Create Event
      </button>

      <h3 style={{ marginTop: 30 }}>Your Events</h3>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        events.map((event, i) => {
          const percent = Math.min(
            100,
            (event.currentAmount / event.targetAmount) * 100
          ).toFixed(1);
          return (
            <div key={i} className="eventCard">
              <strong>{event.title}</strong>
              <p>
                Progress: ${event.currentAmount} / ${event.targetAmount} (
                {percent}%)
              </p>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })
      )}

      <button onClick={onLogout} className="buttonSecondary" style={{ marginTop: 30 }}>
        Logout
      </button>
    </div>
  );
};

const AdminDashboard = ({ onLogout, receiverRequests, approveRequest }) => {
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {receiverRequests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        receiverRequests.map((req, i) => (
          <div key={i} className="requestCard">
            <strong>{req.receiverName}</strong> requested{" "}
            <strong>{req.neededItem}</strong> (x{req.quantity}) for{" "}
            <strong>{req.selectedEvent}</strong>
            <p>Status: {req.status}</p>
            {req.status === "Pending" && (
              <button onClick={() => approveRequest(i)} className="buttonPrimary">
                Approve
              </button>
            )}
          </div>
        ))
      )}
      <button onClick={onLogout} className="buttonSecondary">
        Logout
      </button>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [receiverRequests, setReceiverRequests] = useState([]);

  const addEvent = (eventObj) => setEvents([...events, eventObj]);

  const addReceiverRequest = (request) =>
    setReceiverRequests([...receiverRequests, request]);

  const approveRequest = (index) => {
    const updated = [...receiverRequests];
    updated[index].status = "Approved";
    setReceiverRequests(updated);
  };

  const donateToEvent = (eventTitle, amount) => {
    const updated = events.map((e) =>
      e.title === eventTitle
        ? { ...e, currentAmount: e.currentAmount + amount }
        : e
    );
    setEvents(updated);
  };

  return (
    <div>
      {!user ? (
        <SimpleLogin onLogin={setUser} />
      ) : user.role === "Donor" ? (
        <DonorDashboard
          onLogout={() => setUser(null)}
          events={events}
          donateToEvent={donateToEvent}
        />
      ) : user.role === "Receiver" ? (
        <ReceiverDashboard
          onLogout={() => setUser(null)}
          events={events}
          onSubmitRequest={addReceiverRequest}
        />
      ) : user.role === "NGO" ? (
        <NGODashboard
          onLogout={() => setUser(null)}
          onCreateEvent={addEvent}
          events={events}
        />
      ) : user.role === "Admin" ? (
        <AdminDashboard
          onLogout={() => setUser(null)}
          receiverRequests={receiverRequests}
          approveRequest={approveRequest}
        />
      ) : null}
    </div>
  );
}
