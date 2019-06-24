const express = require('express');
const mongoose = require('mongoose'); //To interact with mongoDb
const bodyParser = require('body-parser');

const items = require('./routes/api/items');

const app = express();

//body-parser middleware
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;
const dbName = require('./config/keys').dbName;

//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

//Use routes
app.use('/api/items', items);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));