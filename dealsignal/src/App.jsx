import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AddDeal from './pages/AddDeal';
import DealList from './pages/DealList';
import DealDetail from './pages/DealDetail';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/*" element={
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Header />
              <main className="page-content animate-fade-in">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/add-deal" element={<AddDeal />} />
                  <Route path="/deals" element={<DealList />} />
                  <Route path="/deal/:id" element={<DealDetail />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
