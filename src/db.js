/* eslint-disable */
'use strict';

require('dotenv').config();

let db;

const MongoClient = require('mongodb').MongoClient;

async function loadDB() {
    if (db) {
        return db;
    }
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db();
    } catch (err) {
        console.error(err);
    }
    return db;
}

module.exports = loadDB;