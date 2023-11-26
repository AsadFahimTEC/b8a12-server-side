const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const validator = require('validator');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgpgxo2.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://tour:ZtEz4vyK8dVEfgws@cluster0.cgpgxo2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const wishlistCollection = client.db("productDB").collection("allwishlists");

     // wishRoutes
     app.get("/wishlist/:wishId", async (req, res) => {
      const { wishId } = req.params;
    
      // Validate wishId format
      if (!validator.isMongoId(wishId)) {
        return res.status(400).send("Invalid ObjectId format");
      }
    
      try {
        const cursor = await wishlistCollection.find({
          _id: new ObjectId(wishId),
        });
    
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/wishes", async (req, res) => {
      const wish = req.body;
      const result = await wishlistCollection.insertOne(wish);
      res.send(result);
    });

    app.get("/wishes", async (req, res) => {
      const cursor = await wishlistCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
}
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Project CRUD Server is Running");
});

app.listen(port, () => {
  console.log(`Project CRUD server running on the PORT: ${port}`);
});
