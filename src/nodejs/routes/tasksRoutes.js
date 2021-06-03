"use strict";

let express = require("express"),
    router = express.Router(),
    mongodb = require("mongodb"),
    db = require('../db');

// GET 
router.get("/", async (req, res, next) => {
    try {
        const connection = await db('todo');
        connection.collection('tasks').find({}).toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                result.forEach(obj => renameKey(obj, '_id', 'id'));
                res.send(JSON.stringify(result));
            }
        });
    } catch (err) {
        throw err;
    }
});

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

// POST 
router.post("/", async (req, resp, next) => {
    console.log('post');
    try {
        const connection = await db('todo');
        const task = { description: req.body.description, completed: false };
        connection.collection('tasks').insertOne(task, function(err, res) {
            if (err) throw err;
            resp.send({ success: true, message: "1 document added"});
        });
    } catch (err) {
        throw err;
    }
});

// PUT 
router.put("/", async (req, resp, next) => {
    console.log('put');
    let task = req.body;
    try {
        const connection = await db('todo');

        const query = { _id: new mongodb.ObjectID(task.id) };
        console.log(JSON.stringify(query));

        const newValues = { $set: { description: task.description, completed: task.completed }};
        console.log(JSON.stringify(newValues));
        
        connection.collection('tasks').updateOne(query, newValues, { upsert: false }, function(err, res) {
            if (err) throw err;
            resp.send({ success: true, message: "1 document updated"});
        });
    } catch (err) {
        throw err;
    }
});

// DELETE
router.delete("/", async (req, resp, next) => {
    try {
        const connection = await db('todo');
        const query = { _id: new mongodb.ObjectID(req.query.id) };
        connection.collection('tasks').deleteOne(query, function(err, res) {
            if (err) throw err;
            resp.send({"success": true, "message": "1 document deleted"});
        });
    } catch (err) {
        throw err;
    } 
});

module.exports = router;