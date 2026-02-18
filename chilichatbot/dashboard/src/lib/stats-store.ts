// In-memory stats store (in production, use a database like Redis or PostgreSQL)

export interface MessageLog {
  id: string;
  userId: string;
  userMessage: string;
  botResponse: string;
  topic: string;
  timestamp: Date;
}

export interface UserSession {
  userId: string;
  lastActive: Date;
  messageCount: number;
  topics: string[];
}

export interface StatsData {
  totalMessages: number;
  totalUsers: number;
  activeUsers: number;
  topicStats: Record<string, number>;
  stressChecks: number;
  hourlyMessages: number[];
  dailyMessages: { date: string; count: number }[];
  recentMessages: MessageLog[];
  userSessions: Map<string, UserSession>;
}

// Global stats store
const stats: StatsData = {
  totalMessages: 0,
  totalUsers: 0,
  activeUsers: 0,
  topicStats: {
    planting: 0,
    general: 0,
    care: 0,
    diseases: 0,
    pests: 0,
    stress: 0,
    menu: 0,
  },
  stressChecks: 0,
  hourlyMessages: new Array(24).fill(0),
  dailyMessages: [],
  recentMessages: [],
  userSessions: new Map(),
};

export function getStats(): Omit<StatsData, 'userSessions'> & { userSessions: UserSession[] } {
  return {
    ...stats,
    userSessions: Array.from(stats.userSessions.values()),
  };
}

export function trackMessage(
  userId: string,
  userMessage: string,
  botResponse: string,
  topic: string
) {
  const now = new Date();
  const hour = now.getHours();
  
  // Update total messages
  stats.totalMessages++;
  
  // Update hourly stats
  stats.hourlyMessages[hour]++;
  
  // Update topic stats
  if (stats.topicStats[topic] !== undefined) {
    stats.topicStats[topic]++;
  }
  
  // Track stress checks
  if (topic === 'stress') {
    stats.stressChecks++;
  }
  
  // Update user session
  let session = stats.userSessions.get(userId);
  if (!session) {
    session = {
      userId,
      lastActive: now,
      messageCount: 0,
      topics: [],
    };
    stats.userSessions.set(userId, session);
    stats.totalUsers++;
  }
  session.lastActive = now;
  session.messageCount++;
  if (!session.topics.includes(topic)) {
    session.topics.push(topic);
  }
  
  // Count active users (active in last 5 minutes)
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  stats.activeUsers = Array.from(stats.userSessions.values()).filter(
    (s) => s.lastActive > fiveMinutesAgo
  ).length;
  
  // Add to recent messages (keep last 100)
  const messageLog: MessageLog = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userMessage,
    botResponse: botResponse.substring(0, 200),
    topic,
    timestamp: now,
  };
  stats.recentMessages.unshift(messageLog);
  if (stats.recentMessages.length > 100) {
    stats.recentMessages = stats.recentMessages.slice(0, 100);
  }
  
  // Update daily messages
  const dateStr = now.toISOString().split('T')[0];
  const dailyEntry = stats.dailyMessages.find((d) => d.date === dateStr);
  if (dailyEntry) {
    dailyEntry.count++;
  } else {
    stats.dailyMessages.push({ date: dateStr, count: 1 });
    // Keep last 30 days
    if (stats.dailyMessages.length > 30) {
      stats.dailyMessages = stats.dailyMessages.slice(-30);
    }
  }
}

export function resetStats() {
  stats.totalMessages = 0;
  stats.totalUsers = 0;
  stats.activeUsers = 0;
  stats.topicStats = {
    planting: 0,
    general: 0,
    care: 0,
    diseases: 0,
    pests: 0,
    stress: 0,
    menu: 0,
  };
  stats.stressChecks = 0;
  stats.hourlyMessages = new Array(24).fill(0);
  stats.dailyMessages = [];
  stats.recentMessages = [];
  stats.userSessions.clear();
}
