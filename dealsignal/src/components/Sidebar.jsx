import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, FileDown, Globe } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Add Deal', path: '/add-deal', icon: PlusCircle },
    { name: 'Deal List', path: '/deals', icon: List },
    { name: 'Landing Page', path: '/landing', icon: Globe },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h2 className="logo-text">Deal<span className="text-accent">Signal</span></h2>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p className="text-muted text-sm text-center">v1.0.0 Pro</p>
      </div>
    </aside>
  );
};

export default Sidebar;
