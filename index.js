const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes.js');
const mongoose = require('mongoose');
const sass = require('sass');

const app = express();

//open a connection to DataBase
mongoose.connect('mongodb://localhost:27017/notagram', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
})

app.use('/uploads', express.static('uploads'));

//Db connection test
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('SERVER STATUS: running');
});

const corsOptions = {
    exposedHeaders: ['x-auth']
};

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/api/v1', router);

app.listen(2000);