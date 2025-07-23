import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { Icon } from "leaflet";

type IPMapProps = {
  lat: number;
  lon: number;
  isDark: boolean;
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

const customIcon = new Icon({
  iconUrl: "./navigation-pin.png",
  iconSize: [75, 75],
  iconAnchor: [40, 80],
  popupAnchor: [-3, -76],
});

export default function IPMap({
  lat,
  lon,
  isDark,
  ip,
  city,
  country,
}: IPMapProps) {
  return (
    <MapContainer center={[lat, lon]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={
          "https://{s}.basemaps.cartocdn.com/rastertiles/" +
          (isDark ? "dark_all" : "voyager") +
          '/{z}/{x}/{y}{r}.png"'
        }
      />
      <Marker position={[lat, lon]} icon={customIcon}>
        <Popup>
          {ip} <br /> {city}, {country}
        </Popup>
      </Marker>
      <MapUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
}
