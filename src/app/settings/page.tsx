'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  User,
  Settings as SettingsIcon,
  Palette,
  Shield,
  Bell,
  Download,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2,
  Edit3,
  Camera,
  BarChart3,
  Activity
} from 'lucide-react';
import { ABTestingSettings } from '@/components/admin/ABTestingSettings';
import { HealthMonitoringSettings } from '@/components/admin/HealthMonitoringSettings';

interface UserSettings {
  profile: {
    businessName: string;
    ownerName: string;
    industry: string;
    monthlyRevenue: string;
    teamSize: string;
    businessStage: string;
    primaryGoals: string[];
    avatar: string;
    bio: string;
  };
  preferences: {
    communicationStyle: 'detailed' | 'concise' | 'balanced';
    frameworkFocus: string[];
    sessionLength: 'short' | 'medium' | 'extended';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    notifications: {
      milestones: boolean;
      insights: boolean;
      reminders: boolean;
      newsletters: boolean;
    };
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    sharing: boolean;
    retention: '1year' | '2years' | '5years' | 'forever';
  };
  display: {
    theme: 'purple' | 'blue' | 'green' | 'orange';
    density: 'compact' | 'comfortable' | 'spacious';
    widgets: string[];
    metrics: string[];
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy' | 'display' | 'abtesting' | 'monitoring'>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    loadUserSettings();
    
    // Handle URL tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam && ['profile', 'preferences', 'privacy', 'display', 'abtesting', 'monitoring'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, []);

  const loadUserSettings = () => {
    // Load from localStorage (in production, this would be from API/database)
    const businessProfile = localStorage.getItem('businessProfile');
    const savedSettings = localStorage.getItem('userSettings');

    const defaultSettings: UserSettings = {
      profile: {
        businessName: 'Premium Coaching Solutions',
        ownerName: 'Business Owner',
        industry: 'coaching_consulting',
        monthlyRevenue: '$35,000',
        teamSize: '2-5',
        businessStage: 'have_business',
        primaryGoals: ['increase_revenue', 'improve_conversion', 'scale_operations'],
        avatar: '',
        bio: 'Passionate entrepreneur focused on scaling my coaching business using proven frameworks.'
      },
      preferences: {
        communicationStyle: 'balanced',
        frameworkFocus: ['grand_slam_offer', '4_universal_constraints', 'money_model'],
        sessionLength: 'medium',
        difficulty: 'intermediate',
        notifications: {
          milestones: true,
          insights: true,
          reminders: true,
          newsletters: false
        }
      },
      privacy: {
        dataCollection: true,
        analytics: true,
        sharing: false,
        retention: '2years'
      },
      display: {
        theme: 'purple',
        density: 'comfortable',
        widgets: ['revenue', 'milestones', 'insights', 'streak'],
        metrics: ['revenue', 'ltv', 'cac', 'conversion']
      }
    };

    if (businessProfile) {
      const profile = JSON.parse(businessProfile);
      defaultSettings.profile = {
        ...defaultSettings.profile,
        industry: profile.industry || defaultSettings.profile.industry,
        monthlyRevenue: profile.monthlyRevenue || defaultSettings.profile.monthlyRevenue,
        teamSize: profile.teamSize || defaultSettings.profile.teamSize,
        businessStage: profile.businessStage || defaultSettings.profile.businessStage
      };
    }

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({ ...defaultSettings, ...parsedSettings });
    } else {
      setSettings(defaultSettings);
    }
  };

