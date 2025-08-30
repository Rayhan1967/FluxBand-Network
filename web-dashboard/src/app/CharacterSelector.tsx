'use client';

import { useState } from 'react';

const characters = [
  {
    id: 'nova',
    name: 'NOVA',
    subtitle: 'Bandwidth Reactor',
    ability: 'Process shard movement for 3',
    rarity: 'common',
    color: '#00ff88',
    description: 'Enhanced bandwidth validation specialist'
  },
  {
    id: 'spectre',
    name: 'SPECTRE', 
    subtitle: 'Phantom Hacking Seeker',
    ability: 'Can see hidden proofs - Reveals encrypted and secured proof data',
    rarity: 'rare',
    color: '#ffaa00',
    description: 'Elite phantom proof hunter'
  },
  {
    id: 'pulse',
    name: 'PULSE',
    subtitle: 'Enhanced Detection Expert', 
    ability: 'Increased shard detection radius - 300% +',
    rarity: 'legendary',
    color: '#ff4444',
    description: 'Master of proof shard detection'
  }
];

export function CharacterSelector() {
  const [selectedCharacter, setSelectedCharacter] = useState('nova');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold neon-text mb-4">CHOOSE YOUR CHARACTER</h2>
        <p className="text-lg text-text-secondary">
          Select your digital avatar and harness their unique abilities to become the ultimate proof hunter.
          Each character offers a different playstyle and strategic advantage.
        </p>
      </div>

      {/* Current Stats */}
      <div className="flex justify-center gap-8 py-6">
        <div className="text-center">
          <div className="text-primary text-2xl font-bold">0</div>
          <div className="text-sm text-text-secondary">Current Score</div>
        </div>
        <div className="text-center">
          <div className="text-primary text-2xl font-bold">1/5</div>
          <div className="text-sm text-text-secondary">Unlocked</div>
        </div>
        <div className="text-center">
          <div className="text-primary text-2xl font-bold">5000</div>
          <div className="text-sm text-text-secondary">Next Unlock points</div>
        </div>
      </div>

      {/* Character Selection Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`card p-6 cursor-pointer transition-all duration-300 ${
              selectedCharacter === character.id 
                ? 'ring-2 ring-primary glow' 
                : 'opacity-80 hover:opacity-100'
            }`}
            onClick={() => setSelectedCharacter(character.id)}
            style={{ borderColor: character.color + '40' }}
          >
            {/* Character Avatar */}
            <div className="relative mb-6">
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl"
                style={{ backgroundColor: character.color + '20', border: `2px solid ${character.color}` }}
              >
                {character.id === 'nova' && '👾'}
                {character.id === 'spectre' && '👻'}
                {character.id === 'pulse' && '⚡'}
              </div>
              <div 
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  character.rarity === 'common' ? 'bg-gray-500' :
                  character.rarity === 'rare' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              >
                {character.rarity === 'common' ? 'C' : character.rarity === 'rare' ? 'R' : 'L'}
              </div>
            </div>

            {/* Character Info */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1" style={{ color: character.color }}>
                {character.name}
              </h3>
              <p className="text-sm text-text-secondary mb-4">{character.subtitle}</p>
              
              <div className="bg-surface-light rounded-lg p-3 mb-4">
                <div className="text-xs text-accent font-medium mb-1">Passive Ability</div>
                <div className="text-sm">{character.ability}</div>
              </div>

              <div className="text-xs text-text-secondary">{character.description}</div>
            </div>

            {selectedCharacter === character.id && (
              <div className="mt-4 text-center">
                <span className="inline-block bg-primary text-dark px-3 py-1 rounded-full text-sm font-medium">
                  SELECTED
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="btn-primary text-lg px-8 py-4">
          START ADVENTURE
        </button>
      </div>
    </div>
  );
}
