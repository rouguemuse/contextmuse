import React from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { demographicData } from '../data';
import './ImpactCharts.css';

const COLORS = ['#FFC439', '#ffdf8c', '#e6a822', '#ffebba', '#fff5d6', '#a37511', '#4a3507'];
const MENTAL_COLORS = ['#00A859', '#33b97a', '#66cb9c', '#99dcbd', '#cceede', '#00753e', '#004323'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="label">{`${payload[0].name} : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const ChartRow = ({ title, data, colors }) => {
  return (
    <div className="chart-row">
      <h3 className="chart-row-title">{title}</h3>
      <div className="charts-container">
        
        {/* Gender Chart */}
        <div className="chart-box">
          <h4 className="chart-title">GENDER REPRESENTATION</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.gender}
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#1e1d1d"
                  strokeWidth={1}
                >
                  {data.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px', color: '#1e1d1d' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Race Chart */}
        <div className="chart-box">
          <h4 className="chart-title">RACE REPRESENTATION</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.race}
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#1e1d1d"
                  strokeWidth={1}
                >
                  {data.race.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px', color: '#1e1d1d' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Position Chart (Only if exists) */}
        {data.position && (
          <div className="chart-box">
            <h4 className="chart-title">POSITION REPRESENTATION</h4>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.position}
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="#1e1d1d"
                    strokeWidth={1}
                  >
                    {data.position.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px', color: '#1e1d1d' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const ImpactCharts = () => {
  return (
    <div className="impact-charts-section">
      <ChartRow 
        title="EMERGENCY RELIEF FUND" 
        data={demographicData.emergencyRelief} 
        colors={COLORS} 
      />
      <div style={{ height: '40px' }}></div>
      <ChartRow 
        title="MENTAL HEALTH PROGRAM" 
        data={demographicData.mentalHealth} 
        colors={MENTAL_COLORS} 
      />
    </div>
  );
};

export default ImpactCharts;
