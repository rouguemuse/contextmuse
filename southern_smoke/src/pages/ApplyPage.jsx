import React from 'react';
import FaqSection from '../components/FaqSection';

const ApplyPage = () => {
  return (
    <div className="apply-page">
      <div className="section-header" style={{ paddingTop: '80px', paddingBottom: '40px', textAlign: 'center' }}>
        <h1 className="section-title">Apply for Assistance</h1>
        <p className="section-subtitle">We're here for food and beverage workers in crisis.</p>
      </div>

      <FaqSection />
    </div>
  );
};

export default ApplyPage;
