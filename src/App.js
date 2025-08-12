import React, { useState } from "react";
import "./App.css";

const roles = ["Donor", "Receiver", "NGO", "Admin"];

// -------------------- LOGIN COMPONENT --------------------
const SimpleLogin = ({ onLogin, toggleForm, users }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = () => {
    if (!username || !password || !role) {
      alert("Please enter username, password, and select a role.");
      return;
    }

    // Validate user credentials
    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (!user) {
      alert("Invalid credentials or role.");
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
      <p>
        Don't have an account?{" "}
        <button onClick={toggleForm} className="linkButton">
          Sign Up
        </button>
      </p>
    </div>
  );
};

// -------------------- SIGNUP COMPONENT --------------------
const SimpleSignUp = ({ onSignUp, toggleForm, users }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [donorFile, setDonorFile] = useState(null); // for Donor's tax return/NID pic
  const [ngoFile, setNgoFile] = useState(null); // for NGO's permission slip

  // Helper: convert file to base64 string for storage (simulated)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSignUp = async () => {
    if (!username || !password || !role) {
      alert("Please complete all fields.");
      return;
    }
    if (users.find((u) => u.username === username)) {
      alert("Username already exists.");
      return;
    }

    // Check extra file upload based on role
    if (role === "Donor" && !donorFile) {
      alert("Please upload Tax Return/NID card picture for Donors.");
      return;
    }
    if (role === "NGO" && !ngoFile) {
      alert("Please upload Permission Slip for NGOs.");
      return;
    }

    let donorFileData = null,
      ngoFileData = null;

    try {
      if (donorFile) donorFileData = await fileToBase64(donorFile);
      if (ngoFile) ngoFileData = await fileToBase64(ngoFile);
    } catch (e) {
      alert("Error reading uploaded file.");
      return;
    }

    // Create user object with uploaded files if any
    const newUser = {
      username,
      password,
      role,
      donorFile: donorFileData,
      ngoFile: ngoFileData,
    };

    onSignUp(newUser);
    alert("Sign up successful. Please log in.");
    toggleForm();
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
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
        onChange={(e) => {
          setRole(e.target.value);
          // Reset file inputs when role changes
          setDonorFile(null);
          setNgoFile(null);
        }}
        className="inputField"
      >
        <option value="">Select Role</option>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {role === "Donor" && (
        <div>
          <label>
            Upload Tax Return / NID Card Picture (image or PDF):
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setDonorFile(e.target.files[0] || null)}
              className="inputField"
            />
          </label>
        </div>
      )}

      {role === "NGO" && (
        <div>
          <label>
            Upload Permission Slip (image or PDF):
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setNgoFile(e.target.files[0] || null)}
              className="inputField"
            />
          </label>
        </div>
      )}

      <button onClick={handleSignUp} className="buttonPrimary">
        Sign Up
      </button>
      <p>
        Already have an account?{" "}
        <button onClick={toggleForm} className="linkButton">
          Login
        </button>
      </p>
    </div>
  );
};

// -------------------- DONOR DASHBOARD --------------------
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

// -------------------- RECEIVER DASHBOARD --------------------
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

// -------------------- NGO DASHBOARD --------------------
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

// -------------------- ADMIN DASHBOARD --------------------
const AdminDashboard = ({ onLogout, receiverRequests, approveRequest, users }) => {
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <h3>Receiver Requests</h3>
      {receiverRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="requestsTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Item Needed</th>
              <th>Quantity</th>
              <th>Contact</th>
              <th>Event</th>
              <th>Status</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {receiverRequests.map((req, i) => (
              <tr key={i}>
                <td>{req.receiverName}</td>
                <td>{req.neededItem}</td>
                <td>{req.quantity}</td>
                <td>{req.contact}</td>
                <td>{req.selectedEvent}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "Pending" ? (
                    <button
                      onClick={() => approveRequest(i)}
                      className="buttonPrimary"
                    >
                      Approve
                    </button>
                  ) : (
                    "Approved"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: 40 }}>Registered Users</h3>
      <table className="usersTable">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.username}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onLogout} className="buttonSecondary" style={{ marginTop: 30 }}>
        Logout
      </button>
    </div>
  );
};

// -------------------- APP --------------------
export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const [users, setUsers] = useState([
    // Example initial users (for testing)
    { username: "admin", password: "admin", role: "Admin" },
  ]);

  const [events, setEvents] = useState([]);

  const [receiverRequests, setReceiverRequests] = useState([]);

  const toggleForm = () => setIsSignUp((v) => !v);

  const onLogin = (user) => {
    setLoggedInUser(user);
  };

  const onLogout = () => {
    setLoggedInUser(null);
  };

  const onSignUp = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const onCreateEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  const donateToEvent = (eventTitle, amount) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.title === eventTitle
          ? { ...e, currentAmount: e.currentAmount + amount }
          : e
      )
    );
  };

  const onSubmitRequest = (request) => {
    setReceiverRequests((prev) => [...prev, request]);
  };

  const approveRequest = (idx) => {
    setReceiverRequests((prev) =>
      prev.map((req, i) =>
        i === idx ? { ...req, status: "Approved" } : req
      )
    );
  };

  if (!loggedInUser) {
    return isSignUp ? (
      <SimpleSignUp onSignUp={onSignUp} toggleForm={toggleForm} users={users} />
    ) : (
      <SimpleLogin onLogin={onLogin} toggleForm={toggleForm} users={users} />
    );
  }

  // Render dashboards by role
  switch (loggedInUser.role) {
    case "Donor":
      return (
        <DonorDashboard
          onLogout={onLogout}
          events={events}
          donateToEvent={donateToEvent}
        />
      );

    case "Receiver":
      return (
        <ReceiverDashboard
          onLogout={onLogout}
          events={events}
          onSubmitRequest={onSubmitRequest}
        />
      );

    case "NGO":
      return (
        <NGODashboard
          onLogout={onLogout}
          onCreateEvent={onCreateEvent}
          events={events}
        />
      );

    case "Admin":
      return (
        <AdminDashboard
          onLogout={onLogout}
          receiverRequests={receiverRequests}
          approveRequest={approveRequest}
          users={users}
        />
      );

    default:
      return <p>Unknown role</p>;
  }
}
