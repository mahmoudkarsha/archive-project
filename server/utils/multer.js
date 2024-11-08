import multer, { MulterError } from "multer";
import fs from "fs";
// import log from './log.js';

const photofiles = "photofiles";
const photofilesTypes = ["png", "jpg", "jpeg"];

const videofiles = "videofiles";
const videofilesTypes = ["mp4"];

const documentfiles = "documentfiles";
const documentfilesTypes = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "accdb",
  "ppt",
  "pptx",
  "txt",
];

const compressedfiles = "compressedfiles";
const compressedfilesTypes = ["rar", "zip"];

const audiofiles = "audiofiles";
const audiofilesTypes = ["mp3", "wav"];

function checkFileType(fieldname, mimetype, originalname) {
  const extentionOriginalName =
    originalname.split(".")[originalname.split(".").length - 1];
  if (fieldname === photofiles) {
    return photofilesTypes.includes(extentionOriginalName)
      ? extentionOriginalName
      : !1;
  }
  if (fieldname === videofiles) {
    return videofilesTypes.includes(extentionOriginalName)
      ? extentionOriginalName
      : !1;
  }
  if (fieldname === documentfiles) {
    return documentfilesTypes.includes(extentionOriginalName)
      ? extentionOriginalName
      : !1;
  }
  if (fieldname === compressedfiles) {
    return compressedfilesTypes.includes(extentionOriginalName)
      ? extentionOriginalName
      : !1;
  }
  if (fieldname === audiofiles) {
    return audiofilesTypes.includes(extentionOriginalName)
      ? extentionOriginalName
      : !1;
  }
  return !1;
}

function checkFile(fieldname, mimetype, originalname) {
  if (
    fieldname === photofiles ||
    fieldname === videofiles ||
    fieldname === documentfiles ||
    fieldname === compressedfiles ||
    fieldname === audiofiles
  ) {
    return checkFileType(fieldname, mimetype, originalname);
  }
  return !1;
}

class CustomStorage {
  constructor(opt) {
    this.dest = opt.dest;
  }

  _handleFile(req, file, cb) {
    const { fieldname, originalname, mimetype, stream } = file;
    const extention = checkFile(fieldname, mimetype, originalname);
    if (extention) {
      const customName = Date.now() + "." + extention;
      const writeStream = fs.createWriteStream(this.dest + "/" + customName);
      stream.pipe(writeStream);
      writeStream.on("error", cb);
      writeStream.on("finish", () => {
        return cb(null, {
          path: customName,
          size: writeStream.bytesWritten,
          originalname: Buffer.from(originalname, "latin1").toString("utf-8"),
        });
      });
    } else {
      return cb(new MulterError("LIMIT_UNEXPECTED_FILE", fieldname));
    }
  }

  _removeFile(req, file, cb) {
    fs.unlink(file.path);
  }
}

const multerConfig = {
  storage: new CustomStorage({ dest: "../data/uploaded" }),
};

export default multer(multerConfig);
