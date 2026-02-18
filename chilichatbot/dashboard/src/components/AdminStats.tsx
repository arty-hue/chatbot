"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface StatsData {
  totalMessages: number;
  totalUsers: number;
  activeUsers: number;
  topicStats: Record<string, number>;
  stressChecks: number;
  hourlyMessages: number[];
  dailyMessages: { date: string; count: number }[];
  recentMessages: {
    id: string;
    userId: string;
    userMessage: string;
    botResponse: string;
    topic: string;
    timestamp: string;
  }[];
}

const topicLabels: Record<string, string> = {
  planting: "วิธีปลูก",
  general: "ข้อมูลทั่วไป",
  care: "การดูแล",
  diseases: "โรคพืช",
  pests: "แมลงศัตรูพืช",
  stress: "ประเมินความเครียด",
  menu: "เมนูหลัก",
};

const topicColors: Record<string, string> = {
  planting: "#22c55e",
  general: "#3b82f6",
  care: "#06b6d4",
  diseases: "#f59e0b",
  pests: "#ef4444",
  stress: "#8b5cf6",
  menu: "#64748b",
};

export default function AdminStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-muted-foreground">
        ไม่สามารถโหลดข้อมูลสถิติได้
      </div>
    );
  }

  // Prepare chart data
  const topicChartData = Object.entries(stats.topicStats)
    .map(([topic, count]) => ({
      topic: topicLabels[topic] || topic,
      count,
      fill: topicColors[topic] || "#64748b",
    }))
    .filter((d) => d.count > 0);

  const hourlyChartData = stats.hourlyMessages.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    messages: count,
  }));

  const chartConfig = {
    messages: {
      label: "ข้อความ",
      color: "#22c55e",
    },
    count: {
      label: "จำนวน",
      color: "#22c55e",
    },
  };

  return (
    <div className="space-y-6">
      {/* Auto-refresh toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`text-sm px-3 py-1 rounded-full ${
            autoRefresh
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {autoRefresh ? "🔄 รีเฟรชอัตโนมัติ: เปิด" : "⏸️ รีเฟรชอัตโนมัติ: ปิด"}
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ข้อความทั้งหมด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.totalMessages.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ผู้ใช้ทั้งหมด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ผู้ใช้งานอยู่
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-emerald-600">
                {stats.activeUsers}
              </div>
              <Badge variant="outline" className="text-xs">
                5 นาทีล่าสุด
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ตรวจสอบความเครียด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.stressChecks.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 หัวข้อที่ถูกถามมากที่สุด</CardTitle>
          </CardHeader>
          <CardContent>
            {topicChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicChartData}
                      dataKey="count"
                      nameKey="topic"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ topic, count }) => `${topic}: ${count}`}
                    >
                      {topicChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                ยังไม่มีข้อมูล
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hourly Messages - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🕐 ข้อความรายชั่วโมง (วันนี้)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyChartData}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="messages" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      {stats.dailyMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📈 แนวโน้มรายวัน</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyMessages}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Topic Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 สถิติตามหัวข้อ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.topicStats).map(([topic, count]) => (
              <div
                key={topic}
                className="p-3 rounded-lg border flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: topicColors[topic] }}
                ></div>
                <div>
                  <p className="text-sm font-medium">{topicLabels[topic]}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💬 ข้อความล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentMessages.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {stats.recentMessages.slice(0, 20).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      style={{ backgroundColor: topicColors[msg.topic] }}
                      className="text-white text-xs"
                    >
                      {topicLabels[msg.topic]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleString("th-TH")}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">ผู้ใช้:</span> {msg.userMessage}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    <span className="font-medium">บอท:</span> {msg.botResponse}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              ยังไม่มีข้อความ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
