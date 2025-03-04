# **Online Barcode Attendance System**

**Project Documentation (Proof of Concept)**

---

## **1. Overview**

This system automates student attendance tracking using barcode scanning. It serves as a demonstration for a university attendance system, with features for admins to manage courses, generate barcodes, and analyze attendance data.

### **Key Users**:

- **Admins**: Manage courses, students, sessions, and generate reports.
- **Students**: Scan barcodes to sign attendance.

---

## **2. System Setup (For Client)**

### **Requirements**

1. Install [Node.js](https://nodejs.org/) (v18+)
2. Install a modern web browser (Chrome/Firefox)

### **Installation Steps**

1. **Download the Project**: Provide the client with the project folder.
2. **Install Dependencies**:
   - Open a terminal in the project folder.
   - Run `npm install` to install required components.
3. **Environment Setup**:
   - Create a `.env` file in the root folder with:
     ```
     JWT_SECRET=your_secret_key_here  
     PORT=3000  
     ```
4. **Start the System**:
   - Run `npm start` to launch the server.
   - Access the system at `http://localhost:3000` in a browser.

---

## **3. User Guide**

### **Login**

- **Admin Credentials**: Pre-configured (e.g., username: `admin`, password: `admin123`).
- **Students**: Added by admins; they log in with their matric number and password.

---

### **Admin Features**

#### **1. Create a Course**

- Navigate to **Courses > Create New**.
- Enter course name/code.

#### **2. Add Students**

- Go to **Students > Add Student**.
- Fill in student details (name, matric number, etc.).

#### **3. Generate Barcodes**

- Select a course and session.
- Click **Generate Barcode** to create/download a unique barcode for attendance.

#### **4. Manage Sessions**

- Create attendance sessions for specific courses.
- Barcodes are valid only during active sessions.
- Sessions can be ended or restarted by the admin.

#### **5. Generate Reports**

- **Attendance Lists**: View/download PDF/CSV reports per course/session.
- **System Reports**: Analyze overall attendance trends.

---

### **Student Features**

1. **Sign Attendance**:
   - Scan the barcode displayed during a session using a mobile device.
   - The system records their matric number and timestamp.
2. **View Attendance History**:
   - Check past attendance records for courses.

---

## **4. System Architecture & Flow**

### **Architecture Overview**

- **Frontend**: Bootstrap-based UI for admin & student dashboards.
- **Backend**: Express.js handles API requests and authentication.
- **Database**: SQLite3 stores courses, students, and attendance records.
- **Authentication**: JWT for session management.
- **Barcode Generation**: Unique barcodes created per session.
- **Report Generation**: Attendance logs exported as CSV/PDF.

### **System Flow**

1. **Admin logs in & sets up courses**
2. **Admin registers students & assigns courses**
3. **Admin generates a barcode for a live session**
4. **Students scan barcode to sign attendance**
5. **System records attendance in the database**
6. **Admin generates attendance reports**

---

## **5. UML Diagrams**

### **Use Case Diagram**

```plaintext
+-------------------+
|      Admin       |
+-------------------+
          |
          | (Manage Courses, Sessions, Students, Reports)
          v
+-------------------+
|     System       |
+-------------------+
          |
          | (Scan Barcode, View Attendance History)
          v
+-------------------+
|     Student      |
+-------------------+
```

---

## **6. Key Code Snippets**

### **1. Route to Sign Attendance**
```js
router.post("/sessions/sign-attendance", (req, res) => {
  const { courseCode, matricNumber } = req.body;
  db.get("SELECT * FROM students WHERE matricNumber = ?", [matricNumber], (err, student) => {
    if (err || !student) {
      return res.json({ success: false, message: "Student not found" });
    }
    
    const registeredCourses = JSON.parse(student.courses);
    if (!registeredCourses.includes(courseCode)) {
      return res.json({ success: false, message: "Not registered for this course" });
    }
    
    db.run("INSERT INTO attendance (courseCode, matricNumber, timestamp) VALUES (?, ?, ?)",
      [courseCode, matricNumber, new Date().toISOString()],
      (err) => {
        if (err) return res.json({ success: false, message: "Error recording attendance" });
        res.json({ success: true, message: "Attendance recorded" });
      }
    );
  });
});
```

### **2. Generating a Barcode**
```js
import bwipjs from 'bwip-js';
router.get('/generate-barcode', (req, res) => {
  const { sessionId } = req.query;
  bwipjs.toBuffer({
    bcid: 'code128',
    text: sessionId,
    scale: 3,
    height: 10,
    includetext: true
  }, (err, png) => {
    if (err) return res.status(500).send('Barcode error');
    res.setHeader('Content-Type', 'image/png');
    res.send(png);
  });
});
```

---

## **7. Security**

- **Authentication**: Only logged-in users can access the system.
- **Session Restriction**: Barcodes are only valid during active sessions.
- **Data Validation**: All inputs are sanitized before processing.
- **SQL Injection Prevention**: Uses parameterized queries in the database.

---

## **8. Testing the Proof of Concept**

1. Verify that unauthenticated users cannot access admin/student pages.
2. Test barcode scanning (e.g., using a mobile phone camera).
3. Confirm reports are generated correctly (PDF/CSV).

---

## **9. Troubleshooting**

| Issue                  | Solution                           |
| ---------------------- | ---------------------------------- |
| "Missing dependencies" | Run `npm install` again.           |
| "Invalid token" error  | Clear browser cookies and relogin. |
| Server not starting    | Ensure port 3000 is available.     |

---

## **10. Conclusion**

This proof of concept demonstrates a scalable, secure attendance system. Future enhancements could include real-time notifications, facial recognition, or integration with university databases.

---

