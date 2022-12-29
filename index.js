const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ay7prkh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const homeTaskCollection = client.db("taskManagement").collection("homeTask");
    app.get("/quicktask", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const task = await homeTaskCollection.find(query).toArray();
      res.send(task);
    });
    app.post('/quicktask', async (req, res) => {
        const task = req.body;
        const result = await homeTaskCollection.insertOne(task);
        res.send(result);
      });
      app.put('/quicktask/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            complete: "completed",
          },
        };
        const result = await homeTaskCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      });
      app.delete('/quicktask/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await homeTaskCollection.deleteOne(query);
        res.send(result)
      });
      app.get('/completedtask', async (req, res)=> {
        const email = req.query.email;
        const query = {complete: "completed", email: email};
        const products = await homeTaskCollection.find(query).toArray();
        res.send(products)
      })
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", async (req, res) => {
  res.send(`Task Management Server Running`);
});

app.listen(port, () => console.log(`Task Management Server Running On Port ${port}`));
