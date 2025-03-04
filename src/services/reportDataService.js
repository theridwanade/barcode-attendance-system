import { db } from "../lib/connectdb.js";

// Helper function to promisify database queries
const dbQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const generateFullReportData = async () => {
    const data = {
        meta: {
            generatedAt: new Date().toISOString(),
            systemStats: {}
        },
        courses: [],
        students: [],
        sessions: [],
        attendance: []
    };

    try {
        // Execute system stats queries in parallel
        const [students, courses, sessions, attendance] = await Promise.all([
            dbGet("SELECT COUNT(*) AS totalStudents FROM students"),
            dbGet("SELECT COUNT(*) AS totalCourses FROM courses"),
            dbGet("SELECT COUNT(*) AS activeSessions FROM sessions WHERE status = 'active'"),
            dbGet("SELECT COUNT(*) AS todayAttendance FROM attendance WHERE date(timestamp) = date('now')")
        ]);

        // Assign system stats
        data.meta.systemStats = {
            totalStudents: students.totalStudents,
            totalCourses: courses.totalCourses,
            activeSessions: sessions.activeSessions,
            todayAttendance: attendance.todayAttendance
        };

        // Get detailed data in parallel
        const [coursesData, studentsData, sessionsData] = await Promise.all([
            dbQuery(`
                SELECT c.*, 
                    (SELECT COUNT(*) FROM sessions WHERE courseCode = c.courseCode) AS totalSessions,
                    (SELECT COUNT(*) FROM attendance WHERE courseCode = c.courseCode) AS totalAttendance
                FROM courses c`
            ),
            dbQuery(`
                SELECT s.*, 
                    (SELECT COUNT(*) FROM attendance WHERE matricNumber = s.matricNumber) AS totalAttendance
                FROM students s`
            ),
            dbQuery(`
                SELECT s.*, 
                    (SELECT COUNT(*) FROM attendance WHERE courseCode = s.courseCode) AS attendanceCount
                FROM sessions s`
            )
        ]);

        // Assign detailed data
        data.courses = coursesData;
        data.students = studentsData;
        data.sessions = sessionsData;

        // Get attendance data
        data.attendance = await dbQuery(`
            SELECT a.*, s.name AS studentName, c.courseTitle 
            FROM attendance a
            JOIN students s ON a.matricNumber = s.matricNumber
            JOIN courses c ON a.courseCode = c.courseCode
            ORDER BY a.timestamp DESC 
            LIMIT 100`
        );

        return data;

    } catch (error) {
        console.error('Report generation failed:', error);
        throw new Error('Failed to generate report data');
    }
};