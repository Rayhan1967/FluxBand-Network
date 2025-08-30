'use client';

import { useState } from 'react';

const zones = [
  {
    id: 'dapp',
    name: 'DAPP',
    subtitle: 'Zone 2',
    status: 'available',
    description: 'Verifiable proofs rising',
    difficulty: 'medium',
    rewards: '2.5x multiplier',
    color: '#00ff88'
  },
  {
    id: 'verification-hub',
    name: 'VERIFICATION HUB',
    subtitle: 'Zone 2',
    status: 'locked',
    description: 'Verifiable proofs with cryptographic energy (Mainlined)',
    difficulty: 'hard',
    rewards: '3.0x multiplier',
    color: '#ff4444'
  },
  {
    id: 'quantum-archive',
    name: 'QUANTUM ARCHIVE',
    subtitle: 'Zone 3',
    status: 'locked',
    description: 'Quantum superposition challenges await',
    difficulty: 'expert',
    rewards: '5.0x multiplier',
    color: '#9333ea'
  },
  {
    id: 'secure-vault',
    name: 'SECURE VAULT',
    subtitle: 'Zone 5',
    status: 'locked',
    description: 'Maximum security proof verification',
    difficulty: 'legendary',
    rewards: '10.0x multiplier',
    color: '#f59e0b'
  }
];

export function ZoneExploration() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold neon-text mb-4">ZONE SELECTION</h2>
        <p className="text-lg text-text-secondary">
          Choose your adventure! Each zone offers unique challenges and rewards. Unlock new territories by collecting proof shards and solving puzzles.
        </p>
      </div>

      {/* Zone Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`card p-6 cursor-pointer transition-all duration-300 ${
              zone.status === 'locked' ? 'opacity-50' : 'hover:scale-105'
            } ${selectedZone === zone.id ? 'ring-2 ring-primary glow' : ''}`}
            onClick={() => zone.status === 'available' && setSelectedZone(zone.id)}
            style={{ borderColor: zone.color + '40' }}
          >
            {/* Zone Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                zone.status === 'available' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {zone.status.toUpperCase()}
              </div>
              <div className="text-xs text-text-secondary">{zone.subtitle}</div>
            </div>

            {/* Zone Icon */}
            <div className="text-center mb-4">
              <div 
                className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl mb-2"
                style={{ backgroundColor: zone.color + '20', border: `2px solid ${zone.color}` }}
              >
                {zone.id === 'dapp' && '🎯'}
                {zone.id === 'verification-hub' && '🔐'}
                {zone.id === 'quantum-archive' && '⚛️'}
                {zone.id === 'secure-vault' && '🏛️'}
              </div>
            </div>

            {/* Zone Info */}
            <div className="text-center">
              <h3 className="font-bold mb-2" style={{ color: zone.color }}>
                {zone.name}
              </h3>
              <p className="text-sm text-text-secondary mb-3">{zone.description}</p>
              
              {/* Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Difficulty:</span>
                  <span className={`font-medium ${
                    zone.difficulty === 'medium' ? 'text-yellow-400' :
                    zone.difficulty === 'hard' ? 'text-red-400' :
                    zone.difficulty === 'expert' ? 'text-purple-400' :
                    'text-orange-400'
                  }`}>{zone.difficulty.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Rewards:</span>
                  <span className="text-primary font-medium">{zone.rewards}</span>
                </div>
              </div>

              {zone.status === 'available' && selectedZone === zone.id && (
                <button className="btn-primary w-full mt-4 py-2 text-sm">
                  ENTER ZONE
                </button>
              )}

              {zone.status === 'locked' && (
                <div className="mt-4 text-xs text-red-400">
                  🔒 Requires 50 shards to unlock
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details */}
      {selectedZone && (
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Zone Briefing</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-2">🎯 Objectives</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Find hidden proof shards</li>
                <li>• Solve cryptographic puzzles</li>
                <li>• Validate bandwidth nodes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">🏆 Rewards</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Proof shards discovery</li>
                <li>• U2U token rewards</li>
                <li>• Rank progression points</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">⚡ Challenges</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Brain-teasing challenges</li>
                <li>• Time-limited missions</li>
                <li>• Competition with other hunters</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
