import React, { useState, useEffect } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import api from  '../../services/api'

import './style.css'

import Input from '../../components/Input'

interface APIResponse {
    id: number
    name: string
    coord: {
        lat: number
        lon: number
    }
    main: {
        temp: number
        temp_min: number
        temp_max: number
    }
}

// interface ActiveCity {
//     prevState: null
// }

const LandingPage = () => {

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
    const [weather, setWeather] = useState<APIResponse[]>([])

    const APPID = process.env.REACT_APP_OPENWEATHER_API_KEY

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }
    
    const lat = selectedPosition[0]
    const lon = selectedPosition[1]
    const cnt = 15
    const units = "metric"

    async function searchWeather(){
        const response = await api.get('/find', {
            params: {
                lat,
                lon,
                cnt,
                units,
                APPID
            }
        })
        setWeather(response.data.list)
    }

    return (
        <div id="home-content">
            <header>
                Welcome to Weather Map
            </header>
                <Input
                    type="submit"
                    name="button-search"
                    value="Search"
                    onClick={searchWeather}
                />
                <fieldset>
                    <Map center={initialPosition} zoom={10} onclick={handleMapClick} maxZoom={14}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={selectedPosition} />
                        {weather.map(city => (
                            <Marker
                                key={city.id}
                                position={[city.coord.lat, city.coord.lon]}
                                onclick={handleMapClick}
                            />
                        ))}
                    </Map>
                </fieldset>
        </div>
    )
}

export default LandingPage