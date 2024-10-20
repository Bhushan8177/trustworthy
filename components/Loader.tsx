import React from 'react';
import { Spin } from 'antd';

const Loader: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    width: '100vw', 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999
  }}>
    <Spin size="large" />
  </div>
);

export default Loader;