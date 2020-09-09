'use strict';

require('dotenv').config();

let db;

const MongoClient = require('mongodb').MongoClient;

const loadDB = async () => {

    if (db) {
        return db;
    }

    try {
        const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db("prodDB")
    }
    catch (err) {
        console.log('caught err');
        console.error(err);
    }

    return db;
};

module.exports = loadDB;
