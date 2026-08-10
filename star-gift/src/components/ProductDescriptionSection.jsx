import React from 'react';

const ProductDescriptionSection = () => {
  return (
    <section className="product-description">
      <div className="container">
        <div className="description-content glass-card fade-in">
          <h2 className="section-title">Interactive Star Gift</h2>
          <p className="description-subline serif">A personalized digital experience delivered as a private web link.</p>
          <div className="description-copy">
            <p>
              Each star reveals one custom message, creating a unique way to share appreciation, affection, or meaningful words that deserve more than a single moment.
            </p>
            <p className="description-highlight">Simple to give. Memorable to receive.</p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .product-description {
          padding: 8rem 0;
          background: var(--navy);
          text-align: center;
        }

        .description-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 5rem 3rem;
          border-color: rgba(212, 175, 55, 0.15);
          position: relative;
        }

        .section-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
        }

        .description-subline {
          font-size: 1.4rem;
          color: var(--gold);
          margin-bottom: 3rem;
          font-style: italic;
        }

        .description-copy {
          font-size: 1.25rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .description-highlight {
          margin-top: 2.5rem;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--text-primary);
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .section-title { font-size: 2.5rem; }
          .description-subline { font-size: 1.2rem; }
          .description-content { padding: 3rem 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default ProductDescriptionSection;
