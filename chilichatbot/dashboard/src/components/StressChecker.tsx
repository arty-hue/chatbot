"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkStress, StressResult } from "@/lib/content";

export default function StressChecker() {
  const [voltage, setVoltage] = useState("");
  const [result, setResult] = useState<StressResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = () => {
    setError("");
    const stressResult = checkStress(voltage);
    if (stressResult) {
      setResult(stressResult);
    } else {
      setError("กรุณากรอกค่าตัวเลขที่ถูกต้อง");
      setResult(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          ระบบประเมินความเครียดพริก
        </CardTitle>
        <CardDescription>
          กรอกค่าความต่างศักย์ (mV) ที่วัดได้จากต้นพริก เพื่อประเมินระดับความเครียด
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="กรอกค่า mV เช่น 120, 85, 40"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleCheck} className="bg-green-600 hover:bg-green-700">
            ประเมิน
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>ข้อผิดพลาด</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ระดับสุขภาพพริก</span>
              <Badge
                style={{ backgroundColor: result.color }}
                className="text-white"
              >
                {result.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <Progress
                value={result.level}
                className="h-4"
                style={{
                  // @ts-expect-error CSS custom property
                  "--progress-color": result.color,
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>วิกฤต</span>
                <span>เครียด</span>
                <span>ปกติ</span>
                <span>แข็งแรง</span>
              </div>
            </div>

            <Alert className="border-l-4" style={{ borderLeftColor: result.color }}>
              <AlertTitle>ผลการประเมิน</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="text-sm">
                  <strong>ค่าที่วัดได้:</strong> {voltage} mV
                </p>
                <p className="mt-2">{result.advice}</p>
              </AlertDescription>
            </Alert>

            {/* Sample voltage ranges info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-green-100 dark:bg-green-900/30">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>≥120 mV: ปกติ (ไม่เครียด)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-lime-100 dark:bg-lime-900/30">
                <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                <span>100-119 mV: ปกติ</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-yellow-100 dark:bg-yellow-900/30">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>70-99 mV: เริ่มเครียด</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-orange-100 dark:bg-orange-900/30">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>40-69 mV: มีความเครียด</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 p-2 rounded bg-red-100 dark:bg-red-900/30">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>&lt;40 mV: ความเครียดสูง (วิกฤต)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
