interface HealthMetric {
  id: string;
  name: string;
  category: 'performance' | 'availability' | 'user_experience' | 'business';
  value: number;
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface HealthCheck {
  id: string;
  name: string;
  description: string;
  endpoint?: string;
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
  incidents: HealthIncident[];
}

interface HealthIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startTime: Date;
  resolvedTime?: Date;
  affectedServices: string[];
  updates: IncidentUpdate[];
}

interface IncidentUpdate {
  id: string;
  timestamp: Date;
  message: string;
  author: string;
  status: string;
}

interface AlertRule {
  id: string;
  name: string;
  metricId: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  duration: number; // minutes
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: ('email' | 'sms' | 'slack' | 'webhook')[];
  enabled: boolean;
  lastTriggered?: Date;
}

interface PerformanceData {
  timestamp: Date;
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  connectionSpeed: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location: string;
}

class HealthMonitoringService {
  private metrics: Map<string, HealthMetric> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private incidents: Map<string, HealthIncident> = new Map();
  private alerts: Map<string, AlertRule> = new Map();
  private performanceData: PerformanceData[] = [];
  private isMonitoring = false;

  constructor() {
    this.initializeDefaultMetrics();
    this.initializeDefaultHealthChecks();
    this.loadFromStorage();
    
    if (typeof window !== 'undefined') {
      this.startMonitoring();
    }
  }

  // Metrics Management
  private initializeDefaultMetrics(): void {
    const defaultMetrics: Omit<HealthMetric, 'id' | 'value' | 'status' | 'lastUpdated' | 'trend' | 'trendPercentage'>[] = [
      {
        name: 'Page Load Time',
        category: 'performance',
        unit: 'ms',
        threshold: { warning: 3000, critical: 5000 }
      },
      {
        name: 'Error Rate',
        category: 'availability',
        unit: '%',
        threshold: { warning: 1, critical: 5 }
      },
      {
        name: 'API Response Time',
        category: 'performance',
        unit: 'ms',
        threshold: { warning: 500, critical: 1000 }
      },
      {
        name: 'Uptime',
        category: 'availability',
        unit: '%',
        threshold: { warning: 99, critical: 95 }
      },
      {
        name: 'Conversion Rate',
        category: 'business',
        unit: '%',
        threshold: { warning: 2, critical: 1 }
      },
      {
        name: 'User Session Duration',
        category: 'user_experience',
        unit: 'minutes',
        threshold: { warning: 2, critical: 1 }
      },
      {
        name: 'Bounce Rate',
        category: 'user_experience',
        unit: '%',
        threshold: { warning: 60, critical: 80 }
      },
      {
        name: 'Memory Usage',
        category: 'performance',
        unit: 'MB',
        threshold: { warning: 100, critical: 200 }
      }
    ];

    defaultMetrics.forEach((metric, index) => {
      const fullMetric: HealthMetric = {
        id: `metric_${index + 1}`,
        ...metric,
        value: this.generateMockValue(metric.name),
        status: 'healthy',
        lastUpdated: new Date(),
        trend: 'stable',
        trendPercentage: 0
      };
      
      fullMetric.status = this.calculateMetricStatus(fullMetric);
      this.metrics.set(fullMetric.id, fullMetric);
    });
  }

