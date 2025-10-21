import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Icon} from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

type Props = {
    position : [number, number];
    venue: string
}

export default function MapExample({position, venue} : Props) {
    return(
      <MapContainer
        key={position.join(',')}
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        className="activity-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={new Icon({iconUrl: markerIconPng})}>
          <Popup>{venue}</Popup>
        </Marker>
      </MapContainer>
    )
} 
