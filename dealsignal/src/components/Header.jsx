import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="top-header">
      <div className="header-search">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search ASIN, Brand, or URL..." className="search-input" />
      </div>
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge-indicator"></span>
        </button>
        <div className="user-profile">
          <UserCircle size={32} className="text-muted" />
          <div className="user-info">
            <span className="user-name">Sourcing Team</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
