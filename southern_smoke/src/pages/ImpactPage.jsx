import React from 'react';
import ImpactMap from '../components/ImpactMap';
import ImpactCharts from '../components/ImpactCharts';
import DistributionTimeline from '../components/DistributionTimeline';
import TestimonialWall from '../components/TestimonialWall';

const ImpactPage = () => {
  return (
    <div className="impact-page">
      <div className="section-header" style={{ paddingTop: '80px', paddingBottom: '40px', textAlign: 'center' }}>
        <h1 className="section-title">Our Impact</h1>
        <p className="section-subtitle">See how the goodwill of many has helped improve the lives of others.</p>
      </div>

      <ImpactMap />
      <DistributionTimeline />
      <ImpactCharts />
      <TestimonialWall />
    </div>
  );
};

export default ImpactPage;
