const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* READ */
app.get("/parking", (req, res) => {

    const sql = "SELECT * FROM parking_slots";

    db.query(sql, (err, result) => {

        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }

    });

});

/* CREATE */
app.post("/parking", (req, res) => {

    const { area_name, total_slots, available_slots } = req.body;

    const sql =
        "INSERT INTO parking_slots(area_name,total_slots,available_slots) VALUES(?,?,?)";

    db.query(
        sql,
        [area_name, total_slots, available_slots],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send("Parking Added Successfully");
            }

        }
    );

});

/* UPDATE */
app.put("/parking/:id", (req, res) => {

    const { id } = req.params;

    const { area_name, total_slots, available_slots } = req.body;

    const sql =
        "UPDATE parking_slots SET area_name=?, total_slots=?, available_slots=? WHERE id=?";

    db.query(
        sql,
        [area_name, total_slots, available_slots, id],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send("Parking Updated Successfully");
            }

        }
    );

});

/* DELETE */
app.delete("/parking/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM parking_slots WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            res.send(err);
        } else {
            res.send("Parking Deleted Successfully");
        }

    });

});

/* REGISTER */
app.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
        "INSERT INTO users(username,email,password) VALUES(?,?,?)";

    db.query(
        sql,
        [username, email, hashedPassword],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send("User Registered Successfully");
            }

        }
    );

});

/* LOGIN */
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    db.query(sql, [email], async (err, result) => {

        if (err) {

            res.send(err);

        } else {

            if (result.length === 0) {

                res.send("User Not Found");

            } else {

                const validPassword =
                    await bcrypt.compare(
                        password,
                        result[0].password
                    );

                if (validPassword) {

                    res.json({
                        message: "Login Successful",
                        user: result[0]
                    });

                } else {

                    res.send("Invalid Password");

                }

            }

        }

    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});