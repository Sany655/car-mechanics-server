const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e2cer.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('connected to db');
        const db = client.db('carMechanic');
        const services = db.collection('services');

        // get api
        app.get('/services',async function(req,res) {
            const result = await services.find({}).toArray();
            res.send(result)
        })

        // get api - signle service
        app.get('/services/:id',async function(req,res) {
            const result = await services.findOne({_id:ObjectID(req.params.id)});
            res.send(result)
        })

        // delete api - signle service
        app.delete('/services/:id',async function(req,res) {
            const result = await services.deleteOne({_id:ObjectID(req.params.id)});
            res.send(result)
        })

        // post api
        app.post('/services', async (req, res) => {
            const result = await services.insertOne(req.body)
            console.log(result);
            res.send(result)
        })

    } catch (error) {
        // await client.close();
    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log('car mechanics server http://localhost:5000');
})