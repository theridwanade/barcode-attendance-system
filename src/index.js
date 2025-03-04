import express from "express";
import path from "path";
import "dotenv/config";
import __dirname from "./lib/dirname.js";
import migratedb from "./lib/migration.js";
import { db } from "./lib/connectdb.js";
import { shutdownGracefully } from "./lib/shutdown.js";
import auth from "./routes/auth.js";
import admin from "./routes/admin.js";
import course from "./routes/course.js"
import student from "./routes/student.js"
import attendance from "./routes/session.js"
import reports from "./routes/reports.js"
import cookieParser from "cookie-parser";
import multer from 'multer';
import jwtAuthMiddleware from "./services/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize middleware
initializeMiddleware(app);

// Run migration
runMigration();

// Create routes
createRoutes(app, auth, admin, course, student, attendance, reports);

// Start the server
startServer(app, PORT);

// Handle graceful shutdown
process.on("SIGINT", () => shutdownGracefully(db));

/**
 * Initializes middleware for the express app.
 * @param {express.Application} app - The express app instance.
 */
function initializeMiddleware(app) {
  const upload = multer();
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(jwtAuthMiddleware(["/login", "/sessions/attendance"]));
  app.use(upload.none());
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

/**
 * Runs database migration.
 */
async function runMigration() {
  try {
    await migratedb();
  } catch (error) {
    console.error("Error during database migration:", error);
  }
}

/**
 * Starts the express server.
 * @param {express.Application} app - The express app instance.
 * @param {number} PORT - The port number.
 */
function startServer(app, PORT) {
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}
/**
 * 
 * @param {express.Application} app - The express app instance.
 * @param {...express.Router} routes - Express router objects
 */
function createRoutes(app, ...routes) {
  const [auth, admin, course, student, attendance, reports] = routes;
  app.use(auth);
  app.use(admin);
  app.use(course);
  app.use(student);
  app.use(attendance);
  app.use(reports);
}