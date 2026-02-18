"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { content, checkStress } from "@/lib/content";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  quickReplies?: string[];
}

const quickReplyOptions = [
  "วิธีปลูกพริก",
  "พริกคืออะไร",
  "การดูแลรักษา",
  "โรคพืช",
  "แมลงศัตรูพืช",
  "วัดความเครียด",
];

export default function ChatSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "สวัสดีครับ! ผมคือผู้ช่วยดูแลพริก\nกรุณาเลือกหัวข้อที่ต้องการ หรือพิมพ์คำถามได้เลยครับ",
      isBot: true,
      quickReplies: quickReplyOptions,
    },
  ]);
  const [input, setInput] = useState("");
  const [waitingForMv, setWaitingForMv] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text: string, quickReplies?: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        isBot: true,
        quickReplies,
      },
    ]);
  };

  const processMessage = (userText: string) => {
    const trimmedText = userText.trim();
    
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: trimmedText, isBot: false },
    ]);

    // Process based on state
    setTimeout(() => {
      if (waitingForMv) {
        const stressResult = checkStress(trimmedText);
        if (stressResult) {
          const response = `📊 **ผลการประเมินความเครียดพริก**\n\nค่าความต่างศักย์: ${trimmedText} mV\nสถานะ: ${stressResult.status}\n\n${stressResult.advice}`;
          addBotMessage(response, quickReplyOptions);
          setWaitingForMv(false);
        } else if (isNaN(parseFloat(trimmedText))) {
          // Not a number, process as regular message
          setWaitingForMv(false);
          processRegularMessage(trimmedText);
        } else {
          addBotMessage("กรุณากรอกค่าตัวเลขที่ถูกต้อง");
        }
      } else {
        processRegularMessage(trimmedText);
      }
    }, 300);
  };

  const processRegularMessage = (text: string) => {
    if (text.includes("วัดความเครียด") || text.includes("ตรวจสอบความเครียด") || text.includes("ประเมินความเครียด")) {
      addBotMessage(content.stressPrompt);
      setWaitingForMv(true);
    } else if (text.includes("ปลูก") || text.includes("วิธีปลูก")) {
      addBotMessage(content.planting, quickReplyOptions);
    } else if (text.includes("พริกคือ") || text.includes("ข้อมูลพริก") || text.includes("ประวัติ")) {
      addBotMessage(content.general, quickReplyOptions);
    } else if (text.includes("ดูแล") || text.includes("น้ำ") || text.includes("ปุ๋ย") || text.includes("รักษา")) {
      addBotMessage(content.care, quickReplyOptions);
    } else if (text.includes("โรค") || text.includes("ใบเหี่ยว") || text.includes("เน่า")) {
      addBotMessage(content.diseases, quickReplyOptions);
    } else if (text.includes("แมลง") || text.includes("เพลี้ย") || text.includes("หนอน") || text.includes("ศัตรู")) {
      addBotMessage(content.pests, quickReplyOptions);
    } else if (text.includes("เครียด") || text.includes("วัดค่า")) {
      addBotMessage(
        `⚡ **ระบบประเมินความเครียดของพริก**\n\nพิมพ์คำว่า "วัดความเครียด" หรือ "ตรวจสอบความเครียด" เพื่อเริ่มใช้งานระบบประเมินครับ`,
        quickReplyOptions
      );
    } else {
      addBotMessage(
        "สวัสดีครับ! ผมคือผู้ช่วยดูแลพริก\nกรุณาเลือกหัวข้อที่ต้องการ หรือพิมพ์คำถามได้เลยครับ",
        quickReplyOptions
      );
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    processMessage(input);
    setInput("");
    inputRef.current?.focus();
  };

  const handleQuickReply = (text: string) => {
    processMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          LINE Chatbot Simulator
          <Badge variant="outline" className="ml-2">
            {waitingForMv ? "รอค่า mV" : "พร้อมใช้งาน"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.isBot
                        ? "bg-muted text-foreground rounded-bl-sm"
                        : "bg-green-600 text-white rounded-br-sm"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {msg.text}
                    </pre>
                  </div>
                </div>
                {msg.isBot && msg.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-2">
                    {msg.quickReplies.map((reply) => (
                      <Button
                        key={reply}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 rounded-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Input
            ref={inputRef}
            placeholder={waitingForMv ? "กรอกค่า mV..." : "พิมพ์ข้อความ..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700">
            ส่ง
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
