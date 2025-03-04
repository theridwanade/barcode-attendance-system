import { Router } from "express";
import { db } from "../lib/connectdb.js";

const router = Router();

router.get("/admin", async (req, res) => {
  try {
    const totalStudents = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS count FROM students", (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const totalCourses = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS count FROM courses", (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const activeSessions = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS count FROM sessions WHERE status = 'active'", (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const todayAttendance = await new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      db.get("SELECT COUNT(*) AS count FROM attendance WHERE DATE(timestamp) = ?", [today], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const latestAttendance = await new Promise((resolve, reject) => {
      db.all("SELECT matricNumber, courseCode, timestamp FROM attendance ORDER BY timestamp DESC LIMIT 10", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const courses = await new Promise((resolve, reject) => {
      db.all("SELECT courseCode, courseTitle FROM courses", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.render("admin", {
      totalStudents,
      totalCourses,
      activeSessions,
      todayAttendance,
      latestAttendance,
      courses
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).send("Internal Server Error");
  }
});


export default router;