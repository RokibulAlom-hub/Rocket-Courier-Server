require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jds8f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB successfully!");

    const usersCollection = client.db("parselAdmin22").collection("allusers");
    const parcelCollection = client.db("parselAdmin22").collection("allParcel");

    // get all users
    app.get("/allusers", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    // User creation
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.status(201).send(result);
    });
    // update the user status
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const role = req.body.role;
      console.log(id, role);

      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: role,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // get the role by user login
    app.get("/user/role/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    // get all the delivery mans
    app.get("/alldelivery", async (req, res) => {
      const deliveryman = req.query.role;
      // console.log(deliveryman);

      const query = { role: deliveryman };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    // get parcels
    app.get("/parcels", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await parcelCollection.find(query).toArray();
      res.send(result);
    });
    // get all parcels in allparcel page
    app.get("/allparcels", async (req, res) => {
      const result = await parcelCollection.find().toArray();
      res.send(result);
    });
    // create parcel post
    app.post("/parcels", async (req, res) => {
      const parcel = req.body;
      const result = await parcelCollection.insertOne(parcel);
      res.send(result);
    });
    // update parecel
    app.patch("/update/parcel/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId (id)}
      const options = { upsert: true };
      const updateDoc = {
        $set:req.body
      };
      const result = await parcelCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // update the parcel status through patch
    app.patch("/manage-parcel/:id", async (req, res) => {
      const id = req.params.id;
      const manageDoc = req.body
      const query = { _id: new ObjectId(id) };
      // console.log(manageDoc, query);

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: manageDoc.status,
          App_delivery_date: manageDoc.appDate,
          deliverymanId: manageDoc.dmanId,
        },
      };
      const result = await parcelCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // get the deliverman data 
    app.get('/delivery-man-list/:id',async(req,res) => {
      const id = req.params.id
      const query = {deliverymanId: id}
      // console.log(query);
      
      const result = await parcelCollection.find(query).toArray()
      res.send(result)
    })
    // change status from deliver man
    app.patch('/update-status/:id',async(req,res) => {
      const id = req.params.id
      const data = req.body
      const query = {_id: new ObjectId(id)}
      const updateDoc ={
        $set:{
          status: data.status
        }
      }
      const result = await parcelCollection.updateOne(query,updateDoc)
      res.send(result)
    })
  } catch (err) {
    console.error("Connection error:", err);
  }
}
run();

// Base Route
app.get("/", (req, res) => {
  res.send({ message: "Ohh yeah my server is working", status: "running" });
});

// Start Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
