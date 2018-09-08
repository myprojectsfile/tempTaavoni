const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const multer = require('multer');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
const Grid = require('gridfs-stream');
var path = require('path');

module.exports = function (app) {
    // for local mongo
    const mongoUri = 'mongodb://localhost:27017/TaavoniDb';
    // for docker mongo 
    // const mongoUri = 'mongodb://taavoni_mongodb:27017/TaavoniDb;

    const mongoConnectPromise = mongoose.createConnection(mongoUri, { useNewUrlParser: true });

    // Init gridfs
    let gfs;

    mongoConnectPromise.once('open', () => {
        // init stream
        gfs = Grid(mongoConnectPromise.db, mongoose.mongo);
        gfs.collection('uploads');
        console.log('2- Connected to mongodb Successfully');
    });


    // Create Storage engine 
    const storage = new GridFsStorage({
        url: mongoUri,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads'
                    };
                    resolve(fileInfo);
                });
            });
        }
    });

    const upload = multer({ storage });

    app.route('/api/file/upload')
        .post(upload.single('file'), (req, res) => {
            res.json({ file: req.file });
        });
}