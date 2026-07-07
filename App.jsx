// File: App.jsx

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [rooms, setRooms] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");

  // Fetch all rooms
  const getRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add a new room
  const addRoom = async (e) => {
    e.preventDefault();

    const newRoom = {
      roomNumber,
      roomType,
      price: Number(price),
      status,
    };

    await fetch("http://localhost:5000/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoom),
    });

    setRoomNumber("");
    setRoomType("");
    setPrice("");
    setStatus("Available");

    getRooms();
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div className="container">
      <h1>🏨 Hotel Manager System</h1>

      <form onSubmit={addRoom}>
        <input
          type="text"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Room Type"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Available</option>
          <option>Booked</option>
        </select>

        <button type="submit">Add Room</button>
      </form>

      <h2>Room List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room No</th>
            <th>Room Type</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.roomNumber}</td>
              <td>{room.roomType}</td>
              <td>₹{room.price}</td>
              <td>{room.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;