import React from 'react';
import { Map as MapContainer , TileLayer } from "react-leaflet";

import "./Map.css";
import {showDataMap} from '../util';

function Map( {casesType, center, countries, zoom}) {
    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataMap(countries, casesType)}
            </MapContainer>
        </div>
    );
}

export default Map;