  const updateSettings = (section: keyof UserSettings, updates: any) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      [section]: { ...settings[section], ...updates }
    };
    
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      localStorage.setItem('businessProfile', JSON.stringify(settings.profile));
      
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const exportData = () => {
    if (!settings) return;
    
    const dataToExport = {
      profile: settings.profile,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alex-hormozi-ai-profile-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!settings) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white">Loading settings...</div>
    </div>;
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, description: 'Business information and goals' },
    { id: 'preferences', name: 'Preferences', icon: SettingsIcon, description: 'AI behavior and notifications' },
    { id: 'display', name: 'Display', icon: Palette, description: 'Theme and dashboard layout' },
    { id: 'privacy', name: 'Privacy', icon: Shield, description: 'Data and privacy controls' },
    { id: 'abtesting', name: 'A/B Testing', icon: BarChart3, description: 'Experiment management and optimization' },
    { id: 'monitoring', name: 'Health Monitoring', icon: Activity, description: 'System performance and uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-300">Customize your Alex Hormozi AI experience</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <span className="text-yellow-400 text-sm">Unsaved changes</span>
              )}
              <button
                onClick={saveSettings}
                disabled={!hasUnsavedChanges || saveStatus === 'saving'}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  hasUnsavedChanges 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="h-4 w-4" />
                <span>
                  {saveStatus === 'saving' ? 'Saving...' : 
                   saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 sticky top-8">
              <h3 className="font-semibold text-white mb-4">Settings</h3>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <ProfileSettings 
                settings={settings.profile}
                onUpdate={(updates) => updateSettings('profile', updates)}
              />
            )}
            
            {activeTab === 'preferences' && (
              <PreferencesSettings 
                settings={settings.preferences}
                onUpdate={(updates) => updateSettings('preferences', updates)}
              />
            )}
            
            {activeTab === 'display' && (
              <DisplaySettings 
                settings={settings.display}
                onUpdate={(updates) => updateSettings('display', updates)}
              />
            )}
            
            {activeTab === 'privacy' && (
              <PrivacySettings 
                settings={settings.privacy}
                onUpdate={(updates) => updateSettings('privacy', updates)}
                onExportData={exportData}
              />
            )}
            
            {activeTab === 'abtesting' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <ABTestingSettings />
              </div>
            )}
            
            {activeTab === 'monitoring' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <HealthMonitoringSettings />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings({ settings, onUpdate }: { 
  settings: UserSettings['profile']; 
  onUpdate: (updates: Partial<UserSettings['profile']>) => void; 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Business Profile
        </h3>
        
        {/* Avatar Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
              {settings.ownerName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-medium text-white">{settings.ownerName}</h4>
              <p className="text-sm text-gray-400">{settings.businessName}</p>
              <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center mt-1">
                <Camera className="h-3 w-3 mr-1" />
                Change Photo
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Business Name</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => onUpdate({ businessName: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Owner Name</label>
            <input
              type="text"
              value={settings.ownerName}
              onChange={(e) => onUpdate({ ownerName: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-white mb-2">Bio</label>
          <textarea
            value={settings.bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
            placeholder="Tell us about your business and goals..."
          />
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Business Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Industry</label>
            <select
              value={settings.industry}
              onChange={(e) => onUpdate({ industry: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="coaching_consulting">Coaching & Consulting</option>
              <option value="ecommerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="agency">Agency</option>
              <option value="local">Local Business</option>
              <option value="real_estate">Real Estate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Monthly Revenue</label>
            <select
              value={settings.monthlyRevenue}
              onChange={(e) => onUpdate({ monthlyRevenue: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="$0-$1,000">$0 - $1,000</option>
              <option value="$1,000-$10,000">$1,000 - $10,000</option>
              <option value="$10,000-$50,000">$10,000 - $50,000</option>
              <option value="$50,000-$250,000">$50,000 - $250,000</option>
              <option value="$250,000+">$250,000+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preferences Settings Component  
function PreferencesSettings({ settings, onUpdate }: {
  settings: UserSettings['preferences'];
  onUpdate: (updates: Partial<UserSettings['preferences']>) => void;
}) {
  const updateNotifications = (key: keyof UserSettings['preferences']['notifications'], value: boolean) => {
    onUpdate({
      notifications: { ...settings.notifications, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">AI Agent Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Communication Style</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'concise', label: 'Concise', desc: 'Brief, to-the-point responses' },
                { value: 'balanced', label: 'Balanced', desc: 'Moderate detail level' },
                { value: 'detailed', label: 'Detailed', desc: 'Comprehensive explanations' }
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => onUpdate({ communicationStyle: style.value as any })}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    settings.communicationStyle === style.value
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs opacity-75">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Session Length</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'short', label: '5-10 min', desc: 'Quick insights' },
                { value: 'medium', label: '15-20 min', desc: 'Standard session' },
                { value: 'extended', label: '30+ min', desc: 'Deep dive analysis' }
              ].map((length) => (
                <button
                  key={length.value}
                  onClick={() => onUpdate({ sessionLength: length.value as any })}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    settings.sessionLength === length.value
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{length.label}</div>
                  <div className="text-xs opacity-75">{length.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'milestones', label: 'Milestone Completions', desc: 'Get notified when you complete milestones' },
            { key: 'insights', label: 'AI Insights', desc: 'New recommendations and insights' },
            { key: 'reminders', label: 'Progress Reminders', desc: 'Daily and weekly progress check-ins' },
            { key: 'newsletters', label: 'Alex Hormozi Updates', desc: 'Latest frameworks and strategies' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">{notification.label}</div>
                <div className="text-sm text-gray-400">{notification.desc}</div>
              </div>
              <button
                onClick={() => updateNotifications(notification.key as any, !settings.notifications[notification.key as keyof typeof settings.notifications])}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.notifications[notification.key as keyof typeof settings.notifications]
                    ? 'bg-purple-600'
                    : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.notifications[notification.key as keyof typeof settings.notifications]
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Display Settings Component
function DisplaySettings({ settings, onUpdate }: {
  settings: UserSettings['display'];
  onUpdate: (updates: Partial<UserSettings['display']>) => void;
}) {
  const themes = [
    { value: 'purple', label: 'Purple', color: 'bg-purple-600' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-600' },
    { value: 'green', label: 'Green', color: 'bg-green-600' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Theme & Appearance
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">Color Theme</label>
          <div className="grid grid-cols-4 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => onUpdate({ theme: theme.value as any })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.theme === theme.value
                    ? 'border-white'
                    : 'border-transparent hover:border-gray-500'
                }`}
              >
                <div className={`w-8 h-8 ${theme.color} rounded-full mx-auto mb-2`} />
                <div className="text-white text-sm">{theme.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-3">Dashboard Density</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'compact', label: 'Compact', desc: 'More content, less spacing' },
              { value: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing' },
              { value: 'spacious', label: 'Spacious', desc: 'More breathing room' }
            ].map((density) => (
              <button
                key={density.value}
                onClick={() => onUpdate({ density: density.value as any })}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  settings.density === density.value
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="font-medium">{density.label}</div>
                <div className="text-xs opacity-75">{density.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Privacy Settings Component
function PrivacySettings({ settings, onUpdate, onExportData }: {
  settings: UserSettings['privacy'];
  onUpdate: (updates: Partial<UserSettings['privacy']>) => void;
  onExportData: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Privacy & Data
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'dataCollection', label: 'Data Collection', desc: 'Allow collection of usage analytics to improve experience' },
              { key: 'analytics', label: 'Performance Analytics', desc: 'Help us understand how you use the platform' },
              { key: 'sharing', label: 'Anonymous Insights', desc: 'Share anonymized business insights to improve AI recommendations' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{setting.label}</div>
                  <div className="text-sm text-gray-400">{setting.desc}</div>
                </div>
                <button
                  onClick={() => onUpdate({ [setting.key]: !settings[setting.key as keyof typeof settings] })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings[setting.key as keyof typeof settings]
                      ? 'bg-purple-600'
                      : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      settings[setting.key as keyof typeof settings]
                        ? 'translate-x-6'
                        : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/20">
            <h4 className="font-medium text-white mb-4">Data Management</h4>
            <div className="flex space-x-3">
              <button
                onClick={onExportData}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
              <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}