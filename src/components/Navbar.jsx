import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, LayoutDashboard, FilePlus, Code2, Bell, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Project', path: '/setup', icon: FilePlus },
    { name: 'Output', path: '/output', icon: Code2 },
  ];

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 0',
      marginBottom: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--primary)'
        }}>
          <div style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={24} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)' }}>Sensify</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
          
          <div style={{ 
            height: '24px', 
            width: '1px', 
            background: 'var(--border)', 
            margin: '0 0.5rem' 
          }} />

          <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <Bell size={18} />
          </button>
          
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <LogIn size={16} /> Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
