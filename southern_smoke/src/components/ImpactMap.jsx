import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { stateFinanceData } from '../data';
import './ImpactMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Map FIPS codes to State Abbreviations (we only need the ones for the data)
const fipsToState = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT",
  "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL",
  "18": "IN", "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD",
  "25": "MA", "26": "MI", "27": "MN", "28": "MS", "29": "MO", "30": "MT", "31": "NE",
  "32": "NV", "33": "NH", "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
  "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA", "54": "WV",
  "55": "WI", "56": "WY", "72": "PR"
};

const ImpactMap = () => {
  const [tooltipContent, setTooltipContent] = useState('');

  return (
    <div className="impact-map-container">
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color yellow"></span>
          Emergency Relief Available
        </div>
        <div className="legend-item">
          <span className="legend-color green"></span>
          Emergency Relief & Mental Health
        </div>
      </div>

      <ComposableMap projection="geoAlbersUsa" className="us-map">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const stateAbbr = fipsToState[geo.id];
              const stateData = stateFinanceData[stateAbbr];
              
              // Determine color based on data
              let fillColor = "#F1EDE4"; // default light gray
              if (stateData) {
                if (stateData.counseling && stateData.counseling !== "") {
                  fillColor = "#00A859"; // Green for Mental Health + Relief
                } else if (stateData.emergency && stateData.emergency !== "$0") {
                  fillColor = "#FFC439"; // Yellow for just Relief
                }
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#1e1d1d"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none', transition: 'all 250ms' },
                    hover: { fill: '#1e1d1d', outline: 'none', cursor: 'pointer' },
                    pressed: { outline: 'none' },
                  }}
                  data-tooltip-id="map-tooltip"
                  onMouseEnter={() => {
                    if (stateData) {
                      setTooltipContent(`
                        <div class="tt-header">${geo.properties.name}</div>
                        <div class="tt-row"><span>Distributed Funds:</span> <strong>${stateData.emergency || '$0'}</strong></div>
                        ${stateData.counseling ? `<div class="tt-row"><span>Counseling Sessions:</span> <strong>${stateData.counseling}</strong></div>` : ''}
                        ${stateData.partners ? `<div class="tt-row"><span>Mental Health Partners:</span> <strong>${stateData.partners}</strong></div>` : ''}
                      `);
                    } else {
                      setTooltipContent(`<div class="tt-header">${geo.properties.name}</div><div class="tt-row">No data available</div>`);
                    }
                  }}
                  onMouseLeave={() => setTooltipContent('')}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      
      <Tooltip 
        id="map-tooltip" 
        className="map-tooltip" 
        html={tooltipContent}
        float
      />
    </div>
  );
};

export default ImpactMap;
