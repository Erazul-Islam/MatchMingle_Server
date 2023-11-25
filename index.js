const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// 3lup20ngtFoS25Bu
// MatchMingle

app.use(cors());
app.use(express.json())



const uri = "mongodb+srv://MatchMingle:3lup20ngtFoS25Bu@cluster0.35nuqgc.mongodb.net/?retryWrites=true&w=majority";

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

        const profileCollection = client.db("marriage").collection("profile");
        const userCollection = client.db("marriage").collection("users");
        const successCollection = client.db("marriage").collection("success");
        const AllCollection = client.db("marriage").collection("All");
        const favouriteCollection = client.db('marriage').collection("favourite");

        app.post('/users',async(req,res) => {
            const user = req.body
            const query = {email: user.email}
            const existingUser = await userCollection.findOne(query);
            if(existingUser){
                return res.send({message: 'already exist', insertedId: null})
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // const veifyAdmin = async (req,res,next) => {
        //     const email = req.decoded.email;
        //     const query = {email:email}
        //     const user = await userCollection.findOne(query);
        //     const isAdmin = user?.role === 'admin';
        //     if(!isAdmin){
        //         return res.status(403).send({message: 'forbidden access'})
        //     }
        //     next()
        // }

        app.get('/users', async (req,res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.post('/fav',async (req,res) => {
            const fav = req.body;
            const result = await favouriteCollection.insertOne(fav)
            res.send(result)
        })

        app.get('/fav',async(req,res) => {
            const email = req.query.email;
            const query = {email:email}
            const result = await favouriteCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/profile', async (req, res) => {
            const cursor = profileCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/all', async (req, res) => {
            const cursor = AllCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/successful', async (req, res) => {
            const cursor = successCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Marriage server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})