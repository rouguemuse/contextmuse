import React from 'react';

const OccasionsSection = () => {
  const occasions = [
    'anniversaries',
    'birthdays',
    'long-distance relationships',
    'friendship appreciation',
    'memorial messages',
    'milestones',
    'just because'
  ];

  return (
    <section className="occasions">
      <div className="container">
        <div className="occasions-wrapper fade-in">
          <h2 className="section-title text-center">Perfect for...</h2>
          <div className="occasions-grid">
            {occasions.map((occ, index) => (
              <div key={index} className="occasion-tag glass-card">
                {occ}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .occasions {
          padding: 6rem 0;
          background: var(--navy);
        }

        .occasions-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 4rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .occasion-tag {
          padding: 1.2rem 2.5rem;
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .occasion-tag:hover {
          border-color: var(--gold);
          background: rgba(212, 175, 55, 0.05);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .text-center {
          text-align: center;
        }

        @media (max-width: 768px) {
          .occasion-tag { padding: 1rem 1.8rem; font-size: 1.1rem; }
          .occasions-grid { gap: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default OccasionsSection;
