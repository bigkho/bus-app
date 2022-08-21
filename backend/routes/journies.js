const router = require('express').Router();
let Journey = require('../journey');

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