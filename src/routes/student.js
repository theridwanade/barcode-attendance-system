import { Router } from "express";
import { db } from "../lib/connectdb.js";
const router = Router();

router.get("/student", (req, res) => {
 db.all(`SELECT * FROM courses`, (err, rows) => {
   if (err) {
     console.error("Error fetching courses:", err);
     return res.status(500).send({ success: false, message: "An error occurred while fetching courses" });
   }
   db.all(`SELECT * FROM students`, (err, studentsRows) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).send({ success: false, message: "An error occurred while fetching students" });
    }
    res.render("student", { courses: rows, students: studentsRows });
   });
 });
});

router.post("/student/create", (req, res) => {
  const { name, matricNumber, courses } = req.body;
  const coursesArray = Array.isArray(courses) ? courses : [courses];
  const coursesJson = JSON.stringify(coursesArray);

  db.run(
    `INSERT INTO students (name, matricNumber, courses) VALUES (?, ?, ?)`,
    [name, matricNumber, coursesJson],
    function (err) {
      if (err) {
        console.error("Error creating student:", err);
        return res.status(500).send({ success: false, message: "An error occurred while creating the student" });
      }

      // Update the registeredStudent count for each selected course
      coursesArray.forEach((course) => {
        db.run(
          `UPDATE courses SET registeredStudent = registeredStudent + 1 WHERE courseCode = ?`,
          [course],
          (err) => {
            if (err) {
              console.error("Error updating course:", err);
            }
          }
        );
      });

      res.send({ success: true, name, matricNumber, courses });
    }
  );
});

export default router;