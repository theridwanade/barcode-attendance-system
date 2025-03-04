import PDFDocument from "pdfkit";
import { PDFStyles } from "../constant/reportStyles.js";
import { createPdfTable } from "../utils/pdfHelpers.js";

export const generatePdfReport = (data, res) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = `system_report_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // Cover Page
    doc.fillColor(PDFStyles.primaryColor)
       .font(PDFStyles.fontHeader)
       .fontSize(24)
       .text('Attendance System Report\n\n', { align: 'center' });

    doc.fontSize(12)
       .fillColor(PDFStyles.darkGray)
       .text(`Generated At: ${data.meta.generatedAt}\n\n`, { align: 'center' });

    // System Statistics
    doc.addPage()
       .font(PDFStyles.fontHeader)
       .fontSize(18)
       .fillColor(PDFStyles.primaryColor)
       .text('System Statistics\n\n');

    doc.font(PDFStyles.fontBody)
       .fontSize(12)
       .fillColor(PDFStyles.darkGray)
       .text(`Total Students: ${data.meta.systemStats.totalStudents}\n`)
       .text(`Total Courses: ${data.meta.systemStats.totalCourses}\n`)
       .text(`Total Sessions: ${data.meta.systemStats.activeSessions}\n\n`);

    // Courses
    doc.addPage()
       .font(PDFStyles.fontHeader)
       .fontSize(18)
       .fillColor(PDFStyles.primaryColor)
       .text('Courses\n\n');

    createPdfTable(doc, {
        headers: ['Course Title', 'Course Code', 'Credit Unit', 'Registered Students'],
        rows: data.courses.map(course => [
            course.courseTitle,
            course.courseCode,
            course.creditUnit,
            course.registeredStudent
        ])
    });

    // Students
    doc.addPage()
       .font(PDFStyles.fontHeader)
       .fontSize(18)
       .fillColor(PDFStyles.primaryColor)
       .text('Students\n\n');

    createPdfTable(doc, {
        headers: ['Name', 'Matric Number', 'Courses'],
        rows: data.students.map(student => [
            student.name,
            student.matricNumber,
            JSON.parse(student.courses).join(', ') // Ensure courses is parsed correctly
        ])
    });

    // Sessions
    doc.addPage()
       .font(PDFStyles.fontHeader)
       .fontSize(18)
       .fillColor(PDFStyles.primaryColor)
       .text('Sessions\n\n');

    createPdfTable(doc, {
        headers: ['Course Code', 'Date', 'Start Time', 'End Time', 'Active Students', 'Status'],
        rows: data.sessions.map(session => [
            session.courseCode,
            session.date,
            session.startTime,
            session.endTime,
            session.activeStudents,
            session.status
        ])
    });

    // Attendance
    doc.addPage()
       .font(PDFStyles.fontHeader)
       .fontSize(18)
       .fillColor(PDFStyles.primaryColor)
       .text('Attendance\n\n');

    createPdfTable(doc, {
        headers: ['Course Code', 'Matric Number', 'Timestamp', 'Student Name', 'Course Title'],
        rows: data.attendance.map(att => [
            att.courseCode,
            att.matricNumber,
            att.timestamp,
            att.studentName,
            att.courseTitle
        ])
    });

    doc.end();
};