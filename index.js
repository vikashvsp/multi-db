const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = process.env.MONGO_URL;
app.use(express.json());

const dbNamePrefix = 'userdb_'; // Prefix for user databases
app.post('/createUser', async (req, res) => {
     try {
          const { username } = req.body;
          const dbName = dbNamePrefix + username;
          const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
          const userDb = client.db(dbName);
          await userDb.collection('dummyCollection').insertOne({});
          await client.close();

          res.json({ success: true, message: 'User database created successfully' });
     } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Internal server error' });
     }
});

app.get('/getUserData', async (req, res) => {
     try {
          const dbName = req.headers['database-name'];

          if (!dbName) {
               return res.status(400).json({ success: false, message: 'Database name not provided in the header' });
          }

          const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

          const userDb = client.db(dbName);

          const userData = await userDb.collection('data2').find({}).toArray();

          await client.close();

          res.json({ success: true, data: userData });
     } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Internal server error' });
     }
});
app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
});
