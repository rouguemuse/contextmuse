import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content fade-in">
          <h1 className="hero-title">A private gift made from your words</h1>
          <p className="hero-subtitle">
            Each star reveals one message, creating a meaningful experience they can return to again and again.
          </p>
          <div className="hero-actions">
            <a 
              href="https://contextmuseidentityarchitect.lemonsqueezy.com/checkout/buy/66513569-2bed-4db3-97f6-5b3053ff5f53" 
              className="btn-primary"
            >
              Create Your Star Gift
            </a>
            <div className="hero-reassurance">
              <span>Delivered as a private link</span>
              <span className="dot"></span>
              <span>Mobile friendly</span>
              <span className="dot"></span>
              <span>Ready in 24–48 hours</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          {/* Constellation Preview - Minimal & Glowing */}
          <div className="constellation-preview">
            <div className="star s1"></div>
            <div className="star s2"></div>
            <div className="star s3"></div>
            <div className="star s4"></div>
            <div className="star s5"></div>
            <div className="line l1"></div>
            <div className="line l2"></div>
            <div className="line l3"></div>
            <div className="line l4"></div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: 4rem;
        }
        
        .hero-title {
          font-size: clamp(3rem, 8vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 1.5rem;
          max-width: 800px;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 500px;
          margin-bottom: 3rem;
          font-weight: 300;
        }
        
        .hero-reassurance {
          margin-top: 2rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0.8;
        }
        
        .dot {
          width: 4px;
          height: 4px;
          background: var(--gold-soft);
          border-radius: 50%;
        }

        .hero-visual {
          position: absolute;
          right: -10%;
          top: 15%;
          width: 60%;
          height: 70%;
          z-index: -1;
          opacity: 0.6;
        }

        .constellation-preview {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .star {
          position: absolute;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 15px 4px var(--gold-soft);
          animation: pulse 4s infinite ease-in-out;
        }

        .s1 { top: 20%; left: 40%; }
        .s2 { top: 35%; left: 60%; animation-delay: 1s; }
        .s3 { top: 60%; left: 55%; animation-delay: 2s; }
        .s4 { top: 55%; left: 30%; animation-delay: 0.5s; }
        .s5 { top: 30%; left: 20%; animation-delay: 1.5s; }

        .line {
          position: absolute;
          background: rgba(212, 175, 55, 0.1);
          height: 1px;
          transform-origin: left center;
        }

        .l1 { width: 25%; top: 20%; left: 40%; transform: rotate(35deg); }
        .l2 { width: 20%; top: 35%; left: 60%; transform: rotate(130deg); }
        .l3 { width: 30%; top: 60%; left: 55%; transform: rotate(190deg); }
        .l4 { width: 15%; top: 55%; left: 30%; transform: rotate(290deg); }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @media (max-width: 768px) {
          .hero { padding-top: 2rem; text-align: center; }
          .hero-content { display: flex; flex-direction: column; align-items: center; }
          .hero-visual { right: 0; top: 40%; width: 100%; opacity: 0.3; }
          .hero-reassurance { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
