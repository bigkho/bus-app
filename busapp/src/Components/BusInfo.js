import React from 'react';
import {useEffect } from 'react';
import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Aos from 'aos';
import 'aos/dist/aos.css';

export const CardHeader = styled(Typography)({
    fontFamily: 'League Spartan',
    color: '#fff',
    fontSize: '5vh',
    cursor: 'default',
    textAlign: 'left',
    fontWeight: 900,
  
    "@media (max-width:600px)": {
        fontSize: '4vh',
    },
})

export const CardHeader2 = styled(Typography)({
    fontFamily: 'League Spartan',
    color: '#fff',
    fontSize: '3vh',
    cursor: 'default',
    textAlign: 'left',
    fontWeight: 900,
  
    "@media (max-width:600px)": {
        fontSize: '3vh',
    },
})

export const CardSubHeader = styled(Typography)({
    fontFamily: 'League Spartan',
    color: '#fff',
    fontSize: '2vh',
    cursor: 'default',
    textAlign: 'left',
    fontWeight: 900,
  
    "@media (max-width:600px)": {
        fontSize: '2vh',
    },
})



const BusInfo = ({id, stop, distance, finalStop, expected}) => {

    var timeString = new Date(expected).toLocaleTimeString()
    var diff = Math.floor((new Date(expected) - new Date()) / 60000)
    var timeDiff = 0
    if (diff>=0) {
        timeDiff = diff
    }

    useEffect(()=> {
        Aos.init({duration:2000,easing:'ease'})
      }, [])


  return (
    <>
        <Card
            sx = {{
                height: {xs:'45vh', sm:'35vh'},
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
                    height: {xs:'45vh', sm:'35vh'},
                    width: '100%',
                    boxSizing: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between',
                    padding: {xs:'4vh 6vw !important',sm:'5% !important'},
                }}
            >
                <div>
                    <CardHeader>{id}</CardHeader>
                    <CardSubHeader>{finalStop}</CardSubHeader>
                </div>
                <div>
                    <CardSubHeader>{timeDiff} min away</CardSubHeader>
                    <CardHeader2>{distance}</CardHeader2>
                    <CardHeader2>{stop}</CardHeader2>
                </div>
            </CardContent>
        </Card>
    </>
  )
}

export default BusInfo