import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { divIcon } from "leaflet";

type IPMapProps = {
  lat: number;
  lon: number;
  ip: string;
  city: string;
  country: string;
};

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0 && lon !== 0) {
      map.setView([lat, lon], map.getZoom(), { animate: true });
    }
  }, [lat, lon]);
  return null;
}

const customIcon = divIcon({
  html: `<div class="leaflet-marker-bounce__inner"><img src="/navigation-pin.png" alt="" /></div>`,
  className: "leaflet-marker-bounce",
  iconSize: [75, 75],
  iconAnchor: [40, 80],
  popupAnchor: [-3, -76],
});

export default function IPMap({ lat, lon, ip, city, country }: IPMapProps) {
  const cartoKey = import.meta.env.PUBLIC_CARTO_API_KEY as string | undefined;
  const tileUrl = cartoKey
    ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`
    : "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer center={[lat, lon]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
      />
      <Marker key={`${lat}-${lon}`} position={[lat, lon]} icon={customIcon}>
        <Popup>
          {ip} <br /> {city}, {country}
        </Popup>
      </Marker>
      <MapUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
}
