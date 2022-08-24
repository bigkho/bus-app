import './App.css';
import { useEffect, useState } from 'react'
import axios from 'axios'
import BusInfo from './Components/BusInfo';
import { Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

const Result = ( {bus, data, location, locRequired} ) => {
  let possible = "searching again. Or this train may not be in service."
  let bus_data = []
  var bus_destination = new Set()
  for (let i = 0; i < data.length; i++) {
    if (data[i] === undefined) {
      continue
    }
    if (data[i].busID === bus && !locRequired) {
      bus_data.push(data[i])
      bus_destination.add(data[i].finalStop)
    }
    if (locRequired) {
      let dist = distance(data[i].location.latitude,data[i].location.longitude,location.latitude,location.longitude)
      if (dist < 1) {
        bus_data.push(data[i])
      }
    }
    if (data[i].busID.includes(bus)) {
      possible = data[i].busID
    }
  }

  const ResultsHeader = styled(Typography)({
    fontFamily: 'League Spartan',
    color: '#000',
    fontSize: '3vh',
    cursor: 'default',
    textAlign: 'left',
  })

  return (
    <>
      <div style={{width:'100%',margin:'5vh 10vw'}}>
        {locRequired? <ResultsHeader>{location.city}, {location.state}</ResultsHeader> : <ResultsHeader>Results for {bus}</ResultsHeader>}
        {bus_data.length===0 ? <ResultsHeader>No results found. Try {possible} </ResultsHeader> : <ResultsHeader>Found {bus_data.length} bus(es)</ResultsHeader>}
      </div>
      <Container disableGutters maxWidth='false'
        sx={{
          display: 'grid', 
          gridGap: '10vh 10vw', 
          justifyContent:'space-evenly',
          gridTemplateColumns: {xs:'1 1fr',sm:'repeat(2, 1fr)'}}}>
        {bus_data.map((bus,x)=> <BusInfo data-aos="fade-down" key = {x} id={bus.busID} stop={bus.stop} distance={bus.distance} expected={bus.finalStop} />) }
      </Container>
    </>
  )
}

export const CardHeader = styled(Typography)({
  fontFamily: 'League Spartan',
  color: '#fff',
  fontSize: '5vh',
  cursor: 'default',
  textAlign: 'left',
  fontWeight: 900,
  lineHeight: 1,
  paddingBottom: '1vh',

  "@media (max-width:600px)": {
      fontSize: '4vh',
  },
})

export const CardHeader2 = styled(Typography)({
  fontFamily: 'League Spartan',
  color: '#ccc',
  fontSize: '3vh',
  cursor: 'default',
  textAlign: 'left',
  fontWeight: 900,

  "@media (max-width:600px)": {
      fontSize: '2vh',
  },
})




const App = () => {
  const [ bus, changeBus ] = useState('')
  const [ data, changeData ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ currentBus, changeCurrentBus ] = useState('Q53-SBS')
  const [ locationData, setLocationData ] = useState([])
  const [ locationRequired, setLocationRequired ] = useState(false)
  const [ busIds, setBusIds ] = useState([])

  const handleBusSubmit = (event) => {
    event.preventDefault()
    changeCurrentBus(bus)
    changeBus("")
    setLocationRequired(false)
  }

  const handleBusSubmit2 = (event) => {
    event.preventDefault()
    handleLR()
  }

  const handleLR = () => {
    setLocationRequired(true)
  }
  

  const handleChange = (event, value) => {
    changeBus(value)
  }

  useEffect(() => {
    console.log('rendered')

    axios
    .get('http://localhost:5000/journies')
    .then(response => {
      changeData(JSON.parse(JSON.stringify(response.data)))
      setLoading(false)
      let temp = new Set()
      for (let i = 0; i < data.length; i++) {
        if (data[i] === undefined) {
          continue
        }
        temp.add(data[i].busID)
      }
      setBusIds([...temp])
    })

    axios
    .get('https://geolocation-db.com/json/d802faa0-10bd-11ec-b2fe-47a0872c6708')
    .then(res => {
      setLocationData(res.data)
      console.log("Acquired user location data.")
    })

  }, [currentBus, data])

  useEffect(()=> {
    Aos.init({duration:2000,easing:'ease'})
  }, [])
  

  console.log(bus)

  return (
    <div>
      <Container disableGutters maxWidth='false' sx={{    
        alignItems: 'center',
        height: 'fit-content',
        margin: '0px',
        width: '100%',
        padding: '5vh 20vw',
        display: 'flex',
        flexDirection: 'column',
        }}
      >
        <Card
        sx = {{
                height: '45vh',
                width: {xs:'80vw', sm:'100%'},
                background: 'linear-gradient(180deg, rgba(7,25,120,1) 0%, rgba(49,82,255,1) 100%)',
                color: 'white',
                fontFamily: 'League Spartan',
                borderRadius: '45px',
                boxSizing: 'inherit',
            }}
            elevation={12}
            data-aos="fade-down"
        >
          <CardContent
          sx = {{
                    height: '45vh',
                    width: '100%',
                    boxSizing: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between',
                    padding: {xs:'4vh 6vw !important',sm:'5% !important'},
                }}
          >
            <div>
              <CardHeader>Search for a bus in your area</CardHeader>
              <CardHeader2>Ex: Q53-SBS, Q56</CardHeader2>
            </div>
            <form onSubmit = {handleBusSubmit}>
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={busIds.map((option) => option)}
                onInputChange = {handleChange}
                renderInput={(params) =>
                <TextField {...params} label="Search bus" value = { bus } 
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                  sx = {{
                    width:{xs:'100%',sm:'10vw'},
                    '& input:valid + fieldset': {
                      borderColor: 'white',
                      borderWidth: 2,
                      borderRadius: 4,
                    },
                    '& label.MuiInputLabel-root': {
                        color: 'white',
                      },
                    '& .MuiInput-underline:after': {
                      color: 'white',
                      borderBottomColor: 'white',
                      },
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        color: 'white',
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        color: 'white',
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        color: 'white',
                        borderColor: 'white',
                      },
                    },
                  }}
                />}
              />
            </form>
            <div>
              <CardHeader sx={{p:0}}>Or see what's in your area</CardHeader>
            </div>
            <form onSubmit = {handleBusSubmit2}>
              <Button type="submit" variant="contained"
                sx={{
                  width: {xs:'100%',sm:'fit-content'},
                  background:'#fff',
                  color: '#000',
                  borderRadius: 4,
                  fontWeight: 600,
                  transition: 'background 500ms ease',
                  '&:hover': {
                    background:'#ccc',
                  }
                }}
              >
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
        { loading ? 
        <Skeleton sx={{ bgcolor: '#ddd', width: {xs:'80vw', sm:'100%', borderRadius: '45px'} }} variant="rounded" height="35vh"/> : 
        <Result data = {data} bus = { currentBus } location = { locationData } locRequired = { locationRequired }/>}
      </Container>
    </div>
  );
}

export default App;
