"use client";

import { useState, useEffect } from "react";
import { AdminSidebar, MobileSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [webhookStatus, setWebhookStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    // Check webhook status
    const checkWebhook = async () => {
      try {
        const res = await fetch("/api/webhook");
        const data = await res.json();
        setWebhookStatus(data.configured ? "connected" : "disconnected");
      } catch {
        setWebhookStatus("disconnected");
      }
    };
    checkWebhook();

    // Get current URL for webhook
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/webhook`);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
                  ตั้งค่า LINE Bot
                </h1>
                <p className="text-sm text-muted-foreground">
                  กำหนดค่าการเชื่อมต่อกับ LINE Messaging API
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                สถานะการเชื่อมต่อ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    webhookStatus === "connected"
                      ? "bg-green-500 animate-pulse"
                      : webhookStatus === "checking"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-lg font-medium">
                  {webhookStatus === "connected"
                    ? "เชื่อมต่อแล้ว"
                    : webhookStatus === "checking"
                    ? "กำลังตรวจสอบ..."
                    : "ยังไม่ได้เชื่อมต่อ"}
                </span>
                <Badge
                  variant={webhookStatus === "connected" ? "default" : "destructive"}
                >
                  {webhookStatus === "connected" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Webhook URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                Webhook URL
              </CardTitle>
              <CardDescription>
                คัดลอก URL นี้ไปตั้งค่าใน LINE Developers Console
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                <Button onClick={() => copyToClipboard(webhookUrl)}>คัดลอก</Button>
              </div>
              <Alert>
                <AlertTitle>วิธีการตั้งค่า</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <p>1. ไปที่ <a href="https://developers.line.biz/console/" target="_blank" className="text-blue-600 underline">LINE Developers Console</a></p>
                  <p>2. เลือก Provider และ Channel ของคุณ</p>
                  <p>3. ไปที่ Messaging API settings</p>
                  <p>4. วาง Webhook URL ด้านบนในช่อง Webhook URL</p>
                  <p>5. เปิดใช้งาน Use webhook</p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Separator />

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Environment Variables ที่ต้องตั้งค่า
              </CardTitle>
              <CardDescription>
                ตั้งค่าตัวแปรเหล่านี้ใน .env.local ของโปรเจค
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="font-medium">LINE_CHANNEL_ACCESS_TOKEN</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="ใส่ Channel Access Token จาก LINE Console" 
                    type="password"
                    className="font-mono"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  หาได้จาก Messaging API settings &gt; Channel access token
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-medium">LINE_CHANNEL_SECRET</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="ใส่ Channel Secret จาก LINE Console" 
                    type="password"
                    className="font-mono"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  หาได้จาก Basic settings &gt; Channel secret
                </p>
              </div>

              <Alert className="border-amber-500">
                <AlertTitle>📝 ตัวอย่างไฟล์ .env.local</AlertTitle>
                <AlertDescription>
                  <pre className="mt-2 p-3 bg-muted rounded-lg text-sm font-mono overflow-x-auto">
{`LINE_CHANNEL_ACCESS_TOKEN=your_access_token_here
LINE_CHANNEL_SECRET=your_channel_secret_here`}
                  </pre>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* API Endpoints Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔌</span>
                API Endpoints
              </CardTitle>
              <CardDescription>
                ใช้ @line/bot-sdk สำหรับการเชื่อมต่อกับ LINE Messaging API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <Badge className="mb-2">GET</Badge>
                  <code className="ml-2">/api/webhook</code>
                  <p className="text-muted-foreground mt-1">ตรวจสอบสถานะ webhook และ LINE SDK</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge className="mb-2 bg-green-600">POST</Badge>
                  <code className="ml-2">/api/webhook</code>
                  <p className="text-muted-foreground mt-1">รับข้อความจาก LINE (ใช้ LINE SDK validateSignature & MessagingApiClient)</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge className="mb-2">GET</Badge>
                  <code className="ml-2">/api/stats</code>
                  <p className="text-muted-foreground mt-1">ดึงสถิติการใช้งาน</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge className="mb-2 bg-green-600">POST</Badge>
                  <code className="ml-2">/api/stats</code>
                  <p className="text-muted-foreground mt-1">บันทึกข้อมูลสถิติ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LINE SDK Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                @line/bot-sdk
              </CardTitle>
              <CardDescription>
                Dashboard นี้ใช้ LINE Bot SDK อย่างเป็นทางการสำหรับ Node.js
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">คุณสมบัติที่ใช้:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <code>MessagingApiClient</code> - ส่งข้อความตอบกลับ</li>
                  <li>• <code>validateSignature</code> - ตรวจสอบลายเซ็นของ webhook</li>
                  <li>• Type definitions - TypeScript types สำหรับ LINE API</li>
                </ul>
              </div>
              <Alert>
                <AlertTitle>📖 เอกสาร</AlertTitle>
                <AlertDescription>
                  <a 
                    href="https://github.com/line/line-bot-sdk-nodejs" 
                    target="_blank" 
                    className="text-blue-600 underline"
                  >
                    LINE Bot SDK for Node.js - GitHub
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
