const express = require('express');
const mongoose = require('mongoose'); //To interact with mongoDb
// const bodyParser = require('body-parser'); //Newer versions of express include body-parser
const path = require('path'); //Core Node.JS module, no need to npm install
const config = require('config'); //Package (organizes hierarchical configurations for your app deployments)

const items = require('./routes/api/items');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');

const app = express();

//body-parser middleware
// app.use(bodyParser.json());

//body-parser middleware
app.use(express.json()); //Newer versions of express include body-parser

//DB config
// const db = require('./config/keys').mongoURI;
const db = config.get('mongoURI');
// const dbName = require('./config/keys').dbName;


//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

//Use routes
app.use('/api/items', items);
app.use('/api/users', users);
app.use('/api/auth', auth);

//Serve our static assets if in production
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); //Resolves to {current-dir}/client/build/index.html
    });
}

const port = process.env.PORT || 5000; //process.env.PORT - Heroku's port

app.listen(port, () => console.log(`Server started on port ${port}`));