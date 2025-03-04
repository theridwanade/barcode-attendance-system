import { Router } from "express";
import { db } from "../lib/connectdb.js";

const router = Router();

// Create Course
router.post("/courses/create", (req, res) => {
  const { courseTitle, courseCode, creditUnit } = req.body;
  db.run(
    `INSERT INTO courses (courseTitle, courseCode, creditUnit) VALUES (?, ?, ?)`,
    [courseTitle, courseCode, parseInt(creditUnit, 10)],
    function (err) {
      if (err) {
        console.error("Error creating course:", err);
        return res.render("courses", {
          error: "An error occurred while creating the course",
          courses: [],
        });
      }
    }
  );
  res.redirect("/courses");
});

// Get Courses
router.get("/courses", (req, res) => {
  db.all(`SELECT * FROM courses`, (err, rows) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.render("courses", {
        error: "An error occurred while fetching the courses",
        courses: [],
      });
    }
    res.render("courses", { error: null, courses: rows });
  });
});

export default router;
