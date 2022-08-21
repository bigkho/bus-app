const mongoose = require('mongoose');

const journey = new mongoose.Schema({
    busID: String,
    location: {
        latitude: Number,
        longitude: Number,
    },
    finalStop: String,
    distance: String,
    stop: String,
    expected: Date,
});

module.exports = mongoose.model("Journey",journey)

 