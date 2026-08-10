import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DealContext } from '../context/DealContext';

const DealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deals, updateDeal, deleteDeal } = useContext(DealContext);
  
  const deal = deals.find(d => d.id === id);
  const [status, setStatus] = useState(deal ? deal.status : '');
  const [notes, setNotes] = useState(deal ? deal.notes : '');

  if (!deal) return <div className="page-content">Deal not found.</div>;

  const handleSave = () => {
    updateDeal(id, { status, notes });
    navigate('/deals');
  };

  const handleDelete = () => {
    deleteDeal(id);
    navigate('/deals');
  };

  return (
    <div className="deal-detail-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Deal Analysis: {deal.asin}</h1>
          <p className="text-muted">{deal.productName}</p>
        </div>
        <div className="score-ring" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
          {deal.score}
        </div>
      </div>

      <div className="card mb-4">
        <h3>Metrics Overview</h3>
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-sm text-muted">Net Profit</p>
            <p className="text-xl font-semibold">${deal.netProfit}</p>
          </div>
          <div>
            <p className="text-sm text-muted">ROI</p>
            <p className="text-xl font-semibold">{deal.roi}%</p>
          </div>
          <div>
            <p className="text-sm text-muted">Margin</p>
            <p className="text-xl font-semibold">{deal.margin}%</p>
          </div>
          <div>
            <p className="text-sm text-muted">Sales Rank</p>
            <p className="text-xl font-semibold">{deal.salesRank || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h3>Quick Edit</h3>
        <div className="form-group mt-4">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full">
            <option>Buy</option>
            <option>Maybe</option>
            <option>Needs manual review</option>
            <option>Skip</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full" rows="4"></textarea>
        </div>
        
        <div className="flex gap-4 mt-4">
          <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
          <button onClick={handleDelete} className="btn btn-danger">Delete Deal</button>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;
