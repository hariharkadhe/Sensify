import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Copy, Download, Terminal, Database, Link as LinkIcon, 
  Key, Layers, RefreshCcw, Check, ArrowRight, Play, Eye, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

const OutputView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project || {
    projectName: 'Demo IoT Project',
    projectType: 'Smart Home',
    controller: 'ESP32',
    selectedSensors: ['DHT11 (Temp & Humidity)', 'MQ2 (Gas)', 'PIR Motion'],
    connectivity: 'WiFi'
  };

  const [copied, setCopied] = useState(false);
  const [projectId] = useState(`PRJ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [apiKey] = useState(`sk_live_${Math.random().toString(36).substr(2, 24)}`);
  const [activeTab, setActiveTab] = useState('code');
  const [ideTab, setIdeTab] = useState('arduino');
  const [liveData, setLiveData] = useState({});

  // Simulate Live Data
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {};
      project.selectedSensors.forEach(s => {
        const key = s.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        newData[key] = (Math.random() * 50 + 20).toFixed(2);
      });
      setLiveData(newData);
    }, 2000);
    return () => clearInterval(interval);
  }, [project.selectedSensors]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "main.ino";
    document.body.appendChild(element);
    element.click();
  };

  const generatedCode = `
#include <WiFi.h>
#include <HTTPClient.h>
${project.selectedSensors.map(s => `// Include library for ${s}`).join('\n')}

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverName = "http://localhost:8080/api/send-data";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  // Initialize ${project.selectedSensors.length} sensors
  ${project.selectedSensors.map(s => `init_${s.replace(/\s+/g, '_').replace(/[()]/g, '')}();`).join('\n  ')}
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-API-KEY", "${apiKey}");

    String jsonPayload = "{";
    jsonPayload += "\\"projectId\\":\\"${projectId}\\",";
    ${project.selectedSensors.map((s, i) => {
      const key = s.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      return `jsonPayload += "\\"${key}\\":" + String(read_${key}()) + "${i === project.selectedSensors.length - 1 ? '' : ','}";`;
    }).join('\n    ')}
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    http.end();
  }
  delay(10000);
}
  `.trim();

  return (
    <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-blue">{project.projectType}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Project ID: {projectId}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>{project.projectName}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={() => navigate('/setup')}>
            <RefreshCcw size={18} /> Reconfigure
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={18} /> Download Code
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2rem' }}>
        {/* Left Column: Code and Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Code Tab Switcher */}
          <div className="card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', width: 'fit-content', borderRadius: '12px' }}>
            <button 
              onClick={() => setActiveTab('code')}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: activeTab === 'code' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'code' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}
            >
              <Terminal size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> C++ Source
            </button>
            <button 
              onClick={() => setActiveTab('json')}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: activeTab === 'json' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'json' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}
            >
              <Layers size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> JSON Schema
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', background: '#0f172a' }}>
            <div style={{ padding: '0.75rem 1rem', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>main.ino</span>
              <button 
                onClick={() => handleCopy(activeTab === 'code' ? generatedCode : JSON.stringify(project, null, 2))}
                style={{ background: 'transparent', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{ 
              padding: '1.5rem', 
              color: '#f8fafc', 
              fontSize: '0.875rem', 
              fontFamily: 'monospace', 
              overflowX: 'auto',
              lineHeight: '1.6'
            }}>
              <code>
                {activeTab === 'code' ? generatedCode : JSON.stringify({
                  timestamp: new Date().toISOString(),
                  projectId: projectId,
                  data: Object.keys(liveData).length > 0 ? liveData : project.selectedSensors.reduce((acc, s) => ({
                    ...acc, 
                    [s.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')]: 0.0
                  }), {})
                }, null, 2)}
              </code>
            </pre>
          </div>

          {/* Hardware Connection Table */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} className="text-primary" /> Hardware Connection Map
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--primary-light)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem', borderRadius: '8px 0 0 8px' }}>Component</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Sensor Pin</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Controller Pin ({project.controller})</th>
                    <th style={{ padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {project.selectedSensors.map((sensor, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{sensor.split(' ')[0]}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>VCC / GND / DATA</td>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: 'var(--primary)' }}>3.3V / GND / D{i + 2}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-blue">Digital Input</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <strong>Step-by-Step Connection:</strong>
              <ol style={{ marginTop: '0.5rem', marginLeft: '1.2rem' }}>
                <li>Connect all Sensor <strong>VCC</strong> pins to the {project.controller} 3.3V/5V pin.</li>
                <li>Connect all Sensor <strong>GND</strong> pins to the {project.controller} GND pin.</li>
                <li>Connect each Sensor <strong>Data</strong> pin to the respective Digital/Analog pin shown above.</li>
              </ol>
            </div>
          </div>

          {/* IDE Instructions */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={20} className="text-primary" /> IDE Setup & Deployment
            </h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              {['arduino', 'thonny'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setIdeTab(tab)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: ideTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                    color: ideTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'arduino' ? 'Arduino IDE' : 'Thonny (MicroPython)'}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              {ideTab === 'arduino' ? (
                <div className="fade-in">
                  <p>1. Open <strong>Arduino IDE</strong> and go to <code>File &gt; New Sketch</code>.</p>
                  <p>2. Paste the generated C++ code from higher up this page.</p>
                  <p>3. Go to <code>Sketch &gt; Include Library &gt; Manage Libraries</code> and install requirements for: <strong>{project.selectedSensors.join(', ')}</strong>.</p>
                  <p>4. Connect your <strong>{project.controller}</strong> via USB.</p>
                  <p>5. Select your board in <code>Tools &gt; Board</code> and port in <code>Tools &gt; Port</code>.</p>
                  <p>6. Click the <strong>Upload</strong> (Arrow) button.</p>
                </div>
              ) : (
                <div className="fade-in">
                  <p>1. Open <strong>Thonny IDE</strong> and connect your {project.controller}.</p>
                  <p>2. Ensure your board has <strong>MicroPython firmware</strong> installed.</p>
                  <p>3. Create a new file named <code>main.py</code>.</p>
                  <p>4. Convert the generated logic to Python (or use our MicroPython template).</p>
                  <p>5. Click <strong>Run</strong> or save to the device to execute.</p>
                  <p style={{ marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>Note: Thonny is recommended for ESP32 and Raspberry Pi Pico.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Credentials & Schema */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* API Credentials */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Connection Settings</h3>
            <div className="input-group">
              <label>API Endpoint</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input readOnly className="input-field" value="http://localhost:8080/api/v1/ingest" style={{ fontSize: '0.875rem', background: '#f1f5f9' }} />
                <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => handleCopy("http://localhost:8080/api/v1/ingest")}>
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>API Key</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input readOnly type="password" className="input-field" value={apiKey} style={{ fontSize: '0.875rem', background: '#f1f5f9' }} />
                <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => handleCopy(apiKey)}>
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <p style={{ fontSize: '0.75rem', color: '#92400e' }}>
                <strong>Security Tip:</strong> Never share your API key. This token is used to authenticate your {project.controller} with our servers.
              </p>
            </div>
          </div>

          {/* Professional Database Schema */}
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} className="text-primary" /> Professional Table Schema
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>Column</th>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>Type</th>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>Constraints</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', fontWeight: 600 }}>id</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>UUID</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>PRIMARY KEY</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', fontWeight: 600 }}>device_id</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>VARCHAR(50)</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>NOT NULL</td>
                </tr>
                {project.selectedSensors.map(s => {
                  const key = s.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
                  return (
                    <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', fontWeight: 600 }}>{key}_val</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>DECIMAL(10,2)</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>-</td>
                    </tr>
                  );
                })}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', fontWeight: 600 }}>unit</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>VARCHAR(10)</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>-</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', fontWeight: 600 }}>created_at</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>TIMESTAMP</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>DEFAULT NOW()</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Circuit Simulation placeholder */}
          <div className="card" style={{ textAlign: 'center', background: 'var(--primary-light)', border: '2px dashed var(--primary)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Circuit Diagram</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Interactive diagram is being generated based on your hardware selection.
            </p>
            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src="https://via.placeholder.com/300x150?text=Auto+Generated+Circuit" alt="Circuit Schema" style={{ borderRadius: '8px', maxWidth: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputView;
