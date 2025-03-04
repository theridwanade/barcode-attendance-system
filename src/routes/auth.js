import { Router } from "express";
import { db } from "../lib/connectdb.js";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }
      if (!row) {
        res
          .status(401)
          .render("login", { error: "Invalid username or password" });
        return;
      } else {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 2 * 60 * 60 * 1000,
        });
        res.redirect("/admin");
        return;
      }
    }
  );
});

router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/login");
});

export default router;
