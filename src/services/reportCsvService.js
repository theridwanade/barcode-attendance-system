import { Parser } from "json2csv";

export const generateCsvReport = (data, res) => {
  const fields = [
    { label: 'Report Section', value: 'section' },
    { label: 'Metric', value: 'metric' },
    { label: 'Value', value: 'value' }
  ];

  // CSV data transformation logic: Build an array of rows for CSV
  const csvData = [];

  // Meta Information
  csvData.push({ section: 'Meta', metric: 'Generated At', value: data.meta.generatedAt });

  // System Statistics
  csvData.push({ section: 'System Stats', metric: 'Total Students', value: data.meta.systemStats.totalStudents });
  csvData.push({ section: 'System Stats', metric: 'Total Courses', value: data.meta.systemStats.totalCourses });
  csvData.push({ section: 'System Stats', metric: 'Active Sessions', value: data.meta.systemStats.activeSessions });
  csvData.push({ section: 'System Stats', metric: 'Today Attendance', value: data.meta.systemStats.todayAttendance });

  // Courses (Optional: customize as needed)
  if (Array.isArray(data.courses)) {
    data.courses.forEach(course => {
      csvData.push({ section: 'Courses', metric: 'Course Title', value: course.courseTitle });
      csvData.push({ section: 'Courses', metric: 'Course Code', value: course.courseCode });
      csvData.push({ section: 'Courses', metric: 'Credit Unit', value: course.creditUnit });
      csvData.push({ section: 'Courses', metric: 'Registered Students', value: course.registeredStudent });
      csvData.push({ section: 'Courses', metric: 'Total Sessions', value: course.totalSessions });
      csvData.push({ section: 'Courses', metric: 'Total Attendance', value: course.totalAttendance });
    });
  }

  // Students (Optional)
  if (Array.isArray(data.students)) {
    data.students.forEach(student => {
      csvData.push({ section: 'Students', metric: 'Name', value: student.name });
      csvData.push({ section: 'Students', metric: 'Matric Number', value: student.matricNumber });
      csvData.push({ section: 'Students', metric: 'Courses', value: student.courses });
      csvData.push({ section: 'Students', metric: 'Total Attendance', value: student.totalAttendance });
    });
  }

  // Sessions (Optional)
  if (Array.isArray(data.sessions)) {
    data.sessions.forEach(session => {
      csvData.push({ section: 'Sessions', metric: 'Course Code', value: session.courseCode });
      csvData.push({ section: 'Sessions', metric: 'Date', value: session.date });
      csvData.push({ section: 'Sessions', metric: 'Start Time', value: session.startTime });
      csvData.push({ section: 'Sessions', metric: 'End Time', value: session.endTime });
      csvData.push({ section: 'Sessions', metric: 'Active Students', value: session.activeStudents });
      csvData.push({ section: 'Sessions', metric: 'Status', value: session.status });
      csvData.push({ section: 'Sessions', metric: 'Attendance Count', value: session.attendanceCount });
    });
  }

  // Attendance (Optional)
  if (Array.isArray(data.attendance)) {
    data.attendance.forEach(att => {
      csvData.push({ section: 'Attendance', metric: 'Course Code', value: att.courseCode });
      csvData.push({ section: 'Attendance', metric: 'Matric Number', value: att.matricNumber });
      csvData.push({ section: 'Attendance', metric: 'Timestamp', value: att.timestamp });
      csvData.push({ section: 'Attendance', metric: 'Student Name', value: att.studentName });
      csvData.push({ section: 'Attendance', metric: 'Course Title', value: att.courseTitle });
    });
  }

  // Create the CSV content
  const parser = new Parser({ fields });
  const csv = parser.parse(csvData);

  // Set the response headers and send the CSV content
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=system_report.csv');
  res.send(csv);
};
