import { NextResponse } from 'next/server';
import * as line from '@line/bot-sdk';
import { trackMessage } from '@/lib/stats-store';
import { content, checkStress } from '@/lib/content';

// In-memory session state for stress checking
const sessions: Map<string, string> = new Map();

// LINE SDK configuration from environment variables
const config: line.ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};

const middlewareConfig: line.MiddlewareConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

// Create LINE client
const client = new line.messagingApi.MessagingApiClient(config);

// Quick reply items for menu
const quickReplyItems: line.QuickReplyItem[] = [
  { type: "action", action: { type: "message", label: "วิธีปลูกพริก", text: "วิธีปลูกพริก" } },
  { type: "action", action: { type: "message", label: "พริกคืออะไร?", text: "พริกคืออะไร" } },
  { type: "action", action: { type: "message", label: "การดูแลรักษา", text: "การดูแลรักษา" } },
  { type: "action", action: { type: "message", label: "โรคพืช", text: "โรคพืช" } },
  { type: "action", action: { type: "message", label: "แมลงศัตรูพืช", text: "แมลงศัตรูพืช" } },
  { type: "action", action: { type: "message", label: "ประเมินความเครียด", text: "วัดความเครียด" } },
];

function processMessage(userText: string, userId: string): { replyText: string; topic: string } {
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

// Handle LINE webhook event
async function handleEvent(event: line.WebhookEvent): Promise<void> {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const userId = event.source.userId || 'unknown';
  const userMessage = event.message.text;
  const { replyText, topic } = processMessage(userMessage, userId);

  // Track the message in stats
  trackMessage(userId, userMessage, replyText, topic);

  // Build reply message with LINE SDK types
  const replyMessage: line.TextMessage = {
    type: 'text',
    text: replyText,
    quickReply: topic !== 'stress' ? { items: quickReplyItems } : undefined,
  };

  // Reply using LINE SDK client
  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [replyMessage],
  });
}

// Verify signature using LINE SDK
async function verifySignature(body: string, signature: string): Promise<boolean> {
  try {
    return line.validateSignature(body, middlewareConfig.channelSecret, signature);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-line-signature') || '';

    // Verify signature
    if (middlewareConfig.channelSecret && !await verifySignature(rawBody, signature)) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as { events: line.WebhookEvent[] };

    // Process all events
    await Promise.all(body.events.map(handleEvent));

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
    message: 'LINE Webhook endpoint ready (using @line/bot-sdk)',
    configured: !!config.channelAccessToken && !!middlewareConfig.channelSecret 
  });
}
