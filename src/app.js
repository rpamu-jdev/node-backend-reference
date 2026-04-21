import express from "express";
import bodyParser from "body-parser";
import http from "http";
import soap from "soap";
import { sequelize } from "./db.js";
import bookRoutes from "./routes/book.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { service, xml } from "./soap/bookService.js"; // export them from the file

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
app.use(bodyParser.json());

// REST routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

 console.log("📄 Serving docs from:", path.join(__dirname, "../public/index.html"));
app.get("/api/docs", (req, res) => {
 
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 8443;

sequelize.sync().then(() => {
  const server = http.createServer(app);

  // Attach SOAP service to same HTTP server
  soap.listen(server, "/api/soap/bookservice", service, xml);

  server.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 REST + SOAP running at http://localhost:${PORT}`);
    console.log(`🚀 REST + SOAP running at http://localhost:${PORT}`);
    console.log(`🧼 SOAP WSDL: http://localhost:${PORT}/soap/bookservice?wsdl`);
  });
});
