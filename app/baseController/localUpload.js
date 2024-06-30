var multer = require('multer'),
    path = require('path'),
    mime = require('mime'),
    allowedMimeTypes = ['txt', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'text', 'rtf','png','jpeg','image/png','image/jpeg','csv'];
var storageHist = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var uploadFile = multer({
    storage: storageHist,
    fileFilter: function (req, file, cb) {
        if (allowedMimeTypes.indexOf(mime.extension(file.mimetype)) === -1 && ['application/wps-office.xlsx', 'application/wps-office.pptx','text/csv'].indexOf(file.mimetype) === -1) {
            req.fileValidationError = 'File type not allowed.';
            return cb(null, false, new Error('File type not allowed.'));
        }
        cb(null, true);
    }
});

module.exports.upload = uploadFile;