import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { DealContext } from '../context/DealContext';
import { Filter, Download, Trash2, Edit } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DealList = () => {
  const { deals, deleteDeal } = useContext(DealContext);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredDeals = filterStatus === 'All' ? deals : deals.filter(d => d.status === filterStatus);

  const exportCSV = () => {
    const headers = ['Product Name', 'ASIN', 'Source Price', 'Amazon Price', 'Profit', 'ROI', 'Status', 'Score'];
    const csvContent = [
      headers.join(','),
      ...filteredDeals.map(d => [
        `"${d.productName}"`, d.asin, d.sourcePrice, d.amazonPrice, d.netProfit, d.roi, d.status, d.score
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'dealsignal_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('DealSignal - Deal Sheet', 14, 15);
    
    const tableData = filteredDeals.map(d => [
      d.productName.substring(0, 30),
      d.asin,
      `$${d.sourcePrice}`,
      `$${d.amazonPrice}`,
      `$${d.netProfit}`,
      `${d.roi}%`,
      d.status
    ]);

    doc.autoTable({
      head: [['Product', 'ASIN', 'Cost', 'AMZ Price', 'Profit', 'ROI', 'Status']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('dealsignal_sheet.pdf');
  };

  return (
    <div className="deal-list-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Deal Database</h1>
          <p className="text-muted">Manage and export your evaluated deals.</p>
        </div>
        <div className="header-actions">
          <button onClick={exportCSV} className="btn btn-secondary"><Download size={16}/> Export CSV</button>
          <button onClick={exportPDF} className="btn btn-secondary"><Download size={16}/> Export PDF</button>
        </div>
      </div>

      <div className="card mb-4" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Filter size={18} className="text-muted" />
        <span className="font-semibold">Filters:</span>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '200px' }}>
          <option value="All">All Statuses</option>
          <option value="Buy">Buy</option>
          <option value="Maybe">Maybe</option>
          <option value="Needs manual review">Needs manual review</option>
          <option value="Skip">Skip</option>
        </select>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="deal-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>ASIN</th>
                <th>Score</th>
                <th>ROI / Profit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map(deal => (
                <tr key={deal.id}>
                  <td>
                    <div className="product-info">
                      <span className="font-semibold">{deal.productName || 'Unnamed Product'}</span>
                      <span className="text-sm text-muted">{deal.category}</span>
                    </div>
                  </td>
                  <td>{deal.asin}</td>
                  <td>
                    <div className="score-ring">{deal.score}</div>
                  </td>
                  <td>
                    <div className="product-info">
                      <span className="font-semibold text-green">{deal.roi}%</span>
                      <span className="text-sm">${deal.netProfit}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${deal.status === 'Buy' ? 'success' : deal.status === 'Skip' ? 'danger' : 'warning'}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/deal/${deal.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => deleteDeal(deal.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDeals.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted" style={{padding: '2rem'}}>
                    No deals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted text-center mt-4">
          Disclaimer: This is a sourcing intelligence tool, not a guarantee of profit. Buyers must verify pricing, restrictions, fees, sales rank, and eligibility inside their own Amazon Seller Central account before buying inventory.
        </p>
      </div>
    </div>
  );
};

export default DealList;
