import express from "express";
import fileUpload from "./utils/multer.js";
import {
  createReport,
  getReports,
  getReportViaContent,
  getReport,
  deleteReport,
  updateReport,
  addNewFilesToReport,
  deleteFileFromReport,
} from "./controllers/reports.js";
import "dotenv/config";
import "./utils/connect.js";
import {
  createFolder,
  deleteFolder,
  getFolders,
  getFolder,
  updateFolderName,
} from "./controllers/tree.js";
import cors from "cors";
import fs from "fs";
import { getStatistics } from "./controllers/statistics.js";

const app = express();
app.use(cors());
app.use(express.json());

app.route("/smartsearch").get(getReportViaContent);
app.route("/reports").get(getReports).post(fileUpload.any(), createReport);
app.route("/statistics/:name").get(getStatistics);
app.route("/reports/:id").get(getReport).delete(deleteReport).put(updateReport);
app
  .route("/reports/files/:reportid")
  .put(fileUpload.any(), addNewFilesToReport)
  .delete(deleteFileFromReport);
app.route("/folders").get(getFolders).post(createFolder);
app
  .route("/folders/:path")
  .get(getFolder)
  .put(updateFolderName)
  .delete(deleteFolder);

app.post("/login", (req, res, next) => {
  if (req.body.password === "708a12") return res.status(200).json({});

  res.status(404).json({});
});
app.route("/files/:filename").get((req, res, next) => {
  const readStream = fs.createReadStream(
    "../data/uploaded/" + req.params.filename
  );
  readStream.on("data", (chunk) => {
    res.write(chunk);
  });
  readStream.on("close", () => res.end());
  readStream.on("error", (err) => {
    res.end();
  });
});

app.use((err, req, res, next) => {
  // handle duplicate index mongodb
  console.log(err);
  if (!process.env.prod === "yes") console.log(err);
  if (err.code === 11000) {
    res.status(404).json({
      status: "fail",
      message: "رقم التقرير موجود مسبقاً",
    });
    return;
  }
  res.status(404).json({ message: err.message });
});

app.listen(process.env.port || 5679, () => {
  if (!process.env.prod === "yes") console.log("server start");
});
