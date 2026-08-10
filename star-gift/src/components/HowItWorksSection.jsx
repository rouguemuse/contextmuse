import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    { number: '01', title: 'Purchase your gift', description: 'Begin by choosing the perfect digital star map for your recipient.' },
    { number: '02', title: 'Submit your messages', description: 'Provide the thoughts and memories you want them to discover.' },
    { number: '03', title: 'Receive a private link', description: 'Within 24–48 hours, your unique digital experience is ready.' },
    { number: '04', title: 'Share the experience', description: 'Send the private link and let your words unfold.' }
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <h2 className="section-title text-center">How it works</h2>
        <div className="steps-container fade-in">
          {steps.map((step, index) => (
            <div key={index} className="step-card glass-card">
              <span className="step-number">{step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .how-it-works {
          background: var(--navy);
          position: relative;
        }

        .text-center {
          text-align: center;
          margin-bottom: 5rem;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }

        .step-card {
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.4s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .step-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-5px);
          border-color: var(--gold-soft);
        }

        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: var(--gold);
          margin-bottom: 1.5rem;
          opacity: 0.6;
        }

        .step-title {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
        }

        .step-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .section-title { font-size: 2.2rem; }
          .step-card { padding: 2rem; }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
