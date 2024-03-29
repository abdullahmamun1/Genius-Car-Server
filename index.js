// myuser2
// vyhBHJ2gp6y0gRKt



const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqjve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to db');
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");



        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const service = await servicesCollection.findOne(query)
            res.json(service)
        })




        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service)
            console.log(result);

            res.json(result);
        })


        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('trying heroku')
})

app.get('/hello', (req, res) => {
    res.send('hello updated');
})

app.listen(port, () => {
    console.log('listening to port ', port);
})