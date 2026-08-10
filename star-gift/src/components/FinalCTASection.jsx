import React from 'react';

const FinalCTASection = () => {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="cta-content fade-in">
          <h2 className="section-title text-center">Some words are meant to be discovered slowly.</h2>
          <div className="cta-action text-center">
            <a 
              href="https://contextmuseidentityarchitect.lemonsqueezy.com/checkout/buy/66513569-2bed-4db3-97f6-5b3053ff5f53" 
              className="btn-primary"
            >
              Create Your Star Gift
            </a>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .final-cta {
          padding: 12rem 0;
          background: radial-gradient(circle at center, var(--indigo) 0%, var(--navy) 100%);
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          text-align: center;
        }

        .section-title {
          font-size: 3.2rem;
          margin-bottom: 4rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.3;
        }

        .cta-action {
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .section-title { font-size: 2.2rem; padding: 0 1rem; }
        }
      `}</style>
    </section>
  );
};

export default FinalCTASection;
