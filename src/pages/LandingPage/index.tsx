import React, { useState, useEffect } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import api from  '../../services/api'

import './style.css'

import Input from '../../components/Input'
import { act } from 'react-dom/test-utils'

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

interface SelectedCity {
    name: string
    id: number
    coord: {
        lat: number
        lon:number
    }
    main: {
        temp: number
        temp_min: number
        temp_max: number
    }
}

const LandingPage = () => {

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
    const [weather, setWeather] = useState<APIResponse[]>([])
    const [activeCity, setActiveCity] = useState<SelectedCity | null>(null)

    const APPID = process.env.REACT_APP_WEATHER_API_KEY

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

    async function searchWeather() {
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
                                onclick={() => {
                                    setActiveCity(city)
                                }}
                            />
                        ))}
                        {activeCity && (
                            <Popup
                                position={[activeCity.coord.lat, activeCity.coord.lon]}
                                onClose={() => {
                                    setActiveCity(null)
                                }}
                            >
                                <div>
                                    <h2>Name: {activeCity.name}</h2>
                                    <p>Current Temperature: {activeCity.main.temp}</p>
                                    <p>Maximum Temperature: {activeCity.main.temp_max}</p>
                                    <p>Minimum Temperature: {activeCity.main.temp_min}</p>
                                </div>
                            </Popup>
                        )}
                    </Map>
                </fieldset>
        </div>
    )
}

export default LandingPage