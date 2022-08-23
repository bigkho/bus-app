import './App.css';
import { useEffect, useState } from 'react'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavbarComp from "./components/NavbarComp";

const Result = ( {bus, data} ) => {
  let bus_data = []
  for (let i = 0; i < data.length; i++) {
    if (data[i] === undefined) {
      continue
    }
    if (data[i].busID === bus) {
      console.log(typeof data[i].expected)
      bus_data.push(data[i])
    }
  }

  console.log(bus_data)
  

  return (
    <div>
      {bus_data.map((bus,id)=> <p key = {id}>{bus.stop} {bus.distance} {bus.expected}</p>)}
    </div>
  )
}


const App = () => {
  const [ bus, changeBus ] = useState('')
  const [ data, changeData ] = useState([])

  const [ currentBus, changeCurrentBus ] = useState('')

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
      changeData(JSON.parse(JSON.stringify(response.data)))})
  }, [])
  
  return (
    <div>
      <form onSubmit = {handleBusSubmit}>
        <input value = { bus } onChange = { handleChange } />
        <button type = "submit"> Submit </button>
      </form>
      <Result data = {data} bus = { currentBus }/> 
    </div>

    
  );
}

function HomePage() {
  return (
    <Router>
      <div>
        <NavbarComp />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        
      </Routes>

      <div>
      
      </div>
    </Router>
  );
}


export default App;
