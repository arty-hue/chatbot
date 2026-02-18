import { NextResponse } from 'next/server';
import { getStats, trackMessage, resetStats } from '@/lib/stats-store';

export async function GET() {
  const stats = getStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, userMessage, botResponse, topic } = body;
    
    if (action === 'track') {
      trackMessage(userId, userMessage, botResponse, topic);
      return NextResponse.json({ success: true });
    }
    
    if (action === 'reset') {
      resetStats();
      return NextResponse.json({ success: true, message: 'Stats reset' });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
