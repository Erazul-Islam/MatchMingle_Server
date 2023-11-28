const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
const app = express();
const port = process.env.PORT || 5000;

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
        const addCollection = client.db('marriage').collection("add");
        const premeiumCollection = client.db('marriage').collection("premium");
        
        app.post('jwt',async (req,res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN,{
                expiresIn: '1h'
            })
            res.send({token})
        })

        app.get('/users/admin/:email',async (req,res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await userCollection.findOne(query)
            let admin = false;
            if(user){
                admin = user?.role === 'admin';
            }
            res.send({admin})
        })

        app.get('/users/:email',async (req,res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await userCollection.findOne(query)
            let premeium = false;
            if(user){
                premeium = user?.type === 'premeium';
            }
            res.send({premeium})
        })



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

        app.patch('/users/admin/:id',async (req,res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })

        app.patch('/users/:id',async (req,res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const updatedDoc = {
                $set: {
                    type: 'premeium'
                }
            }
            const result = await userCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })
        app.patch('/premium/:id',async (req,res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const updatedDoc = {
                $set: {
                    type: 'premeium'
                }
            }
            const result = await premeiumCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })


        app.get('/users', async (req,res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.post('/add',async(req,res) => {
            const newBio = req.body;
            const result = await addCollection.insertOne(newBio);
            res.send(result)
        })

        app.post('/premium',async(req,res) => {
            const newBio = req.body;
            const result = await premeiumCollection.insertOne(newBio);
            res.send(result)
        })

        app.get('/premium', async (req,res) => {
            const result = await premeiumCollection.find().toArray()
            res.send(result)
        })

        app.get('/add',async(req,res) => {
            const result = await addCollection.find().toArray()
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