import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Cpu, Thermometer, Wifi, ArrowRight, Sparkles, CheckCircle2, ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    projectType: '',
    difficulty: '',
    connectivity: '',
    controller: '',
    selectedSensors: []
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);

  const projectTypes = ['Smart Home', 'Smart Agriculture', 'Health Monitoring', 'Industrial IoT', 'Smart City', 'Custom'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const connectivities = ['WiFi', 'Bluetooth', 'GSM', 'LoRa'];
  const controllers = ['Arduino Uno', 'Arduino Nano', 'Arduino Mega', 'ESP8266 (NodeMCU)', 'ESP32', 'Raspberry Pi', 'STM32'];
  const sensors = [
    'DHT11 (Temp & Humidity)', 'DHT22', 'MQ2 (Gas)', 'MQ135 (Air Quality)', 
    'Ultrasonic (HC-SR04)', 'PIR Motion', 'Soil Moisture', 'LDR (Light)', 
    'Rain Sensor', 'Flame Sensor', 'IR Sensor', 'BMP180 (Pressure)', 
    'Heart Rate', 'GPS Module', 'Accelerometer (MPU6050)'
  ];

  // AI Recommendation Logic
  useEffect(() => {
    let suggestions = [];
    switch (formData.projectType) {
      case 'Smart Agriculture':
        suggestions = ['Soil Moisture', 'Rain Sensor', 'DHT11 (Temp & Humidity)'];
        break;
      case 'Smart Home':
        suggestions = ['PIR Motion', 'LDR (Light)', 'DHT22', 'MQ2 (Gas)'];
        break;
      case 'Health Monitoring':
        suggestions = ['Heart Rate', 'Accelerometer (MPU6050)', 'DHT11 (Temp & Humidity)'];
        break;
      case 'Smart City':
        suggestions = ['Ultrasonic (HC-SR04)', 'MQ135 (Air Quality)', 'LDR (Light)'];
        break;
      case 'Industrial IoT':
        suggestions = ['MQ2 (Gas)', 'BMP180 (Pressure)', 'DHT22'];
        break;
      default:
        suggestions = [];
    }
    setAiSuggestions(suggestions);
  }, [formData.projectType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSensor = (sensor) => {
    setFormData(prev => {
      const isSelected = prev.selectedSensors.includes(sensor);
      if (isSelected) {
        return { ...prev, selectedSensors: prev.selectedSensors.filter(s => s !== sensor) };
      } else {
        return { ...prev, selectedSensors: [...prev.selectedSensors, sensor] };
      }
    });
  };

  const applySuggestion = (sensor) => {
    if (!formData.selectedSensors.includes(sensor)) {
      toggleSensor(sensor);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    // In a real app, you'd save this to a store or backend
    navigate('/output', { state: { project: formData } });
  };

  return (
    <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings className="text-primary" /> Setup Your IoT Project
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure your hardware and project details</p>
      </header>

      <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section A: Project Information */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.4rem', background: 'var(--primary-light)', borderRadius: '8px', color: 'var(--primary)' }}>1</div>
              Project Information
            </h2>
            
            <div className="input-group">
              <label>Project Name</label>
              <input 
                type="text" 
                name="projectName"
                required
                className="input-field" 
                placeholder="e.g. Smart Greenhouse Monitor" 
                value={formData.projectName}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Project Description</label>
              <textarea 
                name="projectDescription"
                className="input-field" 
                rows="3" 
                placeholder="What does your project do?"
                value={formData.projectDescription}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Project Type</label>
                <select name="projectType" className="input-field" value={formData.projectType} onChange={handleInputChange}>
                  <option value="">Select Type</option>
                  {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Difficulty</label>
                <select name="difficulty" className="input-field" value={formData.difficulty} onChange={handleInputChange}>
                  <option value="">Select Level</option>
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Connectivity</label>
                <select name="connectivity" className="input-field" value={formData.connectivity} onChange={handleInputChange}>
                  <option value="">Select Type</option>
                  {connectivities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section B: Hardware Selection */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.4rem', background: 'var(--primary-light)', borderRadius: '8px', color: 'var(--primary)' }}>2</div>
              Hardware Selection
            </h2>

            <div className="input-group">
              <label>Main Controller</label>
              <div style={{ position: 'relative' }}>
                <select name="controller" className="input-field" value={formData.controller} onChange={handleInputChange}>
                  <option value="">Select Controller</option>
                  {controllers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Sensors & Actuators (Multi-select)</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '0.75rem',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '1rem',
                border: '1.5px solid var(--border)',
                borderRadius: '8px',
                background: '#fafafa'
              }}>
                {sensors.map(sensor => (
                  <div 
                    key={sensor} 
                    onClick={() => toggleSensor(sensor)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      background: formData.selectedSensors.includes(sensor) ? 'var(--primary)' : 'white',
                      color: formData.selectedSensors.includes(sensor) ? 'white' : 'var(--text-main)',
                      border: '1px solid var(--border)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    {formData.selectedSensors.includes(sensor) && <CheckCircle2 size={14} />}
                    {sensor}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: AI Suggestions */}
        <aside style={{ position: 'sticky', top: '100px' }}>
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', 
            color: 'white',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>
              <Sparkles size={20} /> AI Recommendations
            </h3>
            
            <AnimatePresence mode="wait">
              {formData.projectType ? (
                <motion.div
                  key={formData.projectType}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem', opacity: 0.9 }}>
                    Based on <strong>{formData.projectType}</strong>, we recommend:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {aiSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => applySuggestion(suggestion)}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          cursor: 'pointer'
                        }}
                      >
                        {suggestion}
                        {formData.selectedSensors.some(s => s.includes(suggestion)) ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <p style={{ fontSize: '0.875rem', opacity: 0.7, fontStyle: 'italic' }}>
                  Select a project type to see intelligent hardware recommendations.
                </p>
              )}
            </AnimatePresence>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', justifyContent: 'center', fontSize: '1.125rem' }}>
              Generate Project <ArrowRight size={20} />
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
              This will generate the code, API endpoints, and circuit diagrams.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default ProjectSetup;
