// ================================
// File: index.js
// Hotel Manager System API
// Node.js + Express + better-sqlite3
// ================================

const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Connect Database
const db = new Database("hotel.db");

// Create Tables

db.prepare(`
CREATE TABLE IF NOT EXISTS rooms(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomNumber TEXT,
    roomType TEXT,
    price INTEGER,
    status TEXT
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS customers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS bookings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER,
    roomId INTEGER,
    checkIn TEXT,
    checkOut TEXT
)
`).run();

console.log("Database Ready");

// --------------------------------------
// HOME
// --------------------------------------

app.get("/", (req, res) => {
    res.json({
        message: "Hotel Manager API Running"
    });
});


// ======================================
// ROOM API
// ======================================

// Get all rooms
app.get("/rooms", (req, res) => {
    const rooms = db.prepare("SELECT * FROM rooms").all();
    res.json(rooms);
});

// Get room by id
app.get("/rooms/:id", (req, res) => {

    const room = db.prepare(
        "SELECT * FROM rooms WHERE id=?"
    ).get(req.params.id);

    if (!room)
        return res.status(404).json({message:"Room Not Found"});

    res.json(room);
});

// Add room
app.post("/rooms", (req, res) => {

    const {roomNumber, roomType, price, status} = req.body;

    db.prepare(`
    INSERT INTO rooms(roomNumber,roomType,price,status)
    VALUES(?,?,?,?)
    `).run(roomNumber, roomType, price, status);

    res.json({
        message:"Room Added"
    });

});

// Update room
app.put("/rooms/:id",(req,res)=>{

    const {roomNumber, roomType, price, status}=req.body;

    db.prepare(`
    UPDATE rooms
    SET roomNumber=?,
        roomType=?,
        price=?,
        status=?
    WHERE id=?
    `).run(roomNumber,roomType,price,status,req.params.id);

    res.json({
        message:"Room Updated"
    });

});

// Delete room
app.delete("/rooms/:id",(req,res)=>{

    db.prepare("DELETE FROM rooms WHERE id=?")
    .run(req.params.id);

    res.json({
        message:"Room Deleted"
    });

});


// ======================================
// CUSTOMER API
// ======================================

// Get Customers

app.get("/customers",(req,res)=>{

    const data=db.prepare(
        "SELECT * FROM customers"
    ).all();

    res.json(data);

});

// Add Customer

app.post("/customers",(req,res)=>{

    const {name,phone,email}=req.body;

    db.prepare(`
    INSERT INTO customers(name,phone,email)
    VALUES(?,?,?)
    `).run(name,phone,email);

    res.json({
        message:"Customer Added"
    });

});

// Update Customer

app.put("/customers/:id",(req,res)=>{

    const {name,phone,email}=req.body;

    db.prepare(`
    UPDATE customers
    SET
    name=?,
    phone=?,
    email=?
    WHERE id=?
    `).run(name,phone,email,req.params.id);

    res.json({
        message:"Customer Updated"
    });

});

// Delete Customer

app.delete("/customers/:id",(req,res)=>{

    db.prepare(
        "DELETE FROM customers WHERE id=?"
    ).run(req.params.id);

    res.json({
        message:"Customer Deleted"
    });

});


// ======================================
// BOOKING API
// ======================================

// Get bookings

app.get("/bookings",(req,res)=>{

const data=db.prepare(`
SELECT
bookings.id,
customers.name,
rooms.roomNumber,
bookings.checkIn,
bookings.checkOut
FROM bookings
JOIN customers
ON bookings.customerId=customers.id
JOIN rooms
ON bookings.roomId=rooms.id
`).all();

res.json(data);

});

// Add Booking

app.post("/bookings",(req,res)=>{

const {customerId,roomId,checkIn,checkOut}=req.body;

db.prepare(`
INSERT INTO bookings
(customerId,roomId,checkIn,checkOut)
VALUES(?,?,?,?)
`).run(customerId,roomId,checkIn,checkOut);

db.prepare(`
UPDATE rooms
SET status='Booked'
WHERE id=?
`).run(roomId);

res.json({
message:"Booking Successful"
});

});

// Delete Booking

app.delete("/bookings/:id",(req,res)=>{

db.prepare("DELETE FROM bookings WHERE id=?")
.run(req.params.id);

res.json({
message:"Booking Deleted"
});

});

// ======================================

app.listen(PORT,()=>{

console.log(`Server Running on http://localhost:${PORT}`);

});