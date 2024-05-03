import React, { useState, useEffect } from "react";
import "./request.css"; // Import CSS file for styling

function Requests() {
  const [requests, setRequests] = useState([]);
  const [donationAmount, setDonationAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "food",
    amount: 0,
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const vol = localStorage.getItem("vol");

  const handleDonationChange = (e) => {
    setDonationAmount(e.target.value);
  };

  const handleVolSub = async (_id) => {
    console.log(_id);
    try {
      const response = await fetch(`http://localhost:8080/donations/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: vol ? 1 : -1 }),
      });
      if (response.ok) {
        console.log(`Volunteer request submitted for donation ID ${_id}`);
        !vol
          ? localStorage.setItem("vol", "true")
          : localStorage.removeItem("vol");
        setAlertMessage("Volunteer request submitted successfully.");
      } else {
        console.error(
          `Error submitting volunteer request for donation ID ${_id}: ${response.status} - ${response.statusText}`
        );
        setAlertMessage("Error submitting volunteer request.");
      }
    } catch (error) {
      console.error("Error submitting volunteer request:", error?.message);
      setAlertMessage("Error submitting volunteer request.");
    }
    // Clear alert message after 3 seconds
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const handleDonation = async (_id) => {
    console.log(_id);
    try {
      const response = await fetch(`http://localhost:8080/donations/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: donationAmount }),
      });
      if (response.ok) {
        console.log(`Donation request fulfilled for donation ID ${_id}`);
        setAlertMessage("Donation request fulfilled successfully.");
      } else {
        console.error(
          `Error fulfilling donation request for donation ID ${_id}: ${response.status} - ${response.statusText}`
        );
        setAlertMessage("Error fulfilling donation request.");
      }
    } catch (error) {
      console.error("Error fulfilling donation request:", error?.message);
      setAlertMessage("Error fulfilling donation request.");
    }
    // Clear alert message after 3 seconds
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setAlertMessage("Request submitted successfully.");
      } else {
        setAlertMessage("Error submitting request.");
      }
    } catch (error) {
      console.error("Error submitting request:", error.message);
      setAlertMessage("Error submitting request.");
    }
    setShowModal(false); // Close modal after submitting
  };

  useEffect(() => {
    async function fetchRequests() {
      const response = await fetch("http://localhost:8080/donations");
      const data = await response.json();
      setRequests(data);
    }
    fetchRequests();
  }, []);

  return (
    <div className="requests-container">
      <h2>Donation Requests</h2>
      {/* Display alert message if it exists */}
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <button onClick={() => setShowModal(true)}>Create Request</button>
      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Create Request</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label>Type:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="food">Food</option>
              <option value="volunteer">Volunteer</option>
              <option value="money">Money</option>
            </select>
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
      {/* Display existing requests */}
      {requests.length > 0 &&
        requests.map((request) => (
          <div key={request.id} className="request-card">
            <p>
              {request.name} needs {request.amount} {request.type}
            </p>
            {request.type !== "volunteer" ? (
              <div>
                <input
                  type="number"
                  onChange={handleDonationChange}
                  className="donation-input"
                />
                <button
                  onClick={() => handleDonation(request._id)}
                  className="donate-button"
                >
                  Donate
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleVolSub(request._id)}
                className={`volunteer-button ${
                  vol === "true" ? "volunteered" : ""
                }`}
              >
                {vol === "true" ? "Volunteer" : "Volunteered"}
              </button>
            )}
          </div>
        ))}
    </div>
  );
}

export default Requests;
