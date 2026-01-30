import React from "react";
import "./geomap-map.css";

const GeoThreatMap = () => {
  return (
    <div className="geo-map">
      {/* Fake world map background (for now, professional look) */}
      <div className="world-map"></div>

      {/* Heat points */}
      <span className="heat us" title="USA: High Threat"></span>
      <span className="heat russia" title="Russia: High Threat"></span>
      <span className="heat china" title="China: Medium Threat"></span>
      <span className="heat india" title="India: Medium Threat"></span>
      <span className="heat brazil" title="Brazil: Medium Threat"></span>
    </div>
  );
};

export default GeoThreatMap;
