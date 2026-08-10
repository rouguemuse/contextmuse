import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DealContext } from '../context/DealContext';
import { calculateFinancials } from '../utils/scoring';

const AddDeal = () => {
  const { addDeal } = useContext(DealContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    sourceStore: '',
    sourceUrl: '',
    sourcePrice: '',
    asin: '',
    amazonUrl: '',
    amazonPrice: '',
    estimatedFees: '',
    prepCost: '',
    category: 'Home & Kitchen',
    salesRank: '',
    brand: '',
    restriction: 'Ungated',
    competition: 'Low',
    notes: '',
    status: 'Needs manual review'
  });

  const [calculated, setCalculated] = useState({
    netProfit: '0.00',
    roi: '0.00',
    margin: '0.00'
  });

  useEffect(() => {
    const res = calculateFinancials(
      formData.sourcePrice,
      formData.amazonPrice,
      formData.estimatedFees,
      formData.prepCost
    );
    setCalculated(res);
  }, [formData.sourcePrice, formData.amazonPrice, formData.estimatedFees, formData.prepCost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addDeal({ ...formData, ...calculated });
    navigate('/deals');
  };

  return (
    <div className="add-deal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header mb-4">
        <h1>Add New Deal</h1>
        <p className="text-muted">Enter product details to calculate score and viability.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 className="mb-4">Product Details</h3>
        <div className="form-row">
          <div className="form-group" style={{flex: 2}}>
            <label>Product Name</label>
            <input required type="text" name="productName" value={formData.productName} onChange={handleChange} className="w-full" />
          </div>
          <div className="form-group">
            <label>ASIN</label>
            <input required type="text" name="asin" value={formData.asin} onChange={handleChange} className="w-full" />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full">
              <option>Home & Kitchen</option>
              <option>Toys & Games</option>
              <option>Beauty</option>
              <option>Electronics</option>
              <option>Grocery</option>
            </select>
          </div>
          <div className="form-group">
            <label>Sales Rank (BSR)</label>
            <input type="number" name="salesRank" value={formData.salesRank} onChange={handleChange} className="w-full" />
          </div>
        </div>

        <h3 className="mt-4 mb-4">Sourcing & Pricing</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Source Store</label>
            <input type="text" name="sourceStore" value={formData.sourceStore} onChange={handleChange} className="w-full" />
          </div>
          <div className="form-group">
            <label>Source Price ($)</label>
            <input required type="number" step="0.01" name="sourcePrice" value={formData.sourcePrice} onChange={handleChange} className="w-full" />
          </div>
          <div className="form-group">
            <label>Amazon Buy Box ($)</label>
            <input required type="number" step="0.01" name="amazonPrice" value={formData.amazonPrice} onChange={handleChange} className="w-full" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Estimated FBA Fees ($)</label>
            <input type="number" step="0.01" name="estimatedFees" value={formData.estimatedFees} onChange={handleChange} className="w-full" />
          </div>
          <div className="form-group">
            <label>Prep/Shipping Cost ($)</label>
            <input type="number" step="0.01" name="prepCost" value={formData.prepCost} onChange={handleChange} className="w-full" />
          </div>
        </div>

        <div className="glass-panel mt-4 mb-4" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-around', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
          <div className="text-center">
            <span className="text-muted text-sm block">Net Profit</span>
            <span className={`text-xl font-semibold ${parseFloat(calculated.netProfit) > 0 ? 'text-green' : 'text-danger'}`}>
              ${calculated.netProfit}
            </span>
          </div>
          <div className="text-center">
            <span className="text-muted text-sm block">ROI</span>
            <span className={`text-xl font-semibold ${parseFloat(calculated.roi) > 30 ? 'text-green' : 'text-warning'}`}>
              {calculated.roi}%
            </span>
          </div>
          <div className="text-center">
            <span className="text-muted text-sm block">Margin</span>
            <span className="text-xl font-semibold text-accent">{calculated.margin}%</span>
          </div>
        </div>

        <h3 className="mt-4 mb-4">Risk & Status</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Restriction Risk</label>
            <select name="restriction" value={formData.restriction} onChange={handleChange} className="w-full">
              <option>Ungated</option>
              <option>Requires Approval</option>
              <option>Gated</option>
              <option>IP Claim Risk</option>
            </select>
          </div>
          <div className="form-group">
            <label>Competition Level</label>
            <select name="competition" value={formData.competition} onChange={handleChange} className="w-full">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full">
              <option>Buy</option>
              <option>Maybe</option>
              <option>Needs manual review</option>
              <option>Skip</option>
            </select>
          </div>
        </div>

        <div className="form-group mt-4">
          <label>Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full" rows="3"></textarea>
        </div>

        <div className="form-group mt-4">
          <button type="submit" className="btn btn-primary w-full">Evaluate & Save Deal</button>
        </div>
        
        <p className="text-xs text-muted text-center mt-4">
          Disclaimer: This tool provides estimates only. Always verify pricing, fees, and restrictions in Seller Central.
        </p>
      </form>
    </div>
  );
};

export default AddDeal;
