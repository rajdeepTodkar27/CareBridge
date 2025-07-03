"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";


interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultCenter?: { lat: number; lng: number };
}

const MapPicker = ({ onLocationSelect, defaultCenter }: MapPickerProps) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression>(
    defaultCenter || { lat: 28.6139, lng: 77.2090 }
  );

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        onLocationSelect(lat, lng);
      },
    });

    return <Marker position={markerPosition} />;
  }

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow">
      <MapContainer
        center={markerPosition}
        zoom={10}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
