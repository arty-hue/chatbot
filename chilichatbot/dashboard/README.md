# 🌶️ ChiliChatBot Dashboard

Admin dashboard for the ChiliChatBot LINE Messaging API chatbot - an intelligent assistant for chili plant care.

## Features

- **📊 Real-time Statistics** - Track message counts, user activity, and topic popularity with live charts
- **💬 Message History** - View and filter all conversations between users and the bot
- **🤖 Chat Simulator** - Test the chatbot behavior directly in the dashboard
- **⚡ Stress Checker** - Evaluate plant stress levels based on voltage readings (mV)
- **📚 Content Management** - View all bot content, keywords, and response templates
- **⚙️ LINE Settings** - Configure LINE Messaging API connection

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **LINE Integration**: @line/bot-sdk
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd dashboard
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── admin/
│   │   │   ├── stats/page.tsx    # Statistics page
│   │   │   ├── messages/page.tsx # Message history
│   │   │   ├── content/page.tsx  # Content management
│   │   │   ├── simulator/page.tsx# Chat simulator
│   │   │   └── settings/page.tsx # LINE configuration
│   │   └── api/
│   │       ├── stats/route.ts    # Stats API endpoint
│   │       └── webhook/route.ts  # LINE webhook endpoint
│   ├── components/
│   │   ├── AdminSidebar.tsx      # Navigation sidebar
│   │   ├── AdminStats.tsx        # Statistics dashboard
│   │   ├── ChatSimulator.tsx     # Chat testing interface
│   │   ├── ContentCards.tsx      # Content display
│   │   ├── StressChecker.tsx     # Stress evaluation tool
│   │   └── ui/                   # shadcn/ui components
│   └── lib/
│       ├── content.ts            # Bot content & stress logic
│       ├── stats-store.ts        # In-memory stats storage
│       └── utils.ts              # Utility functions
├── package.json
└── README.md
```

## API Endpoints

### GET /api/stats
Returns current statistics including:
- Total messages and users
- Active users (last 5 minutes)
- Topic distribution
- Hourly/daily message counts
- Recent messages

### POST /api/stats
Track a new message:
```json
{
  "action": "track",
  "userId": "U123...",
  "userMessage": "วิธีปลูกพริก",
  "botResponse": "...",
  "topic": "planting"
}
```

Reset statistics:
```json
{
  "action": "reset"
}
```

### GET /api/webhook
Check webhook status and configuration.

### POST /api/webhook
LINE webhook endpoint for receiving messages. Configure this URL in LINE Developers Console.

## Connecting to LINE Bot

### Option 1: Dashboard as Standalone Webhook
Set environment variables in `.env.local`:
```env
LINE_CHANNEL_ACCESS_TOKEN=your_access_token_here
LINE_CHANNEL_SECRET=your_channel_secret_here
```

Then configure webhook URL in LINE Developers Console:
```
https://your-domain.com/api/webhook
```

### Option 2: Connect Existing Bot to Dashboard
Add to your main chatbot's `.env`:
```env
DASHBOARD_URL=http://localhost:3000
```

The chatbot will automatically send stats to the dashboard.

## Bot Topics & Keywords

| Topic | Keywords | Icon |
|-------|----------|------|
| Planting | ปลูก, วิธีปลูก | 🌱 |
| General Info | พริกคือ, ข้อมูลพริก, ประวัติ | 🌶️ |
| Care | ดูแล, น้ำ, ปุ๋ย | 💧 |
| Diseases | โรค, ใบเหี่ยว, เน่า | 🍂 |
| Pests | แมลง, เพลี้ย, หนอน | 🐛 |
| Stress Check | วัดความเครียด, ตรวจสอบความเครียด | ⚡ |

## Stress Levels

| Voltage (mV) | Status | Color |
|--------------|--------|-------|
| ≥120 | ปกติ (ไม่เครียด) | 🟢 Green |
| 100-119 | ปกติ | 🟢 Lime |
| 70-99 | เริ่มมีความเครียดเล็กน้อย | 🟡 Yellow |
| 40-69 | มีความเครียด | 🟠 Orange |
| <40 | ความเครียดสูง (วิกฤต) | 🔴 Red |

## Screenshots

### Main Dashboard
- Overview with quick stats cards
- Real-time statistics with charts
- Tools tab with stress checker and chat simulator

### Admin Pages
- `/admin/stats` - Detailed analytics
- `/admin/messages` - Conversation history with filters
- `/admin/content` - Bot content and keyword reference
- `/admin/simulator` - Test chatbot interactions
- `/admin/settings` - LINE API configuration guide

## License

MIT

## Author

ChiliChatBot Team
