import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div style={{ padding: '100px 40px', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--brand-black)', marginBottom: '20px' }}>
        {title}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
        This page is coming soon. We're currently upgrading the Southern Smoke Foundation experience.
      </p>
    </div>
  );
};

export default PlaceholderPage;
