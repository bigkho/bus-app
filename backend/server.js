const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const axios = require("axios");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const connection = mongoose.connection
connection.once('open', () => {
    console.log('Connected to database');
});

const journiesRouter = require('./routes/journies');
app.use('/journies',journiesRouter);

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});