  private initializeDefaultHealthChecks(): void {
    const defaultChecks: Omit<HealthCheck, 'id'>[] = [
      {
        name: 'Frontend Application',
        description: 'Main React application availability',
        status: 'healthy',
        responseTime: 150,
        uptime: 99.9,
        lastCheck: new Date(),
        incidents: []
      },
      {
        name: 'Authentication Service',
        description: 'User authentication and authorization',
        endpoint: '/api/auth/health',
        status: 'healthy',
        responseTime: 85,
        uptime: 99.8,
        lastCheck: new Date(),
        incidents: []
      },
      {
        name: 'Database Connection',
        description: 'Primary database connectivity',
        endpoint: '/api/db/health',
        status: 'healthy',
        responseTime: 45,
        uptime: 99.95,
        lastCheck: new Date(),
        incidents: []
      },
      {
        name: 'Payment Processing',
        description: 'Stripe payment gateway',
        endpoint: '/api/payments/health',
        status: 'healthy',
        responseTime: 320,
        uptime: 99.7,
        lastCheck: new Date(),
        incidents: []
      },
      {
        name: 'Email Service',
        description: 'Transactional email delivery',
        status: 'healthy',
        responseTime: 150,
        uptime: 98.9,
        lastCheck: new Date(),
        incidents: []
      },
      {
        name: 'File Storage',
        description: 'Asset and file storage service',
        status: 'healthy',
        responseTime: 200,
        uptime: 99.5,
        lastCheck: new Date(),
        incidents: []
      }
    ];

    defaultChecks.forEach((check, index) => {
      const fullCheck: HealthCheck = {
        id: `check_${index + 1}`,
        ...check
      };
      this.healthChecks.set(fullCheck.id, fullCheck);
    });
  }

  // Performance Monitoring
  collectPerformanceData(data: Partial<PerformanceData>): void {
    const perfData: PerformanceData = {
      timestamp: new Date(),
      pageLoadTime: data.pageLoadTime || 0,
      firstContentfulPaint: data.firstContentfulPaint || 0,
      largestContentfulPaint: data.largestContentfulPaint || 0,
      cumulativeLayoutShift: data.cumulativeLayoutShift || 0,
      firstInputDelay: data.firstInputDelay || 0,
      timeToInteractive: data.timeToInteractive || 0,
      connectionSpeed: data.connectionSpeed || 'unknown',
      deviceType: data.deviceType || 'desktop',
      location: data.location || 'unknown'
    };

    this.performanceData.push(perfData);
    
    // Keep only last 1000 entries
    if (this.performanceData.length > 1000) {
      this.performanceData = this.performanceData.slice(-1000);
    }

    // Update relevant metrics
    this.updateMetric('metric_1', perfData.pageLoadTime); // Page Load Time
    this.saveToStorage();
  }

