import tree from "../utils/tree.js";
import Tree from "../models/tree.js";
import Report from "../models/reports.js";
import Document from "../models/documents.js";
import catchasync from "../utils/catchasync.js";
import mongoose from "mongoose";
import fs from "fs";

export const getFolders = catchasync(async (req, res, next) => {
  const folders = await Tree.find().sort({ path: 1 });

  res.json({
    status: "success",
    folders,
    tree: tree(folders),
  });
});
export const getFolder = catchasync(async (req, res, next) => {
  const path = req.params.path;

  const folder = await Tree.findOne({ path }).populate("reports");
  if (!folder) return next(new Error("Folder not found"));
  res.json({
    status: "success",
    path,
    folder,
  });
});
export const createFolder = catchasync(async (req, res, next) => {
  const { name, path } = req.body;

  if (!name) return next(new Error("Name not provided"));
  if (name.includes(",")) return next(new Error('Name cannot contain " , " .'));
  // if path null then do no thing
  // if path privided then check if exist
  if (path) {
    const pathExist = await Tree.findOne({ path });
    if (!pathExist) return next(new Error("Path Provided Not Exist"));

    const checkDuplicate = await Tree.findOne({ path: path + "," + name });
    if (checkDuplicate)
      return next(new Error("لا يمكن اضافة مجلدات فرعية بنفس الاسم"));
  }

  if (!path) {
    const checkDuplicate = await Tree.findOne({ path: new RegExp("^" + name) });
    if (checkDuplicate)
      return next(new Error("لا يمكن اضافة مجلدات رئيسية بنفس الاحرف الأولية"));
  }

  const newFolder = await Tree.create({
    path: path ? path + "," + name : name,
    reports: [],
  });

  res.json({
    status: "success",
    folder: newFolder,
  });
});

export const updateFolderName = async (req, res, next) => {
  const path = req.params.path;
  const newName = req.body.name;

  const folderName = path.split(",")[path.split(",").length - 1];

  await Tree.updateMany({ path: new RegExp(`^${path}`) }, [
    {
      $set: {
        path: {
          $replaceOne: {
            input: "$path",
            find: folderName,
            replacement: newName,
          },
        },
      },
    },
  ]);
  res.json({
    status: "success",
    message: "folder name updated succesfully",
  });
};

export const deleteFolder = async (req, res, next) => {
  const path = req.params.path;
  // delete path :

  // console.log(path);

  // find all paths :
  const session = await mongoose.startSession();

  session.startTransaction({ writeConcern: { w: "1", journal: true } });

  try {
    const allPath = await Tree.find({ path: new RegExp("^" + path) });
    for (let pathsIndex = 0; pathsIndex < allPath.length; pathsIndex++) {
      for (
        let reportIndex = 0;
        reportIndex < allPath[pathsIndex].reports.length;
        reportIndex++
      ) {
        const deletedReport = await Report.findByIdAndDelete(
          allPath[pathsIndex].reports[reportIndex],
          {
            session,
          }
        );
        await Document.deleteMany({ reportid: deletedReport._id }, { session });
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
      }
    }
    await Tree.deleteMany({ path: new RegExp("^" + path) }, { session });
    await session.commitTransaction();

    res.json({
      status: "success",
    });
  } catch (err) {
    await session.abortTransaction();
    // console.log(err);
    next(new Error("Error occuresd"));
  } finally {
    await session.endSession();
  }
  // find all reports :
  // delete reports and files and docs
  // delete all paths :
};
