import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ImpactPage from './pages/ImpactPage'
import ApplyPage from './pages/ApplyPage'
import PlaceholderPage from './pages/PlaceholderPage'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation Header */}
        <header className="site-header">
          <div className="header-logo">
            <Link to="/">SOUTHERN SMOKE FOUNDATION</Link>
          </div>
          <nav className="header-nav">
            <ul className="nav-links">
              <li><Link to="/about">ABOUT</Link></li>
              <li><Link to="/programs">PROGRAMS</Link></li>
              <li><Link to="/how-to-help">HOW TO HELP</Link></li>
              <li><Link to="/events">EVENTS</Link></li>
              <li><Link to="/shop">SHOP</Link></li>
            </ul>
          </nav>
          <div className="header-actions">
            <Link to="/donate" className="btn-primary donate-btn">DONATE</Link>
            <Link to="/get-help" className="btn-secondary get-help-btn">GET HELP</Link>
          </div>
        </header>

        {/* Main Routing Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/get-help" element={<ApplyPage />} />
            
            {/* Placeholder Routes */}
            <Route path="/about" element={<PlaceholderPage title="About Us" />} />
            <Route path="/programs" element={<PlaceholderPage title="Programs" />} />
            <Route path="/how-to-help" element={<PlaceholderPage title="How to Help" />} />
            <Route path="/events" element={<PlaceholderPage title="Events" />} />
            <Route path="/shop" element={<PlaceholderPage title="Shop" />} />
            <Route path="/news" element={<PlaceholderPage title="News + Views" />} />
            <Route path="/people-partners" element={<PlaceholderPage title="People + Partners" />} />
            <Route path="/festival" element={<PlaceholderPage title="Festival" />} />
            <Route path="/bottle-club" element={<PlaceholderPage title="Bottle Club" />} />
            <Route path="/donate" element={<PlaceholderPage title="Donate" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

const HomeView = () => (
  <>
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">TAKING CARE OF OUR OWN.</h1>
        <p className="hero-subtitle">
          Southern Smoke Foundation supports the food and beverage industry nationwide by providing emergency relief funding and access to mental health services.
        </p>
        <div className="hero-buttons">
          <Link to="/donate" className="btn-primary">DONATE</Link>
          <Link to="/get-help" className="btn-secondary">GET HELP</Link>
        </div>
      </div>
    </section>

    <section id="impact" className="impact-section">
      <div className="impact-grid">
        <div className="impact-card">
          <span className="impact-number">$13M+</span>
          <span className="impact-label">DISTRIBUTED TO F+B WORKERS</span>
        </div>
        <div className="impact-card">
          <span className="impact-number">5,600+</span>
          <span className="impact-label">NO-COST COUNSELING SESSIONS</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/impact" className="btn-outline">SEE OUR FULL IMPACT &rarr;</Link>
      </div>
    </section>

    <section id="programs" className="programs-section">
      <div className="section-header">
        <h2 className="section-title">OUR PROGRAMS</h2>
      </div>
      <div className="programs-grid">
        <div className="program-card">
          <div className="program-card-content">
            <h3>EMERGENCY RELIEF</h3>
            <p>Financial assistance for food and beverage workers facing unforeseen crises.</p>
            <Link to="/get-help" className="program-link">LEARN MORE &rarr;</Link>
          </div>
        </div>
        <div className="program-card">
          <div className="program-card-content">
            <h3>BEHIND YOU</h3>
            <p>A mental health program providing no-cost counseling for industry workers.</p>
            <Link to="/get-help" className="program-link">LEARN MORE &rarr;</Link>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default App
