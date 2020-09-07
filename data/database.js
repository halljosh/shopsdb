const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = (cb) => {
    MongoClient.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true
    })
        .then(client => {
            console.log('connected to mongodb!');
            _db = client.db();
            cb();   
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => { 
    if (_db) {
        return _db;
    }
    throw 'no database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

