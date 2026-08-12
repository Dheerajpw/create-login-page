const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Login API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Check user by email
    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], (error, results) => {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Database error"
            });
        }

        // User not found
        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = results[0];

        // Password check
        if (user.password !== password) {
            return res.status(401).json({
                message: "User not authorized"
            });
        }

        // Login successful
        return res.status(200).json({
            message: "User login successful"
        });
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});