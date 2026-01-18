'use client';
import React from 'react';

const QuantumBackgroundDiv = () => {
  return (
    <div className="quantum-background fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="quantum-grid absolute top-0 left-0 w-full h-full opacity-30"></div>
      <div className="glow-orb glow-orb-1 absolute"></div>
      <div className="glow-orb glow-orb-2 absolute"></div>
      <div className="glow-orb glow-orb-3 absolute"></div>
    </div>
  );
};

export default QuantumBackgroundDiv;
