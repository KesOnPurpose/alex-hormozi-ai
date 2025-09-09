'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp, TrendingDown, Server, Globe, Database, CreditCard, Mail, HardDrive } from 'lucide-react';
import { healthMonitoringService, HealthMetric, HealthCheck, HealthIncident } from '@/services/healthMonitoring';

export function HealthMonitoringSettings() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [incidents, setIncidents] = useState<HealthIncident[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'metrics' | 'services' | 'incidents'>('overview');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setMetrics(healthMonitoringService.getAllMetrics());
    setHealthChecks(healthMonitoringService.getAllHealthChecks());
    setIncidents(healthMonitoringService.getAllIncidents().slice(0, 10)); // Last 10 incidents
    setSystemStatus(healthMonitoringService.getSystemStatus());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'degraded': return 'text-orange-400 bg-orange-400/10';
      case 'down': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'degraded': return <Clock className="w-4 h-4" />;
      case 'down': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const runHealthCheck = async (checkId: string) => {
    await healthMonitoringService.runHealthCheck(checkId);
    loadData();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Health Monitoring</h2>
          <p className="text-gray-300">System performance and availability monitoring</p>
        </div>
        
        {/* System Status Badge */}
        {systemStatus && (
          <div className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${getStatusColor(systemStatus.overall)}`}>
            {getStatusIcon(systemStatus.overall)}
            <span className="capitalize">{systemStatus.overall}</span>
          </div>
        )}
      </div>

      {/* System Overview */}
      {systemStatus && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">System Status</h3>
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {systemStatus.stats.healthyServices}/{systemStatus.stats.totalServices}
              </div>
              <div className="text-sm text-gray-400">Healthy Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {systemStatus.stats.activeIncidents}
              </div>
              <div className="text-sm text-gray-400">Active Incidents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {systemStatus.stats.avgResponseTime}ms
              </div>
              <div className="text-sm text-gray-400">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">99.9%</div>
              <div className="text-sm text-gray-400">Overall Uptime</div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white font-medium mb-2">System Summary</div>
            <div className="text-gray-300">{systemStatus.summary}</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
          { id: 'metrics', label: 'Metrics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'services', label: 'Services', icon: <Server className="w-4 h-4" /> },
          { id: 'incidents', label: 'Incidents', icon: <AlertTriangle className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Key Metrics */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Key Performance Metrics</h3>
            {metrics.slice(0, 4).map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
          
          {/* Critical Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Critical Services</h3>
            {healthChecks.slice(0, 4).map((check) => (
              <ServiceCard key={check.id} service={check} onRunCheck={runHealthCheck} />
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} detailed />
          ))}
        </div>
      )}

      {selectedTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {healthChecks.map((check) => (
            <ServiceCard key={check.id} service={check} onRunCheck={runHealthCheck} detailed />
          ))}
        </div>
      )}

      {selectedTab === 'incidents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Incidents</h3>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">
              Report Incident
            </button>
          </div>
          
          {incidents.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Recent Incidents</h3>
              <p className="text-gray-400">All systems are running smoothly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Metric Card Component (simplified for settings)
function MetricCard({ metric, detailed = false }: { metric: HealthMetric; detailed?: boolean }) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <div className="w-4 h-1 bg-gray-400 rounded"></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      case 'critical': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white text-sm">{metric.name}</h4>
          <div className="text-xs text-gray-400 capitalize">{metric.category.replace('_', ' ')}</div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(metric.status)}`}>
          <Activity className="w-3 h-3" />
          <span className="capitalize">{metric.status}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-end space-x-2 mb-1">
          <div className="text-xl font-bold text-white">
            {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
          </div>
          <div className="text-gray-400 text-sm">{metric.unit}</div>
        </div>
        
        {metric.trend !== 'stable' && (
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            {getTrendIcon(metric.trend)}
            <span>{metric.trendPercentage.toFixed(1)}% change</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Service Card Component (simplified for settings)
function ServiceCard({ service, onRunCheck, detailed = false }: { 
  service: HealthCheck; 
  onRunCheck: (id: string) => void;
  detailed?: boolean;
}) {
  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('database')) return <Database className="w-4 h-4" />;
    if (serviceName.toLowerCase().includes('payment')) return <CreditCard className="w-4 h-4" />;
    if (serviceName.toLowerCase().includes('email')) return <Mail className="w-4 h-4" />;
    if (serviceName.toLowerCase().includes('storage')) return <HardDrive className="w-4 h-4" />;
    if (serviceName.toLowerCase().includes('frontend')) return <Globe className="w-4 h-4" />;
    return <Server className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10';
      case 'degraded': return 'text-orange-400 bg-orange-400/10';
      case 'down': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-purple-400">
            {getServiceIcon(service.name)}
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">{service.name}</h4>
            <div className="text-xs text-gray-400">{service.description}</div>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
          <span className="capitalize">{service.status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
        <div>
          <div className="text-gray-400">Response</div>
          <div className="text-white font-medium">{service.responseTime}ms</div>
        </div>
        <div>
          <div className="text-gray-400">Uptime</div>
          <div className="text-green-400 font-medium">{service.uptime.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-gray-400">Last Check</div>
          <div className="text-white font-medium">
            {service.lastCheck.toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="text-xs text-gray-500">
          {service.incidents.length} incident{service.incidents.length !== 1 ? 's' : ''} (30d)
        </div>
        <button
          onClick={() => onRunCheck(service.id)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
        >
          Run Check
        </button>
      </div>
    </div>
  );
}

// Incident Card Component (simplified)
function IncidentCard({ incident }: { incident: HealthIncident }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const duration = incident.resolvedTime 
    ? Math.round((incident.resolvedTime.getTime() - incident.startTime.getTime()) / (1000 * 60))
    : Math.round((Date.now() - incident.startTime.getTime()) / (1000 * 60));

  return (
    <div className={`bg-white/5 rounded-xl p-4 border ${getSeverityColor(incident.severity)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-white text-sm">{incident.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
              {incident.severity.toUpperCase()}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
              {incident.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-2">{incident.description}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div>Started: {incident.startTime.toLocaleString()}</div>
            <div>Duration: {duration}m</div>
            <div>Services: {incident.affectedServices.join(', ')}</div>
          </div>
        </div>
      </div>
      
      {incident.updates.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <div className="text-xs font-medium text-gray-400 mb-1">Latest Update</div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-xs text-gray-300">{incident.updates[incident.updates.length - 1].message}</div>
            <div className="text-xs text-gray-500 mt-1">
              {incident.updates[incident.updates.length - 1].timestamp.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}