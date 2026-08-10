import React, { useContext } from 'react';
import { DealContext } from '../context/DealContext';
import { ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { deals } = useContext(DealContext);

  const totalDeals = deals.length;
  const buyDeals = deals.filter(d => d.status === 'Buy').length;
  const totalProfit = deals.filter(d => d.status === 'Buy').reduce((acc, curr) => acc + (parseFloat(curr.netProfit) || 0), 0);
  const avgROI = buyDeals > 0 
    ? deals.filter(d => d.status === 'Buy').reduce((acc, curr) => acc + (parseFloat(curr.roi) || 0), 0) / buyDeals 
    : 0;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Sourcing Overview</h1>
        <p className="text-muted">High-level metrics for your DealSignal pipeline.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-icon bg-blue"><TrendingUp size={24} /></div>
          <div className="metric-content">
            <h3>${totalProfit.toFixed(2)}</h3>
            <p>Potential Profit (Buy)</p>
          </div>
        </div>
        
        <div className="metric-card glass-panel">
          <div className="metric-icon bg-green"><ArrowUpRight size={24} /></div>
          <div className="metric-content">
            <h3>{avgROI.toFixed(1)}%</h3>
            <p>Average ROI (Buy)</p>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon bg-purple"><CheckCircle2 size={24} /></div>
          <div className="metric-content">
            <h3>{buyDeals}</h3>
            <p>Approved Deals</p>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon bg-orange"><AlertTriangle size={24} /></div>
          <div className="metric-content">
            <h3>{totalDeals}</h3>
            <p>Total Evaluated</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content mt-4">
        <div className="card">
          <h2>Recent Top Deals</h2>
          <div className="table-responsive">
            <table className="deal-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>ROI</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {deals.sort((a, b) => b.score - a.score).slice(0, 5).map(deal => (
                  <tr key={deal.id}>
                    <td>
                      <div className="product-info">
                        <span className="font-semibold">{deal.productName || 'Unnamed Product'}</span>
                        <span className="text-sm text-muted">ASIN: {deal.asin}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${deal.status === 'Buy' ? 'success' : deal.status === 'Skip' ? 'danger' : 'warning'}`}>
                        {deal.status}
                      </span>
                    </td>
                    <td>
                      <div className="score-ring">
                        {deal.score}
                      </div>
                    </td>
                    <td className="font-semibold text-green">{deal.roi}%</td>
                    <td className="font-semibold">${deal.netProfit}</td>
                  </tr>
                ))}
                {deals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted" style={{padding: '2rem'}}>
                      No deals evaluated yet. Add a deal to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
