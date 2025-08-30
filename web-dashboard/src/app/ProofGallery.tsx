'use client';

import { useState } from 'react';

const proofShards = [
  {
    id: 1,
    name: 'Verifiable Shard',
    category: 'Verifiable',
    rarity: 'common',
    date: '6/20/2025',
    hash: 'ID: 6d68f7b3',
    status: 'verified',
    description: 'Proof discovered in DATA BA2ADA',
    color: '#00ff88'
  },
  {
    id: 2,
    name: 'Verifiable Shard',
    category: 'Verifiable', 
    rarity: 'common',
    date: '6/20/2025',
    hash: 'ID: 7b3a8f9e',
    status: 'verified',
    description: 'Proof discovered in DATA CA3BCB',
    color: '#00ff88'
  },
  {
    id: 3,
    name: 'Encrypted Shard',
    category: 'Encrypted',
    rarity: 'rare',
    date: '6/20/2025', 
    hash: 'ID: 9f2e1d4c',
    status: 'verified',
    description: 'Proof discovered in CRYPTO AA9EBC',
    color: '#ffaa00'
  },
  {
    id: 4,
    name: 'Fragment Shard',
    category: 'Fragment',
    rarity: 'legendary',
    date: '6/20/2025',
    hash: 'ID: 4c8b3f7a',
    status: 'verified', 
    description: 'Proof discovered in QUANTUM XF7NBC',
    color: '#ff4444'
  }
];

const categories = ['All', 'Verifiable', 'Encrypted', 'Fragment'];
const rarities = ['All', 'Common', 'Rare', 'Legendary'];

export function ProofGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');

  const filteredShards = proofShards.filter(shard => {
    const categoryMatch = selectedCategory === 'All' || shard.category === selectedCategory;
    const rarityMatch = selectedRarity === 'All' || shard.rarity === selectedRarity.toLowerCase();
    return categoryMatch && rarityMatch;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold neon-text mb-4">PROOF GALLERY</h2>
        <p className="text-lg text-text-secondary">
          Your personal collection of discovered proof shards, each permanently stored on the{' '}
          <span className="text-primary font-bold">IRYS PROGRAMMABLE DATA</span>. Build your legacy as a master proof hunter.
        </p>
      </div>

      {/* Gallery Stats */}
      <div className="flex justify-center gap-8 py-6">
        <div className="text-center">
          <div className="text-primary text-2xl font-bold">0</div>
          <div className="text-sm text-text-secondary">Total Proofs</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 text-2xl font-bold">0</div>
          <div className="text-sm text-text-secondary">Rare Finds</div>
        </div>
        <div className="text-center">
          <div className="text-purple-400 text-2xl font-bold">1</div>
          <div className="text-sm text-text-secondary">Epic Shards</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2">
          <span className="text-sm text-text-secondary">Category:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-dark'
                  : 'bg-surface-light hover:bg-surface text-text-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <span className="text-sm text-text-secondary">Rarity:</span>
          {rarities.map(rarity => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedRarity === rarity
                  ? 'bg-accent text-dark'
                  : 'bg-surface-light hover:bg-surface text-text-secondary'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      {/* Proof Shards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredShards.map((shard) => (
          <div
            key={shard.id}
            className="card p-4 hover:scale-105 transition-all duration-300"
            style={{ borderColor: shard.color + '40' }}
          >
            {/* Shard Visual */}
            <div className="relative mb-4">
              <div 
                className="w-full h-32 rounded-lg flex items-center justify-center text-4xl relative overflow-hidden"
                style={{ backgroundColor: shard.color + '10', border: `1px solid ${shard.color}40` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                💎
              </div>
              
              {/* Rarity Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                shard.rarity === 'common' ? 'bg-gray-600' :
                shard.rarity === 'rare' ? 'bg-yellow-600' :
                'bg-red-600'
              }`}>
                {shard.rarity.toUpperCase()}
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400 font-medium">VERIFIED</span>
              </div>
            </div>

            {/* Shard Info */}
            <div>
              <h3 className="font-bold mb-1" style={{ color: shard.color }}>
                {shard.name}
              </h3>
              <p className="text-xs text-text-secondary mb-2">{shard.description}</p>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date:</span>
                  <span>{shard.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Hash:</span>
                  <span className="text-accent">{shard.hash}</span>
                </div>
              </div>

              <button className="w-full mt-3 px-3 py-2 bg-surface-light hover:bg-primary hover:text-dark rounded text-xs font-medium transition-all">
                VIEW DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredShards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">No Proof Shards Found</h3>
          <p className="text-text-secondary">Start your hunt to discover amazing proof shards!</p>
        </div>
      )}
    </div>
  );
}
