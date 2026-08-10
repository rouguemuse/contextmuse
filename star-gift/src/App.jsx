import React from 'react';
import HeroSection from './components/HeroSection';
import ExperienceSection from './components/ExperienceSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import OccasionsSection from './components/OccasionsSection';
import ProductDescriptionSection from './components/ProductDescriptionSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import FinalCTASection from './components/FinalCTASection';

function App() {
  return (
    <div className="app">
      <HeroSection />
      <ExperienceSection />
      <HowItWorksSection />
      <FeaturesSection />
      <OccasionsSection />
      <ProductDescriptionSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      
      {/* Footer - Minimal */}
      <footer className="footer container">
        <div className="footer-content">
          <p className="copyright">© {new Date().getFullYear()} Interactive Star Gift. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      <style jsx="true">{`
        .app {
          position: relative;
          z-index: 1;
        }

        .footer {
          padding: 4rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 4rem;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--gold);
        }

        @media (max-width: 640px) {
          .footer-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
