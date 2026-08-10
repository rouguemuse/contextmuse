import React from 'react';
import { Check, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h2 className="logo-text">Deal<span className="text-accent">Signal</span> <span className="text-muted text-sm font-normal ml-2">Lists</span></h2>
        </div>
        <div>
          <button className="btn btn-secondary mr-4">Sign In</button>
          <button className="btn btn-primary">Subscribe Now</button>
        </div>
      </nav>

      <header className="hero-section text-center">
        <h1 className="hero-title">Exclusive FBA Leads. <br/><span className="text-accent">Vetted for Profit.</span></h1>
        <p className="hero-subtitle">Stop guessing. Get high-ROI, low-competition Amazon FBA leads delivered straight to your inbox daily, powered by DealSignal's proprietary scoring algorithm.</p>
        <button className="btn btn-primary btn-lg mt-4">View Sample Deals</button>
      </header>

      <section className="features-section">
        <div className="feature-card glass-panel">
          <Zap size={32} className="text-accent mb-4" />
          <h3>High Velocity</h3>
          <p className="text-muted text-sm">We filter for top 1% BSR to ensure your inventory moves fast, so your capital isn't tied up.</p>
        </div>
        <div className="feature-card glass-panel">
          <TrendingUp size={32} className="text-green mb-4" />
          <h3>Vetted Margins</h3>
          <p className="text-muted text-sm">Every lead is calculated against current FBA fees, prep costs, and buy box prices.</p>
        </div>
        <div className="feature-card glass-panel">
          <ShieldCheck size={32} className="text-purple mb-4" />
          <h3>Risk Assessment</h3>
          <p className="text-muted text-sm">We flag IP risks, hazmat, and gating requirements so you know exactly what you're buying.</p>
        </div>
      </section>

      <section className="pricing-section text-center">
        <h2>Choose Your Plan</h2>
        <div className="pricing-cards mt-4">
          <div className="pricing-card card">
            <h3>Starter List</h3>
            <div className="price"><span className="text-accent">$99</span>/mo</div>
            <ul className="pricing-features">
              <li><Check size={16} className="text-green" /> 3-5 leads per day</li>
              <li><Check size={16} className="text-green" /> Min 30% ROI</li>
              <li><Check size={16} className="text-green" /> Standard Categories</li>
            </ul>
            <button className="btn btn-secondary w-full">Subscribe</button>
          </div>
          <div className="pricing-card card border-accent">
            <div className="badge badge-success mb-2" style={{margin: '0 auto'}}>Most Popular</div>
            <h3>Pro List</h3>
            <div className="price"><span className="text-accent">$249</span>/mo</div>
            <ul className="pricing-features">
              <li><Check size={16} className="text-green" /> 10-15 leads per day</li>
              <li><Check size={16} className="text-green" /> Min 40% ROI</li>
              <li><Check size={16} className="text-green" /> Ungated & Grocery</li>
              <li><Check size={16} className="text-green" /> DealSignal Confidence Score</li>
            </ul>
            <button className="btn btn-primary w-full">Subscribe</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer text-center mt-4">
        <p className="text-sm text-muted">© 2026 DealSignal. All rights reserved.</p>
        <p className="text-xs text-muted mt-2 max-w-2xl mx-auto">
          Disclaimer: DealSignal provides sourcing intelligence and estimates. Past performance is not indicative of future results. Buyers must verify pricing, restrictions, fees, and eligibility inside their own Seller Central account before purchasing inventory.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
