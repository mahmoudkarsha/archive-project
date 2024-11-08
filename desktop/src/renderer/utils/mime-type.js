import mime from 'mime';

export function getFileMimeType(file) {
    if (file instanceof File) {
        if (file.type) return file.type;
        let extention = file.name.split('.')[file.name.split('.').length - 1];
        return mime.getType(extention);
    }
}

export function getFileExtention(file) {
    if (file instanceof File) {
        let splited = file.name.split('.');
        if (splited.length === 1 || splited.length === 0) return undefined;
        return splited[splited.length - 1];
    }
}
