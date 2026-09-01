import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
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

export default function IPMap({ lat, lon, ip, city, country }: IPMapProps) {
  const cartoKey = import.meta.env.PUBLIC_CARTO_API_KEY as string | undefined;
  const tileUrl = cartoKey
    ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`
    : "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";

  const [bounceKey, setBounceKey] = useState(0);
  const [showMarker, setShowMarker] = useState(true);
  useEffect(() => {
    if (lat === 0 && lon === 0) return;
    setShowMarker(false);
    const t = setTimeout(() => {
      setBounceKey((k) => k + 1);
      setShowMarker(true);
    }, 30);
    return () => clearTimeout(t);
  }, [lat, lon]);

  const customIcon = useMemo(
    () =>
      divIcon({
        html: `<div class="leaflet-marker-bounce__inner" data-bounce="${bounceKey}"><img src="/navigation-pin.png" alt="" /></div>`,
        className: "leaflet-marker-bounce",
        iconSize: [75, 75],
        iconAnchor: [40, 80],
      }),
    [bounceKey],
  );

  return (
    <MapContainer center={[lat, lon]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
      />
      {showMarker && (
        <Marker key={`${lat}-${lon}-${bounceKey}`} position={[lat, lon]} icon={customIcon} />
      )}
      <MapUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
}
