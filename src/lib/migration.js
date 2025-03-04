import { db } from "./connectdb.js";

const migratedb = async () => {
  try {
    // Create the admin table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS admin (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            reject(`Error creating admin table: ${err.message}`);
          } else {
            resolve();
          }
        }
      );
    });

    // Insert default admin user if not exists
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO admin (username, password)
         SELECT "admin", "admin123"
         WHERE NOT EXISTS (SELECT 1 FROM admin WHERE username = "admin")`,
        (err) => {
          if (err) {
            reject(`Error inserting default admin: ${err.message}`);
          } else {
            resolve();
          }
        }
      );
    });

    // Create the courses table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          courseTitle TEXT NOT NULL,
          courseCode TEXT NOT NULL UNIQUE,
          creditUnit INTEGER NOT NULL,
          registeredStudent INTEGER DEFAULT 0
        )`,
        (err) => {
          if (err) {
            reject(`Error creating courses table: ${err.message}`);
          } else {
            resolve();
          }
        }
      );
    });

    // Create the students table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          matricNumber TEXT NOT NULL UNIQUE,
          courses TEXT NOT NULL  -- Store the array as a JSON string
        )`,
        (err) => {
          if (err) {
            reject(`Error creating students table: ${err.message}`);
          } else {
            resolve();
          }
        }
      );
    });

    // Create the sessions table if it doesn't exist, with foreign key constraint
    await new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          courseCode TEXT NOT NULL,
          date TEXT NOT NULL,
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL,
          activeStudents INTEGER NOT NULL DEFAULT 0,
          status TEXT CHECK(status IN ('active', 'suspended', 'inactive')) DEFAULT 'active',
          FOREIGN KEY (courseCode) REFERENCES courses(courseCode) ON DELETE CASCADE,
          UNIQUE(courseCode, date, startTime)
        )`,
        (err) => {
          if (err) {
            reject(`Error creating sessions table: ${err.message}`);
          } else {
            resolve();
          }
        }
      );
    });

    // Create the attendance table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          courseCode TEXT NOT NULL,
          matricNumber TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          FOREIGN KEY (courseCode) REFERENCES courses(courseCode) ON DELETE CASCADE,
          FOREIGN KEY (matricNumber) REFERENCES students(matricNumber) ON DELETE CASCADE
        )`,
        (err) => {
          if (err) {
            reject(`Error creating attendance table: ${err.message}`);
          } else {
            resolve();
          }
        }
      );
    });

    console.log("All migrations ran successfully");
  } catch (error) {
    console.error("Migration error:", error.message);
    throw new Error(error.message);
  }
};

export default migratedb;