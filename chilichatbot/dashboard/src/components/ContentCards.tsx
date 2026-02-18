"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { content } from "@/lib/content";

interface ContentSection {
  key: keyof typeof content;
  title: string;
  icon: string;
}

const sections: ContentSection[] = [
  { key: "general", title: "พริกคืออะไร", icon: "🌶️" },
  { key: "planting", title: "วิธีปลูก", icon: "🌱" },
  { key: "care", title: "การดูแล", icon: "💧" },
  { key: "diseases", title: "โรคพืช", icon: "🍂" },
  { key: "pests", title: "แมลงศัตรูพืช", icon: "🐛" },
];

function formatContent(text: string): React.ReactNode {
  // Split by newlines and format
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Check if it's a numbered item
    if (/^\d+\./.test(line.trim())) {
      return (
        <p key={i} className="ml-4 mb-2">
          {line}
        </p>
      );
    }
    // Check if it's a bullet point
    if (line.trim().startsWith("-")) {
      return (
        <p key={i} className="ml-4 mb-2">
          {line}
        </p>
      );
    }
    // Empty line
    if (!line.trim()) {
      return <br key={i} />;
    }
    // Regular line
    return (
      <p key={i} className="mb-2 font-medium">
        {line}
      </p>
    );
  });
}

export default function ContentCards() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          คลังความรู้เรื่องพริก
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            {sections.map((section) => (
              <TabsTrigger
                key={section.key}
                value={section.key}
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline mr-1">{section.icon}</span>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((section) => (
            <TabsContent key={section.key} value={section.key}>
              <div className="p-4 bg-muted/50 rounded-lg min-h-[200px]">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {formatContent(content[section.key])}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
