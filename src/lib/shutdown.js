export function shutdownGracefully(db) {
 console.log("Shutting down gracefully...");

 db.close((err) => {
   if (err) {
     console.error("Error closing database:", err);
   } else {
     console.log("Database closed successfully.");
   }
   process.exit();
 });
}
