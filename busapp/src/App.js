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

const Result = ( {bus, data} ) => {
  let possible = "searching again. Or this train may not be in service."
  let bus_data = []
  for (let i = 0; i < data.length; i++) {
    if (data[i] === undefined) {
      continue
    }
    if (data[i].busID === bus) {
      bus_data.push(data[i])
    }
    if (data[i].busID.includes(bus)) {
      possible = data[i].busID
    }
  }

  return (
    <>
      {bus_data.length===0 ? <h3>No results found. Try {possible} </h3> : <h3>Found {bus_data.length} result(s) for {bus}</h3>}
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

  const handleBusSubmit = (event) => {
    event.preventDefault()
    changeCurrentBus(bus)
    changeBus("")
  }

  const handleChange = (event) => {
    changeBus(event.target.value)
  }

  useEffect(() => {
    axios
    .get('http://localhost:5000/journies')
    .then(response => {
      changeData(JSON.parse(JSON.stringify(response.data)))
      setLoading(false)
    })
  }, [])

  useEffect(()=> {
    Aos.init({duration:2000,easing:'ease'})
  }, [])
  
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
                height: '35vh',
                width: {xs:'80vw', sm:'100%'},
                background: 'linear-gradient(180deg, rgba(7,25,120,1) 0%, rgba(49,82,255,1) 100%)',
                color: 'white',
                fontFamily: 'League Spartan',
                borderRadius: '45px',
                boxSizing: 'inherit',
                marginBottom: '5vh'
            }}
            elevation={12}
            data-aos="fade-down"
        >
          <CardContent
          sx = {{
                    height: '35vh',
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
              <input value = { bus } onChange = { handleChange } />
              <button type = "submit"> Search </button>
            </form>
          </CardContent>
        </Card>
        { loading ? <Skeleton sx={{ bgcolor: '#ddd', width: {xs:'80vw', sm:'100%'} }} variant="rounded" height="35vh"/> : <Result data = {data} bus = { currentBus }/>}
      </Container>
    </div>
  );
}

export default App;
