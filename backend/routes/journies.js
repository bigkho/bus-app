const router = require('express').Router();
let Journey = require('../journey');
const axios = require("axios");

async function doGetRequest() {
    await axios.get('http://bustime.mta.info/api/siri/vehicle-monitoring.json?key=56cb8d03-789b-4e75-81d7-bc85d9f7ffc6')
        .then(res => {
            console.log("Data refreshing...")
            console.log(Date.now())
            Journey.deleteMany({}).then(function(){
                monitored = res.data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity
                for(var i=0; i<monitored.length; i++) {
                    busJourney = monitored[i].MonitoredVehicleJourney
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
                    } else {
                        continue
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

            console.log("Data refreshed")
            
        })
        .catch(err => console.log(err))
};

var requestLoop = setInterval(function(){
    doGetRequest()
  }, 60000*5);

router.route('/').get((req,res)=> {
    Journey.find()
        .then(journies => res.json(journies))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/add').post((req,res)=> {
    const busID = req.body.busID;
    const latitude = Number(req.body.location.latitude);
    const longitude = Number(req.body.location.longitude);
    const finalStop = req.body.finalStop;
    const distance = req.body.distance;
    const stop = req.body.stop;
    const expected = Date.parse(req.body.expected);

    const newJourney = new Journey({
        busID,
        location: {
            latitude,
            longitude,
        },
        finalStop,
        distance,
        stop,
        expected
    })

    newJourney.save()
    .then(() => res.json('Journey found'))
    .catch(err => res.status(400).json('Error: ' + err))
});

module.exports = router;