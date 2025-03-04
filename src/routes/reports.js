import { Router } from "express";
import { generateFullReportData } from "../services/reportDataService.js";
import { generatePdfReport } from "../services/reportPdfService.js";
import { generateCsvReport } from "../services/reportCsvService.js";
import { db } from '../lib/connectdb.js';
import PDFDocument from 'pdfkit';
import util from 'util';

const router = Router();

router.post("/reports/full", async (req, res) => {
  try {
    const format = req.body.format?.toLowerCase() || "pdf";
    const reportData = await generateFullReportData();
    switch (format) {
      case "pdf":
        return generatePdfReport(reportData, res);
      case "csv":
        return generateCsvReport(reportData, res);
      default:
        return res.status(400).send("Invalid format specified");
    }
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).send("Error generating report");
  }
});



// Promisify db methods for cleaner async/await usage
const dbGet = util.promisify(db.get.bind(db));
const dbAll = util.promisify(db.all.bind(db));
// Helper function to draw a table row
const drawTableRow = (doc, startX, y, colWidths, rowHeight, cells, options = {}) => {
  const cellPadding = options.cellPadding || 5;
  let currentX = startX;
  for (let i = 0; i < cells.length; i++) {
    // Draw cell border
    doc
      .rect(currentX, y, colWidths[i], rowHeight)
      .stroke();
    // Write cell text (if any)
    doc.text(
      cells[i],
      currentX + cellPadding,
      y + cellPadding,
      { width: colWidths[i] - cellPadding * 2, align: options.align || 'left' }
    );
    currentX += colWidths[i];
  }
};

router.post("/reports/course", async (req, res) => {
  try {
    const { courseCode } = req.body;
    if (!courseCode) {
      return res.status(400).json({ error: "Course code is required" });
    }

    // Fetch course details
    const course = await dbGet("SELECT * FROM courses WHERE courseCode = ?", [courseCode]);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch sessions for the course ordered by date and startTime
    const sessions = await dbAll("SELECT * FROM sessions WHERE courseCode = ? ORDER BY date, startTime", [courseCode]);

    // Fetch all attendance records for the course ordered by timestamp
    const attendanceRecords = await dbAll("SELECT * FROM attendance WHERE courseCode = ? ORDER BY timestamp", [courseCode]);

    // Group attendance records by date (assuming the date part of the timestamp matches the session date)
    const attendanceByDate = {};
    attendanceRecords.forEach(att => {
      const datePart = att.timestamp.split('T')[0];
      if (!attendanceByDate[datePart]) {
        attendanceByDate[datePart] = [];
      }
      attendanceByDate[datePart].push(att);
    });

    // Set up PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = `course_report_${courseCode}_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // Cover Page: Course Info
    doc.fontSize(20)
       .text(`Attendance Report for Course: ${course.courseTitle} (${course.courseCode})`, {
         align: 'center'
       });
    doc.moveDown();
    doc.fontSize(12)
       .text(`Credit Unit: ${course.creditUnit}`)
       .text(`Registered Students: ${course.registeredStudent}`)
       .moveDown(2);

    // If no sessions, show message
    if (sessions.length === 0) {
      doc.addPage().fontSize(14).text("No sessions found for this course.");
    } else {
      // Iterate through sessions and generate a page per session
      for (const session of sessions) {
        doc.addPage();

        // Session Header
        doc.fontSize(16)
           .text(`Session on ${session.date}`, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12)
           .text(`Start Time: ${session.startTime}`)
           .text(`End Time: ${session.endTime}`)
           .text(`Status: ${session.status}`)
           .text(`Active Students: ${session.activeStudents}`)
           .moveDown();

        // Attendance for this session
        // We assume the session date matches the date part of attendance timestamps.
        const sessionAttendance = attendanceByDate[session.date] || [];
        if (sessionAttendance.length === 0) {
          doc.text("No attendance records for this session.", { italic: true });
        } else {
          // Draw table header for attendance list
          doc.fontSize(12).fillColor('black').text("Attendance List:", { underline: true });
          doc.moveDown(0.5);

          const tableStartX = doc.page.margins.left;
          const tableYStart = doc.y;
          const rowHeight = 25;
          // Define column widths (adjust as needed)
          const tableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
          const colWidths = [40, 150, tableWidth - 40 - 150]; // Columns: No, Matric Number, Timestamp

          // Draw header row
          doc.font('Helvetica-Bold');
          drawTableRow(doc, tableStartX, tableYStart, colWidths, rowHeight, ["No", "Matric Number", "Timestamp"]);
          doc.font('Helvetica');
          let currentY = tableYStart + rowHeight;

          // Draw rows for each attendance record
          sessionAttendance.forEach((att, index) => {
            drawTableRow(doc, tableStartX, currentY, colWidths, rowHeight, [
              String(index + 1),
              att.matricNumber,
              att.timestamp
            ]);
            currentY += rowHeight;
          });
          doc.moveDown();
        }
      }
    }

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error("Error generating PDF report:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
