const express=require('express')
const app=express();
const http=require('http')
const {Server}=require('socket.io')
const cors=require('cors')
app.use(cors());//estefade az middleware
const server=http.createServer(app)//ijade server

//baraye inke be ckientemun befreste va daryaft kone
    const io = new Server(server, {
        cors: {
          origin: 'http://localhost:3000',
          methods: ['GET', 'POST'],
        },
      });
          //connect to mongoDB
      
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mannamanam76:djZQSdW6_mp_VJb@mycluster.qbuqv.mongodb.net/?retryWrites=true&w=majority&appName=mycluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



      io.on('connection', (socket) => {
        console.log('connected')
        
        async function run() {
         
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("mymessages").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
           var dbo=client.db("mymessages")
        
         
       //How To Load All Of datas
          const collection = client.db("mymessages").collection("collection1");
          try {
            const user = await collection.find().toArray();
            console.log(user);
            socket.emit('allmessages',user)
          } catch (error) {
            console.error(error);
          }
 

      //How to delete a record of database
          // const collection = client.db("mymessages").collection("collection1");
          // try {
          //   const user = await collection.deleteOne(query);
          //   console.log(user);
          // } catch (error) {
          //   console.error(error);
          // }
           
        }
     
       socket.on('message',(message)=>
        {
          socket.emit('message',message)

             var dbo=client.db("mymessages")
              dbo.collection("collection1").insertOne(
             {"Text":message}, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
              });
         run().catch(console.dir); 
        })
        
       
        
        socket.on('disconnect',()=>{
          console.log("disconnected")
        })
      })
  


      server.listen(4000, () =>{ console.log('Server is running on port 4000')});



