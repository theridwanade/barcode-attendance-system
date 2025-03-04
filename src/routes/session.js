import { Router } from "express";
import { db } from "../lib/connectdb.js";

const router = Router();

router.get("/sessions", (req, res) => {
  db.all("SELECT * FROM sessions", [], (err, sessionRows) => {
    if (err) {
      console.error("Error retrieving sessions:", err.message);
      return res.render("session", {
        error: "Failed to retrieve sessions",
        sessions: [],
        courses: [],
      });
    }

    const sessionsWithDetails = sessionRows.map((session) => {
      return new Promise((resolve, reject) => {
        db.get(
          "SELECT registeredStudent FROM courses WHERE courseCode = ?",
          [session.courseCode],
          (err, course) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...session,
                registeredStudents: course ? course.registeredStudent : 0,
              });
            }
          }
        );
      });
    });

    Promise.all(sessionsWithDetails)
      .then((sessions) => {
        db.all("SELECT * FROM courses", [], (err, courseRows) => {
          if (err) {
            console.error("Error retrieving courses:", err.message);
            return res.render("session", {
              error: "Failed to retrieve courses",
              sessions: sessions,
              courses: [],
            });
          }
          res.render("session", {
            error: null,
            sessions: sessions,
            courses: courseRows,
          });
        });
      })
      .catch((err) => {
        console.error("Error processing sessions:", err.message);
        res.render("session", {
          error: "Failed to process sessions",
          sessions: [],
          courses: [],
        });
      });
  });
});

// Create a new session
router.post("/sessions/new", (req, res) => {
  const { courseCode, date, startTime, endTime } = req.body;

  // Simple validation
  if (!courseCode || !date || !startTime || !endTime) {
    return res.render("session", { error: "All fields are required" });
  }

  // Insert session into the database
  db.run(
    `INSERT INTO sessions (courseCode, date, startTime, endTime, status) 
     VALUES (?, ?, ?, ?, 'active')`,
    [courseCode, date, startTime, endTime],
    function (err, rows) {
      if (err) {
        console.error("Error inserting session:", err.message);
        return res.render("session", { error: "Failed to create session" });
      }
      // Redirect to sessions page after success
      res.redirect("/sessions");
    }
  );
});

// End session
router.post("/sessions/end/:id", (req, res) => {
  const sessionId = req.params.id;

  db.run(
    `UPDATE sessions SET status = 'inactive' WHERE id = ?`,
    [sessionId],
    function (err) {
      if (err) {
        console.error("Error ending session:", err.message);
        return res.render("session", { error: "Failed to end session" });
      }

      // Redirect to sessions page after success
      res.redirect("/sessions");
    }
  );
});

router.post("/sessions/restart/:id", (req, res) => {
  const sessionId = req.params.id;

  db.run(
    `UPDATE sessions SET status = 'active' WHERE id = ?`,
    [sessionId],
    function (err) {
      if (err) {
        console.error("Error ending session:", err.message);
        return res.render("session", { error: "Failed to end session" });
      }

      // Redirect to sessions page after success
      res.redirect("/sessions");
    }
  );
})

router.get("/sessions/attendance", (req, res) => {
  db.all(`SELECT * FROM sessions WHERE status = 'active'`, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving active sessions:", err.message);
      return res.render("sign-attendance", {
        error: "Failed to load active sessions",
      });
    }
    if (rows.length <= 0) {
      return res.render("attendance", {
        error: "No active session available",
        sessions: null
      });
    }
    return res.render("attendance", { sessions: rows });
  });
});

router.post("/sessions/sign-attendance", (req, res) => {
  const { courseCode, matricNumber } = req.body;
  console.log(req.body)
  // Check if the student is registered
  db.get("SELECT * FROM students WHERE matricNumber = ?", [matricNumber], (err, student) => {
    if (err) {
      console.error("Error retrieving student:", err.message);
      return res.json({ success: false, message: "Error retrieving student" });
    }

    if (!student) {
      return res.json({ success: false, message: "Student not found" });
    }

    // Check if the student is registered for the course
    const registeredCourses = JSON.parse(student.courses);
    if (!registeredCourses.includes(courseCode)) {
      return res.json({ success: false, message: "Student not registered for this course" });
    }

    // Check if attendance is already recorded for this session
    db.get("SELECT * FROM attendance WHERE courseCode = ? AND matricNumber = ?", [courseCode, matricNumber], (err, attendance) => {
      if (err) {
        console.error("Error retrieving attendance:", err.message);
        return res.json({ success: false, message: "Error retrieving attendance" });
      }

      if (attendance) {
        return res.json({ success: false, message: "Attendance already recorded" });
      }

      // Record attendance
      const timestamp = new Date().toISOString();
      db.run("INSERT INTO attendance (courseCode, matricNumber, timestamp) VALUES (?, ?, ?)", [courseCode, matricNumber, timestamp], (err) => {
        if (err) {
          console.error("Error recording attendance:", err.message);
          return res.json({ success: false, message: "Error recording attendance" });
        }

        // Update the number of active students signed in the session
        db.run("UPDATE sessions SET activeStudents = activeStudents + 1 WHERE courseCode = ? AND status = 'active'", [courseCode], (err) => {
          if (err) {
            console.error("Error updating active students count:", err.message);
            return res.json({ success: false, message: "Error updating active students count" });
          }

          return res.json({ success: true, message: "Attendance recorded successfully" });
        });
      });
    });
  });
});

export default router;
