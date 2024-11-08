import fs, { unlink } from "fs";

import Report from "../models/reports.js";
import Tree from "../models/tree.js";
import Document from "../models/documents.js";
import Counter from "../models/counter.js";
import catchasync from "../utils/catchasync.js";
import { getTextExtractor } from "office-text-extractor";
import mongoose from "mongoose";

const extractor = getTextExtractor();

// 16000000

export const createReport = catchasync(async (req, res, next) => {
  const { number, date, subject, note, path } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction({ writeConcern: { w: "1", j: true } });

  try {
    const { lastReportId } = await Counter.findByIdAndUpdate(
      "reports",
      { $inc: { lastReportId: 1 } },
      { upsert: true, returnDocument: true, returnOriginal: false, session }
    );
    const files = classifyFiles(req.files);
    const pathObject = await Tree.findOne({ path });
    const new_report = new Report({
      path: pathObject._id,
      note,
      subject,
      date,
      number,
      autoId: lastReportId, // current report id
      documentFiles: files.documentFiles,
      photoFiles: files.photoFiles,
      videoFiles: files.videoFiles,
      compressedFiles: files.compressedFiles,
      audioFiles: files.audioFiles,
    });

    await new_report.save({ session });

    await Tree.findByIdAndUpdate(
      pathObject._id,
      { $push: { reports: new_report._id } },
      { session }
    );

    for (let i = 0; i < files.documentFiles.length; i++) {
      const docBuffer = await fs.promises.readFile(
        "../data/uploaded/" + files.documentFiles[i].path
      );
      const docText = await extractor.extractText({
        input: docBuffer,
        type: "buffer",
      });
      const newDocument = new Document({
        filename: files.documentFiles[i].originalname,
        filepath: files.documentFiles[i].path,
        reportid: new_report._id,
        content: docText,
      });
      await newDocument.save({ session });
    }

    await session.commitTransaction();

    res.status(201).json({ status: "success" });
  } catch (err) {
    await session.abortTransaction();
    for (let i = 0; i < req.files.length; i++)
      await fs.promises.unlink("../data/uploaded/" + req.files[i].path);

    throw err;
  } finally {
    await session.endSession();
  }
});

export const getReportViaContent = catchasync(async (req, res, next) => {
  const contentString = req.query.content;
  const page = req.query.page * 1 + 1;
  const limit = req.query.limit * 1;
  const sort = req.query.sort;
  const newContentString = contentString.replace(/\s+/g, " ");

  const contentArray = newContentString.split(" ");
  const filterObj = { $or: [] };

  contentArray.forEach((str) => {
    filterObj.$or.push({ content: new RegExp(str) });
  });

  const documents = await Document.find(filterObj)
    .skip(limit * page - limit)
    .limit(limit)
    .populate("reportid");
  res.json({
    status: "success",
    documents,
  });
});

export const getReports = catchasync(async (req, res, next) => {
  // first stage is sort
  // then filter
  // then pagination
  // then populate

  const aggregationPipeLine = [];

  const config = {
    defaultLimit: 10,
    hasFilter: !1,
  };

  const page = req.query.page;
  const limit = req.query.limit;
  const filterString = req.query.filter;
  const sortString = req.query.sort;

  if (sortString) {
    // console.log(sortString);
    const sort = JSON.parse(sortString);
    if (Array.isArray(sort) && sort.length) {
      var { sortField, sortValue } = {
        sortField: sort[0].field === "id" ? "autoId" : sort[0].field,
        sortValue: sort[0].sort === "asc" ? 1 : -1,
      };
    }
    if (sortField)
      aggregationPipeLine.push({ $sort: { [sortField]: sortValue } });
  }

  if (filterString && filterString !== "{}" && filterString !== "undefined") {
    // console.log(filterString);
    const filter = JSON.parse(filterString);

    var { filterField, filterValue, filterOperator } = {
      filterField: filter.field,
      filterOperator: filter.operator,
      filterValue: filter.value,
    };
    var filterStage = undefined;
    switch (filterOperator) {
      case "contains":
        if (
          filterField === "documentFiles" ||
          filterField === "photoFiles" ||
          filterField === "videoFiles" ||
          filterField === "compressedFiles" ||
          filterField === "audioFiles"
        ) {
          filterField = filterField + ".originalname";
        }
        filterStage = {
          $match: { [filterField]: { $regex: new RegExp(filterValue) } },
        };
        break;
      case "startsWith":
        filterStage = {
          $match: { [filterField]: { $regex: new RegExp("^" + filterValue) } },
        };
        break;
      case "endsWith":
        filterStage = {
          $match: { [filterField]: { $regex: new RegExp(filterValue + "$") } },
        };
        break;
      case "equals":
        if (filterField === "autoId") filterValue = Number(filterValue);
        if (filterField === "date") console.log(filterValue);
        filterStage = { $match: { [filterField]: { $eq: filterValue } } };
        break;
      case "isNotEmpty":
        break;
      case "isEmpty":
        break;
      default:
        break;
    }
    if (filterStage) {
      config.hasFilter = !0;
      aggregationPipeLine.push(filterStage);
    }
  }

  if (page) {
    const pageNum = page * 1 + 1;
    const limitNum = limit ? limit * 1 : defaultLimit;
    var { pageLimit, skipedDocs } = {
      pageLimit: limitNum,
      skipedDocs: limitNum * pageNum - limitNum,
    };
    aggregationPipeLine.push({ $skip: skipedDocs });
    aggregationPipeLine.push({ $limit: pageLimit });
  }

  console.log(aggregationPipeLine);
  console.log("reports", "12123123");
  const reports = await Report.aggregate(aggregationPipeLine);

  const reportsCount = await Report.count(
    config.hasFilter ? filterStage.$match : {}
  );

  const populatedReport = await Report.populate(reports, { path: "path" });

  res.json({
    status: "success",
    reports: populatedReport,
    reportsCount,
  });
});

