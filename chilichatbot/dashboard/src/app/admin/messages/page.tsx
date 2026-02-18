"use client";

import { useEffect, useState } from "react";
import { AdminSidebar, MobileSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageLog {
  id: string;
  userId: string;
  userMessage: string;
  botResponse: string;
  topic: string;
  timestamp: string;
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

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setMessages(data.recentMessages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesText =
      !filter ||
      msg.userMessage.toLowerCase().includes(filter.toLowerCase()) ||
      msg.botResponse.toLowerCase().includes(filter.toLowerCase());
    const matchesTopic = !topicFilter || msg.topic === topicFilter;
    return matchesText && matchesTopic;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <MobileSidebar />
              <span className="text-4xl lg:hidden">🌶️</span>
              <div>
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  ข้อความล่าสุด
                </h1>
                <p className="text-sm text-muted-foreground">
                  ดูประวัติการสนทนากับผู้ใช้
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Input
                  placeholder="ค้นหาข้อความ..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="max-w-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={topicFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTopicFilter(null)}
                  >
                    ทั้งหมด
                  </Button>
                  {Object.entries(topicLabels).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={topicFilter === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTopicFilter(key)}
                      style={{
                        backgroundColor:
                          topicFilter === key ? topicColors[key] : undefined,
                        borderColor: topicColors[key],
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  ข้อความ ({filteredMessages.length})
                </span>
                <Badge variant="outline">
                  อัพเดตอัตโนมัติทุก 10 วินาที
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : filteredMessages.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4 pr-4">
                    {filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              style={{ backgroundColor: topicColors[msg.topic] }}
                              className="text-white"
                            >
                              {topicLabels[msg.topic]}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              User: {msg.userId.substring(0, 8)}...
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleString("th-TH")}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm">
                              👤
                            </div>
                            <div className="flex-1 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                              <p className="text-sm">{msg.userMessage}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm">
                              🌶️
                            </div>
                            <div className="flex-1 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                              <p className="text-sm whitespace-pre-wrap">
                                {msg.botResponse}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-16">
                  <span className="text-4xl mb-4 block">📭</span>
                  <p>ยังไม่มีข้อความ</p>
                  <p className="text-sm mt-2">
                    ข้อความจะปรากฏเมื่อมีผู้ใช้สนทนากับแชทบอท
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
