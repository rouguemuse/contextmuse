import React from 'react';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const features = [
    'private interactive experience',
    'personalized message integration',
    'private viewing link',
    'delivery within 24–48 hours'
  ];

  return (
    <section className="pricing">
      <div className="container">
        <div className="pricing-card glass-card fade-in">
          <div className="pricing-header">
            <h2 className="section-title">Launch price: $29</h2>
            <div className="pricing-info">Includes:</div>
          </div>
          <div className="pricing-features">
            {features.map((feature, index) => (
              <div key={index} className="pricing-feature-item">
                <Check size={20} className="check-icon" />
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
          <div className="pricing-cta">
            <a 
              href="https://contextmuseidentityarchitect.lemonsqueezy.com/checkout/buy/66513569-2bed-4db3-97f6-5b3053ff5f53" 
              className="btn-primary full-width"
            >
              Create Your Star Gift
            </a>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .pricing {
          padding: 8rem 0;
          background: linear-gradient(to bottom, var(--indigo), var(--navy));
        }

        .pricing-card {
          max-width: 500px;
          margin: 0 auto;
          padding: 4rem 3rem;
          text-align: center;
          border-color: var(--gold-soft);
          border-width: 1px;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
        }

        .section-title {
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
          color: var(--gold);
        }

        .pricing-info {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .pricing-features {
          text-align: left;
          max-width: 320px;
          margin: 0 auto 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .pricing-feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .check-icon {
          color: var(--gold);
          flex-shrink: 0;
        }

        .full-width {
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }

        @media (max-width: 768px) {
          .section-title { font-size: 2.2rem; }
          .pricing-card { padding: 3rem 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default PricingSection;