  // Real User Monitoring (RUM)
  startRealUserMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Collect Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.collectPerformanceData({
          largestContentfulPaint: lastEntry.startTime,
          deviceType: this.getDeviceType(),
          connectionSpeed: this.getConnectionSpeed()
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.collectPerformanceData({
            firstInputDelay: entry.processingStart - entry.startTime,
            deviceType: this.getDeviceType()
          });
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let cumulativeScore = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cumulativeScore += entry.value;
          }
        });
        this.collectPerformanceData({
          cumulativeLayoutShift: cumulativeScore,
          deviceType: this.getDeviceType()
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // Monitor page load times
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.collectPerformanceData({
          pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          firstContentfulPaint: this.getFirstContentfulPaint(),
          timeToInteractive: navigation.domInteractive - navigation.fetchStart,
          deviceType: this.getDeviceType(),
          connectionSpeed: this.getConnectionSpeed(),
          location: this.getUserLocation()
        });
      }
    });
  }

  // Metrics Operations
  updateMetric(metricId: string, value: number): void {
    const metric = this.metrics.get(metricId);
    if (!metric) return;

    const previousValue = metric.value;
    metric.value = value;
    metric.lastUpdated = new Date();
    
    // Calculate trend
    if (previousValue !== 0) {
      const change = ((value - previousValue) / previousValue) * 100;
      metric.trendPercentage = Math.abs(change);
      
      if (change > 0.5) metric.trend = 'up';
      else if (change < -0.5) metric.trend = 'down';
      else metric.trend = 'stable';
    }
    
    // Update status
    metric.status = this.calculateMetricStatus(metric);
    
    // Check alerts
    this.checkAlerts(metric);
    
    this.saveToStorage();
  }

  private calculateMetricStatus(metric: HealthMetric): 'healthy' | 'warning' | 'critical' | 'unknown' {
    const { value, threshold, name } = metric;
    
    // Inverse metrics (lower is better)
    const inverseMetrics = ['Error Rate', 'Page Load Time', 'API Response Time', 'Bounce Rate', 'Memory Usage'];
    const isInverse = inverseMetrics.includes(name);
    
    if (isInverse) {
      if (value >= threshold.critical) return 'critical';
      if (value >= threshold.warning) return 'warning';
      return 'healthy';
    } else {
      // Normal metrics (higher is better)
      if (value <= threshold.critical) return 'critical';
      if (value <= threshold.warning) return 'warning';
      return 'healthy';
    }
  }

  // Health Checks
  async runHealthCheck(checkId: string): Promise<void> {
    const check = this.healthChecks.get(checkId);
    if (!check) return;

    const startTime = Date.now();
    
    try {
      if (check.endpoint) {
        // Simulate API call
        await this.simulateAPICall(check.endpoint);
      }
      
      const responseTime = Date.now() - startTime;
      
      check.responseTime = responseTime;
      check.status = responseTime > 2000 ? 'degraded' : 'healthy';
      check.lastCheck = new Date();
      
      // Update uptime (simplified calculation)
      if (check.status === 'healthy') {
        check.uptime = Math.min(99.99, check.uptime + 0.01);
      } else {
        check.uptime = Math.max(95, check.uptime - 0.1);
      }
      
    } catch (error) {
      check.status = 'down';
      check.responseTime = Date.now() - startTime;
      check.lastCheck = new Date();
      check.uptime = Math.max(90, check.uptime - 0.5);
      
      // Create incident if not already exists
      this.createIncident({
        title: `${check.name} Service Down`,
        description: `Health check failed for ${check.name}`,
        severity: 'high',
        affectedServices: [check.name]
      });
    }
    
    this.saveToStorage();
  }

  async runAllHealthChecks(): Promise<void> {
    const promises = Array.from(this.healthChecks.keys()).map(id => this.runHealthCheck(id));
    await Promise.all(promises);
  }

  // Incident Management
  createIncident(incident: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedServices: string[];
  }): string {
    const newIncident: HealthIncident = {
      id: this.generateId(),
      ...incident,
      status: 'investigating',
      startTime: new Date(),
      updates: [
        {
          id: this.generateId(),
          timestamp: new Date(),
          message: 'Incident created and investigation started',
          author: 'System',
          status: 'investigating'
        }
      ]
    };
    
    this.incidents.set(newIncident.id, newIncident);
    this.saveToStorage();
    return newIncident.id;
  }

  updateIncident(incidentId: string, update: {
    message: string;
    author: string;
    status?: string;
  }): void {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;
    
    const newUpdate: IncidentUpdate = {
      id: this.generateId(),
      timestamp: new Date(),
      ...update,
      status: update.status || incident.status
    };
    
    incident.updates.push(newUpdate);
    
    if (update.status === 'resolved') {
      incident.status = 'resolved';
      incident.resolvedTime = new Date();
    } else if (update.status) {
      incident.status = update.status as any;
    }
    
    this.saveToStorage();
  }

  // Alert System
  createAlert(alert: Omit<AlertRule, 'id'>): string {
    const newAlert: AlertRule = {
      id: this.generateId(),
      ...alert
    };
    
    this.alerts.set(newAlert.id, newAlert);
    this.saveToStorage();
    return newAlert.id;
  }

  private checkAlerts(metric: HealthMetric): void {
    const relevantAlerts = Array.from(this.alerts.values())
      .filter(alert => alert.metricId === metric.id && alert.enabled);
    
    relevantAlerts.forEach(alert => {
      const shouldTrigger = this.evaluateAlertCondition(alert, metric.value);
      
      if (shouldTrigger && (!alert.lastTriggered || 
          Date.now() - alert.lastTriggered.getTime() > alert.duration * 60000)) {
        
        this.triggerAlert(alert, metric);
        alert.lastTriggered = new Date();
        this.saveToStorage();
      }
    });
  }

  private evaluateAlertCondition(alert: AlertRule, value: number): boolean {
    switch (alert.condition) {
      case 'greater_than': return value > alert.threshold;
      case 'less_than': return value < alert.threshold;
      case 'equals': return value === alert.threshold;
      case 'not_equals': return value !== alert.threshold;
      default: return false;
    }
  }

  private triggerAlert(alert: AlertRule, metric: HealthMetric): void {
    console.warn(`🚨 ALERT: ${alert.name}`, {
      metric: metric.name,
      value: metric.value,
      threshold: alert.threshold,
      severity: alert.severity
    });
    
    // In production, this would send to actual channels
    if (alert.channels.includes('email')) {
      console.log(`📧 Email alert sent for ${alert.name}`);
    }
    if (alert.channels.includes('sms')) {
      console.log(`📱 SMS alert sent for ${alert.name}`);
    }
    if (alert.channels.includes('slack')) {
      console.log(`💬 Slack notification sent for ${alert.name}`);
    }
  }

  // Monitoring Control
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.startRealUserMonitoring();
    
    // Run health checks every 5 minutes
    setInterval(() => {
      this.runAllHealthChecks();
    }, 5 * 60 * 1000);
    
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateMockMetrics();
    }, 30 * 1000);
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  // Data Access
  getAllMetrics(): HealthMetric[] {
    return Array.from(this.metrics.values());
  }

  getMetric(metricId: string): HealthMetric | undefined {
    return this.metrics.get(metricId);
  }

  getAllHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  getHealthCheck(checkId: string): HealthCheck | undefined {
    return this.healthChecks.get(checkId);
  }

  getAllIncidents(): HealthIncident[] {
    return Array.from(this.incidents.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  getActiveIncidents(): HealthIncident[] {
    return this.getAllIncidents().filter(incident => incident.status !== 'resolved');
  }

  getAllAlerts(): AlertRule[] {
    return Array.from(this.alerts.values());
  }

  getPerformanceData(limit = 100): PerformanceData[] {
    return this.performanceData.slice(-limit);
  }

  // System Status
  getSystemStatus(): {
    overall: 'healthy' | 'degraded' | 'down' | 'maintenance';
    summary: string;
    stats: {
      healthyServices: number;
      totalServices: number;
      activeIncidents: number;
      avgResponseTime: number;
    };
  } {
    const healthChecks = this.getAllHealthChecks();
    const healthyServices = healthChecks.filter(check => check.status === 'healthy').length;
    const activeIncidents = this.getActiveIncidents().length;
    const avgResponseTime = healthChecks.reduce((sum, check) => sum + check.responseTime, 0) / healthChecks.length;
    
    let overall: 'healthy' | 'degraded' | 'down' | 'maintenance' = 'healthy';
    let summary = 'All systems operational';
    
    if (activeIncidents > 0 || healthyServices < healthChecks.length * 0.8) {
      overall = 'degraded';
      summary = `${activeIncidents} active incident${activeIncidents !== 1 ? 's' : ''}, some services degraded`;
    }
    
    if (healthyServices < healthChecks.length * 0.5) {
      overall = 'down';
      summary = 'Major service disruption detected';
    }
    
    return {
      overall,
      summary,
      stats: {
        healthyServices,
        totalServices: healthChecks.length,
        activeIncidents,
        avgResponseTime: Math.round(avgResponseTime)
      }
    };
  }

  // Utility Methods
  private updateMockMetrics(): void {
    this.metrics.forEach((metric, id) => {
      const newValue = this.generateMockValue(metric.name, metric.value);
      this.updateMetric(id, newValue);
    });
  }

  private generateMockValue(metricName: string, currentValue?: number): number {
    const baseValues: Record<string, number> = {
      'Page Load Time': 2000,
      'Error Rate': 0.5,
      'API Response Time': 300,
      'Uptime': 99.9,
      'Conversion Rate': 3.5,
      'User Session Duration': 5.2,
      'Bounce Rate': 45,
      'Memory Usage': 80
    };
    
    const base = baseValues[metricName] || 50;
    const variation = base * 0.1; // 10% variation
    
    if (currentValue !== undefined) {
      // Small incremental changes for realistic simulation
      const change = (Math.random() - 0.5) * (base * 0.05);
      return Math.max(0, currentValue + change);
    }
    
    return base + (Math.random() - 0.5) * variation;
  }

  private async simulateAPICall(endpoint: string): Promise<void> {
    const delay = Math.random() * 500 + 100; // 100-600ms
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // 5% chance of failure for testing
    if (Math.random() < 0.05) {
      throw new Error(`API call to ${endpoint} failed`);
    }
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConnectionSpeed(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.effectiveType || 'unknown';
  }

  private getUserLocation(): string {
    // In production, this would use geolocation or IP-based location
    return 'US-West';
  }

  private getFirstContentfulPaint(): number {
    if (typeof window === 'undefined') return 0;
    const entries = performance.getEntriesByName('first-contentful-paint');
    return entries.length > 0 ? entries[0].startTime : 0;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('health_metrics', JSON.stringify(Array.from(this.metrics.entries())));
      localStorage.setItem('health_checks', JSON.stringify(Array.from(this.healthChecks.entries())));
      localStorage.setItem('health_incidents', JSON.stringify(Array.from(this.incidents.entries())));
      localStorage.setItem('health_alerts', JSON.stringify(Array.from(this.alerts.entries())));
      localStorage.setItem('performance_data', JSON.stringify(this.performanceData.slice(-100))); // Keep last 100
    } catch (error) {
      console.error('Failed to save health monitoring data:', error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const metricsData = localStorage.getItem('health_metrics');
      if (metricsData) {
        const parsedMetrics = JSON.parse(metricsData);
        // Convert dates back from JSON
        parsedMetrics.forEach(([id, metric]: [string, any]) => {
          metric.lastUpdated = new Date(metric.lastUpdated);
          this.metrics.set(id, metric);
        });
      }
      
      const checksData = localStorage.getItem('health_checks');
      if (checksData) {
        const parsedChecks = JSON.parse(checksData);
        parsedChecks.forEach(([id, check]: [string, any]) => {
          check.lastCheck = new Date(check.lastCheck);
          this.healthChecks.set(id, check);
        });
      }
      
      const incidentsData = localStorage.getItem('health_incidents');
      if (incidentsData) {
        const parsedIncidents = JSON.parse(incidentsData);
        parsedIncidents.forEach(([id, incident]: [string, any]) => {
          incident.startTime = new Date(incident.startTime);
          if (incident.resolvedTime) incident.resolvedTime = new Date(incident.resolvedTime);
          incident.updates.forEach((update: any) => {
            update.timestamp = new Date(update.timestamp);
          });
          this.incidents.set(id, incident);
        });
      }
      
      const alertsData = localStorage.getItem('health_alerts');
      if (alertsData) {
        const parsedAlerts = JSON.parse(alertsData);
        parsedAlerts.forEach(([id, alert]: [string, any]) => {
          if (alert.lastTriggered) alert.lastTriggered = new Date(alert.lastTriggered);
          this.alerts.set(id, alert);
        });
      }
      
      const perfData = localStorage.getItem('performance_data');
      if (perfData) {
        const parsedPerfData = JSON.parse(perfData);
        this.performanceData = parsedPerfData.map((data: any) => ({
          ...data,
          timestamp: new Date(data.timestamp)
        }));
      }
      
    } catch (error) {
      console.error('Failed to load health monitoring data:', error);
    }
  }
}

// Singleton instance
export const healthMonitoringService = new HealthMonitoringService();

export {
  HealthMetric,
  HealthCheck,
  HealthIncident,
  AlertRule,
  PerformanceData,
  IncidentUpdate
};