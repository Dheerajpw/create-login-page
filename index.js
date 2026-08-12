const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== SIGNUP API ====================

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    // Check empty fields
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check whether user already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkUserQuery, [email], async (error, results) => {
        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Database error"
            });
        }

        // User already exists
        if (results.length > 0) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const insertUserQuery = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            insertUserQuery,
            [name, email, hashedPassword],
            (error, result) => {
                if (error) {
                    console.log(error);

                    return res.status(500).json({
                        message: "Failed to create user"
                    });
                }

                return res.status(201).json({
                    message: "User created successfully"
                });
            }
        );
    });
});


// ==================== LOGIN API ====================

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Find user by email
    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (error, results) => {
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

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Password incorrect
        if (!passwordMatch) {
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


// ==================== START SERVER ====================

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});