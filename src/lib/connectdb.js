import sqlite3 from "sqlite3";
import path from "path";
import __dirname from "../lib/dirname.js";

sqlite3.verbose();

const dbPath = path.resolve(__dirname, "database/app.db");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the database.");
  }
});
