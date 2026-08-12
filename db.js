const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dheeraj@123",
    database: "expense_tracker"
});

db.connect((error) => {
    if (error) {
        console.log("Database connection failed:", error.message);
        return;
    }

    console.log("MySQL database connected successfully");
});

module.exports = db;