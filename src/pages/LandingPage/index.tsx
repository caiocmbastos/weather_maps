import React, { useState, useEffect, ChangeEvent, FormEvent, useDebugValue } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import './style.css'

import Input from '../../components/Input'

const LandingPage = () => {

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])

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

    return (
        <div id="home-content">
            <header>
                Welcome to Weather Map
            </header>
                <Input
                    type="text"
                    name="search"
                    label="Search: "
                    // value={name}
                    placeholder="Search for a city..."
                />
                <Input
                    type="submit"
                    name="button-search"
                    value="Search"
                />
                <fieldset>
                    <Map center={initialPosition} zoom={10} onclick={handleMapClick} maxZoom={14}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={selectedPosition}/>
                    </Map>
                </fieldset>
        </div>
    )
}

export default LandingPage