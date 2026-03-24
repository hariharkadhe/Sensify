import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Activity, Zap, Shield, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  const recentProjects = [
    { id: 1, name: 'Home Garden Monitor', type: 'Smart Agriculture', status: 'Active', updated: '2 hours ago' },
    { id: 2, name: 'Living Room Lights', type: 'Smart Home', status: 'Active', updated: '1 day ago' },
    { id: 3, name: 'Heart Rate Tracker', type: 'Health Monitoring', status: 'Draft', updated: '3 days ago' },
  ];

  const stats = [
    { label: 'Active Projects', value: '12', icon: Activity, color: '#3b82f6' },
    { label: 'API Requests', value: '1.2k', icon: Zap, color: '#f59e0b' },
    { label: 'Devices Linked', value: '24', icon: Shield, color: '#10b981' },
    { label: 'Data Points', value: '85k', icon: Database, color: '#8b5cf6' },
  ];

  return (
    <div className="container fade-in">
      {/* Hero Section */}
      <section style={{ 
        padding: '2rem 0', 
        marginBottom: '3rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--primary-light) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: '24px',
        border: '1px solid var(--border)'
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}
        >
          AutoIoT Studio
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}
        >
          Build Professional IoT Projects Without Writing a Single Line of Code
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="btn btn-primary" 
          onClick={() => navigate('/setup')}
          style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
        >
          <Plus size={20} />
          Create New Project
        </motion.button>
      </section>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '4rem'
      }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="card" 
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
            >
              <div style={{
                background: `${stat.color}15`,
                color: stat.color,
                padding: '1rem',
                borderRadius: '12px',
                display: 'flex'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Projects */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Recent Projects</h2>
          <button className="btn btn-outline" style={{ fontSize: '0.875rem' }}>View All</button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {recentProjects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="card"
              style={{ position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-blue">{project.type}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.updated}</span>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{project.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Quick description for {project.name}...
              </p>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/output')}
              >
                Open Dashboard <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
