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

const Journey = require('./journey')

async function doGetRequest() {
    await axios.get('http://bustime.mta.info/api/siri/vehicle-monitoring.json?key=56cb8d03-789b-4e75-81d7-bc85d9f7ffc6')
        .then(res => {
            Journey.deleteMany({}).then(function(){
                monitored = res.data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity
                for(var i=0; i<monitored.length; i++) {
                    busJourney = monitored[i].MonitoredVehicleJourney
                    console.log(busJourney)
                    bus = busJourney.PublishedLineName
                    lat = busJourney.VehicleLocation.Latitude
                    long = busJourney.VehicleLocation.Longitude
                    final = busJourney.DestinationName
                    dist = "Data unavailable"
                    stops = "Data unavailable"
                    expecteds = new Date('December 17, 1995 03:24:00')

                    if (busJourney.hasOwnProperty('MonitoredCall')){
                        dist = busJourney.MonitoredCall.Extensions.Distances.PresentableDistance
                        stops = busJourney.MonitoredCall.StopPointName
                        expecteds = busJourney.MonitoredCall.ExpectedArrivalTime
                    }
                    
                    newJourney = new Journey ({
                        busID: bus,
                        location: {
                            latitude: lat,
                            longitude: long,
                        },
                        finalStop: final,
                        distance: dist,
                        stop: stops,
                        expected: expecteds
                    })

                    newJourney.save()
                }
            }).catch(function(error){
                console.log(error); // Failure
            });

            
        })
        .catch(err => console.log(err))
};

doGetRequest()

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});



