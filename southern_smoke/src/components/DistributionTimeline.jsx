import React, { useState } from 'react';
import './DistributionTimeline.css';

const timelineData = [
  {
    year: 2024,
    events: [
      { month: "JANUARY", amount: "$269,417" },
      { month: "FEBRUARY", amount: "$128,456" },
      { month: "MARCH", amount: "$55,790" },
      { month: "APRIL", amount: "$96,355" },
      { month: "MAY", amount: "$111,663" },
      { month: "JUNE", amount: "$83,275" },
      { month: "JULY", amount: "$92,930" },
      { month: "AUGUST", amount: "$146,480" },
      { month: "SEPTEMBER", amount: "$131,190" },
      { month: "OCTOBER", amount: "$162,235" },
      { month: "NOVEMBER", amount: "$157,240" },
      { month: "DECEMBER", amount: "$115,455" }
    ]
  },
  {
    year: 2018,
    events: [
      { month: "OCTOBER", amount: "$116,522" },
      { month: "SEPTEMBER", amount: "$10,000", desc: "Hurricane Florence Relief" },
      { month: "SEPTEMBER", amount: "$200,000", desc: "National Multiple Sclerosis Society" },
      { month: "APRIL", amount: "$10,000", desc: "Gulf Seafood Foundation's Helping Hands Effort" }
    ]
  }
];

const DistributionTimeline = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  const activeData = timelineData.find(d => d.year === selectedYear) || { events: [] };

  return (
    <div className="timeline-section">
      <div className="section-header">
        <h2 className="section-title">Distribution of Funds</h2>
      </div>

      <div className="timeline-container">
        {/* Year Sidebar */}
        <div className="year-sidebar">
          {years.map(year => (
            <div 
              key={year} 
              className={`year-tab ${selectedYear === year ? 'active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              <span>{year}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="timeline-content">
          <div className="timeline-header">
            <h3>{selectedYear}</h3>
          </div>
          
          <div className="events-grid">
            {activeData.events.length > 0 ? (
              activeData.events.map((ev, idx) => (
                <div key={idx} className="event-card">
                  <div className="event-month">{ev.month}</div>
                  <div className="event-amount">{ev.amount}</div>
                  {ev.desc && <div className="event-desc">{ev.desc}</div>}
                </div>
              ))
            ) : (
              <div className="no-data">Data for {selectedYear} is currently being updated.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionTimeline;
