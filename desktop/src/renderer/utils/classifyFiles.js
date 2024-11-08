import { getFileExtention } from './mime-type';

const photofilesTypes = ['png', 'jpg', 'jpeg'];
const videofilesTypes = ['mp4'];
const documentfilesTypes = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'accdb',
  'ppt',
  'pptx',
  'txt',
];
const compressedfilesTypes = ['rar', 'zip'];
const audiofilesTypes = ['mp3'];

export default function classifyFiles(filesArray) {
  const filesObject = {
    documentFiles: [],
    photoFiles: [],
    audioFiles: [],
    videoFiles: [],
    compressedFiles: [],
    rejectedFiles: [],
  };

  filesArray.forEach((file) => {
    const extention = getFileExtention(file.file);
    switch (true) {
      case documentfilesTypes.includes(extention):
        filesObject.documentFiles.push(file);
        break;

      case photofilesTypes.includes(extention):
        filesObject.photoFiles.push(file);
        break;

      case videofilesTypes.includes(extention):
        filesObject.videoFiles.push(file);
        break;

      case compressedfilesTypes.includes(extention):
        filesObject.compressedFiles.push(file);
        break;

      case audiofilesTypes.includes(extention):
        filesObject.audioFiles.push(file);
        break;

      default:
        filesObject.rejectedFiles.push(file);
    }
  });

  return filesObject;
}