export const getReport = catchasync(async (req, res, next) => {
  const id = req.params.id;
  const report = await Report.findById(id).populate("path");

  if (!report) return next(new Error("No Reports With That Id"));
  res.json({
    status: "success",
    report: report,
  });
});

export const deleteReport = catchasync(async (req, res, next) => {
  const reportid = req.params.id;
  // delete report
  // delete files
  // delete documents
  // update path

  const session = await mongoose.startSession();
  session.startTransaction({ writeConcern: { w: "1", j: true } });
  try {
    const deletedReport = await Report.findByIdAndDelete(reportid, { session });
    if (deletedReport) {
      deletedReport.documentFiles.forEach(async (file) => {
        await fs.promises.unlink("../data/uploaded/" + file.path);
      });

      deletedReport.audioFiles.forEach(async (file) => {
        await fs.promises.unlink("../data/uploaded/" + file.path);
      });

      deletedReport.videoFiles.forEach(async (file) => {
        await fs.promises.unlink("../data/uploaded/" + file.path);
      });

      deletedReport.photoFiles.forEach(async (file) => {
        await fs.promises.unlink("../data/uploaded/" + file.path);
      });

      deletedReport.compressedFiles.forEach(async (file) => {
        await fs.promises.unlink("../data/uploaded/" + file.path);
      });
      await Tree.findByIdAndUpdate(
        deletedReport.path,
        { $pull: { reports: reportid } },
        { session }
      );
      await Document.findOneAndDelete({ reportid: reportid }, { session });

      await session.commitTransaction();

      return res.status(200).json({
        status: "success",
        message: "report deleted succesfully",
      });
    }

    res.status(404).json({
      status: "fail",
      message: "report not found",
    });
  } catch (err) {
    await session.abortTransaction();
    return next(new Error("خطأ في الحذف"));
  } finally {
    session.endSession();
  }
});

export const updateReport = catchasync(async (req, res, next) => {
  const reportid = req.params.id;
  const field = req.body.field;
  const value = req.body.value;

  const updatedReport = await Report.findByIdAndUpdate(reportid, {
    [field]: value,
  });

  res.status(201).json({
    status: "success",
    message: "report updated",
  });
});

export const addNewFilesToReport = catchasync(async (req, res, next) => {
  const reportid = req.params.reportid;
  const files = classifyFiles(req.files);
  const session = await mongoose.startSession();
  await session.startTransaction({ writeConcern: { w: "1", j: true } });
  try {
    const updatedReport = await Report.findByIdAndUpdate(reportid, {
      $push: {
        documentFiles: { $each: files.documentFiles },
        photoFiles: { $each: files.photoFiles },
        videoFiles: { $each: files.videoFiles },
        compressedFiles: { $each: files.compressedFiles },
        audioFiles: { $each: files.audioFiles },
      },
    });

    for (let i = 0; i < files.documentFiles.length; i++) {
      const docBuffer = await fs.promises.readFile(
        "../data/uploaded/" + files.documentFiles[i].path
      );
      const docText = await extractor.extractText({
        input: docBuffer,
        type: "buffer",
      });
      const newDocument = new Document({
        filename: files.documentFiles[i].originalname,
        filepath: files.documentFiles[i].path,
        reportid: updatedReport._id,
        content: docText,
      });
      await newDocument.save({ session });
    }
    await session.commitTransaction();
    return res.status(201).json({
      status: "success",
      message: "files uploaded",
    });
  } catch (err) {
    await session.abortTransaction();
    for (let i = 0; i < req.files.length; i++)
      await unlink("../data/uploaded/" + req.files[i].path);
    throw err;
  } finally {
    await session.endSession();
  }
});

export const deleteFileFromReport = catchasync((req, res, next) => {});

function classifyFiles(filesArr) {
  const files = {
    documentFiles: [],
    photoFiles: [],
    videoFiles: [],
    compressedFiles: [],
    audioFiles: [],
  };

  filesArr.forEach((file) => {
    if (file.fieldname === "photofiles") files.photoFiles.push(file);
    if (file.fieldname === "documentfiles") files.documentFiles.push(file);
    if (file.fieldname === "videofiles") files.videoFiles.push(file);
    if (file.fieldname === "compressedfiles") files.compressedFiles.push(file);
    if (file.fieldname === "audiofiles") files.audioFiles.push(file);
  });
  return files;
}
