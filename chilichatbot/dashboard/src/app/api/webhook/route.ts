import { NextResponse } from 'next/server';
import { trackMessage } from '@/lib/stats-store';
import { content, checkStress } from '@/lib/content';

// In-memory session state for stress checking
const sessions: Map<string, string> = new Map();

// LINE API configuration from environment variables
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

interface LineEvent {
  type: string;
  replyToken: string;
  source: {
    userId: string;
    type: string;
  };
  message?: {
    type: string;
    text: string;
  };
}

interface LineWebhookBody {
  events: LineEvent[];
}

async function replyToLine(replyToken: string, messages: Array<{ type: string; text?: string; quickReply?: unknown }>) {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.log('LINE_CHANNEL_ACCESS_TOKEN not set, skipping reply');
    return;
  }

  try {
    await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken,
        messages,
      }),
    });
  } catch (error) {
    console.error('Error replying to LINE:', error);
  }
}

function processMessage(userText: string, userId: string): { replyText: string; topic: string; quickReplies?: string[] } {
  const trimmedText = userText.trim();
  let replyText = '';
  let topic = 'menu';

  // Check session state for stress measurement
  if (sessions.get(userId) === 'WAITING_FOR_MV') {
    const stressResult = checkStress(trimmedText);
    if (stressResult) {
      replyText = `📊 **ผลการประเมินความเครียดพริก**\n\nค่าความต่างศักย์: ${trimmedText} mV\nสถานะ: ${stressResult.status}\n\n${stressResult.advice}`;
      topic = 'stress';
      sessions.delete(userId);
      return { replyText, topic };
    } else if (isNaN(parseFloat(trimmedText))) {
      sessions.delete(userId);
      // Fall through to regular processing
    }
  }

  // Regular keyword matching
  if (trimmedText.includes('วัดความเครียด') || trimmedText.includes('ตรวจสอบความเครียด') || trimmedText.includes('ประเมินความเครียด')) {
    sessions.set(userId, 'WAITING_FOR_MV');
    replyText = content.stressPrompt;
    topic = 'stress';
  } else if (trimmedText.includes('ปลูก') || trimmedText.includes('วิธีปลูก')) {
    replyText = content.planting;
    topic = 'planting';
  } else if (trimmedText.includes('พริกคือ') || trimmedText.includes('ข้อมูลพริก') || trimmedText.includes('ประวัติ')) {
    replyText = content.general;
    topic = 'general';
  } else if (trimmedText.includes('ดูแล') || trimmedText.includes('น้ำ') || trimmedText.includes('ปุ๋ย')) {
    replyText = content.care;
    topic = 'care';
  } else if (trimmedText.includes('โรค') || trimmedText.includes('ใบเหี่ยว') || trimmedText.includes('เน่า')) {
    replyText = content.diseases;
    topic = 'diseases';
  } else if (trimmedText.includes('แมลง') || trimmedText.includes('เพลี้ย') || trimmedText.includes('หนอน')) {
    replyText = content.pests;
    topic = 'pests';
  } else if (trimmedText.includes('เครียด') || trimmedText.includes('วัดค่า')) {
    replyText = `⚡ **ระบบประเมินความเครียดของพริก**\n\nพิมพ์คำว่า "วัดความเครียด" หรือ "ตรวจสอบความเครียด" เพื่อเริ่มใช้งานระบบประเมินครับ`;
    topic = 'stress';
  } else {
    replyText = "สวัสดีครับ! ผมคือผู้ช่วยดูแลพริก\nกรุณาเลือกหัวข้อที่ต้องการ หรือพิมพ์คำถามได้เลยครับ";
    topic = 'menu';
  }

  return { replyText, topic };
}

export async function POST(request: Request) {
  try {
    const body: LineWebhookBody = await request.json();
    
    // Process each event
    for (const event of body.events) {
      if (event.type !== 'message' || event.message?.type !== 'text') {
        continue;
      }

      const userId = event.source.userId;
      const userMessage = event.message.text;
      const { replyText, topic } = processMessage(userMessage, userId);

      // Track the message in stats
      trackMessage(userId, userMessage, replyText, topic);

      // Reply to LINE
      const quickReplyItems = [
        { type: "action", action: { type: "message", label: "วิธีปลูกพริก", text: "วิธีปลูกพริก" } },
        { type: "action", action: { type: "message", label: "พริกคืออะไร?", text: "พริกคืออะไร" } },
        { type: "action", action: { type: "message", label: "การดูแลรักษา", text: "การดูแลรักษา" } },
        { type: "action", action: { type: "message", label: "โรคพืช", text: "โรคพืช" } },
        { type: "action", action: { type: "message", label: "แมลงศัตรูพืช", text: "แมลงศัตรูพืช" } },
        { type: "action", action: { type: "message", label: "ประเมินความเครียด", text: "วัดความเครียด" } },
      ];

      const messages = [{
        type: 'text',
        text: replyText,
        quickReply: topic === 'menu' || topic !== 'stress' ? { items: quickReplyItems } : undefined,
      }];

      await replyToLine(event.replyToken, messages);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Verify webhook (LINE sends GET request to verify)
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'LINE Webhook endpoint ready',
    configured: !!LINE_CHANNEL_ACCESS_TOKEN && !!LINE_CHANNEL_SECRET 
  });
}
