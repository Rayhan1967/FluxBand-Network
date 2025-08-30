'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/walletcontext';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  level: string;
  currentBoost: number;
  expToNextLevel: number;
  maxExp: number;
  connectedSocials: {
    twitter: { connected: boolean; username: string };
    discord: { connected: boolean; username: string };
  };
}

export function UserProfile() {
  const { wallet } = useWallet();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Habib Raihan',
    email: 'habibraihan1967@gmail.com',
    avatar: '/api/placeholder/100/100',
    level: 'Bronze',
    currentBoost: 2,
    expToNextLevel: 4000,
    maxExp: 8000,
    connectedSocials: {
      twitter: { connected: true, username: '0xExamray' },
      discord: { connected: true, username: '0x_examray' }
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email
  });

  const levelProgress = (profile.expToNextLevel / profile.maxExp) * 100;

  const handleSaveProfile = () => {
    setProfile(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email
    }));
    setIsEditing(false);
  };

  const connectSocial = (platform: 'twitter' | 'discord') => {
    // Implement social connection
    alert(`Connect ${platform} functionality would be implemented here`);
  };

  const disconnectSocial = (platform: 'twitter' | 'discord') => {
    setProfile(prev => ({
      ...prev,
      connectedSocials: {
        ...prev.connectedSocials,
        [platform]: { connected: false, username: '' }
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card p-8">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-3xl font-bold text-dark">
              {profile.name.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-dark">
              ✏️
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold bg-surface-light border border-surface rounded px-3 py-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-text-primary">{profile.name}</h1>
                )}
                
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="text-text-secondary bg-surface-light border border-surface rounded px-3 py-1 mt-1"
                  />
                ) : (
                  <p className="text-text-secondary">{profile.email}</p>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary px-4 py-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ name: profile.name, email: profile.email });
                      }}
                      className="px-4 py-2 bg-surface-light rounded-lg hover:bg-surface"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-surface-light rounded-lg hover:bg-surface"
                  >
                    ✏️ Edit
                  </button>
                )}
                <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                  🚪 Log Out
                </button>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-surface-light rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-text-secondary">Current Status</div>
                  <div className="text-2xl font-bold text-yellow-400">{profile.level}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Current Boost</div>
                  <div className="text-2xl font-bold text-green-400">{profile.currentBoost}%</div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>{profile.expToNextLevel}/8000</span>
                  <span>EXP to Silver</span>
                </div>
              </div>
              
              <div className="w-full bg-surface rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Connections */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-primary mb-6">Social Connections</h3>
        
        <div className="space-y-4">
          {/* Twitter */}
          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                🐦
              </div>
              <div>
                <div className="font-medium">X(Twitter)</div>
                {profile.connectedSocials.twitter.connected ? (
                  <div className="text-sm text-green-400 flex items-center gap-2">
                    ✓ Connected: @{profile.connectedSocials.twitter.username}
                  </div>
                ) : (
                  <div className="text-sm text-text-secondary">Not connected</div>
                )}
              </div>
            </div>
            
            {profile.connectedSocials.twitter.connected ? (
              <button
                onClick={() => disconnectSocial('twitter')}
                className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => connectSocial('twitter')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Connect
              </button>
            )}
          </div>

          {/* Discord */}
          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                💬
              </div>
              <div>
                <div className="font-medium">Discord</div>
                {profile.connectedSocials.discord.connected ? (
                  <div className="text-sm text-green-400 flex items-center gap-2">
                    ✓ Connected: {profile.connectedSocials.discord.username}
                  </div>
                ) : (
                  <div className="text-sm text-text-secondary">Not connected</div>
                )}
              </div>
            </div>
            
            {profile.connectedSocials.discord.connected ? (
              <button
                onClick={() => disconnectSocial('discord')}
                className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => connectSocial('discord')}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-primary mb-6">Security</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Password</div>
              <div className="text-sm text-text-secondary">Change your account password</div>
            </div>
            <button className="px-4 py-2 bg-surface-light rounded-lg hover:bg-surface">
              Change Password
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-text-secondary">Add an extra layer of security</div>
            </div>
            <button className="px-4 py-2 bg-surface-light rounded-lg hover:bg-surface">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
