import React from 'react';
import { Star, Eye, Smartphone, Clock, Award } from 'lucide-react';

const FeaturesSection = () => {
  const experiences = [
    { icon: <Star size={24} />, text: 'calm interactive star field' },
    { icon: <Award size={24} />, text: 'one message revealed per star' },
    { icon: <Eye size={24} />, text: 'private viewing link' },
    { icon: <Smartphone size={24} />, text: 'mobile-friendly design' },
    { icon: <Clock size={24} />, text: 'meaningful digital keepsake' }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-grid glass-card">
          <div className="features-header">
            <h2 className="section-title">What they experience</h2>
          </div>
          <div className="features-list">
            {experiences.map((exp, index) => (
              <div key={index} className="feature-item fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="feature-icon">{exp.icon}</span>
                <p className="feature-text">{exp.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .features {
          padding: 8rem 0;
          background: linear-gradient(to bottom, var(--navy), var(--indigo));
        }

        .features-grid {
          padding: 4rem;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
          align-items: center;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .features-header .section-title {
          font-size: 3rem;
          margin: 0;
          line-height: 1.2;
        }

        .features-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(212, 175, 55, 0.03);
          border-color: var(--gold-soft);
          transform: translateX(5px);
        }

        .feature-icon {
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-text {
          font-size: 1.1rem;
          margin: 0;
          color: var(--text-secondary);
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr;
            padding: 3rem 2rem;
            text-align: center;
            gap: 3rem;
          }
          .feature-item { justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
