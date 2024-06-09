import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface mapComponentProps {
  setLongitude: any;
  setLatitude: any;
}

const MapComponent: React.FC<mapComponentProps> = ({
  setLongitude,
  setLatitude,
}) => {
  useEffect(() => {
    const map = L.map("map").setView([-6.3638, 106.8099], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    const marker = L.marker([-6.3638, 106.8099]).addTo(map).openPopup();

    const handleMapClick = (event: any) => {
      const { lat, lng } = event.latlng;
      setLatitude(lat);
      setLongitude(lng);

      marker.setLatLng(event.latlng);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
