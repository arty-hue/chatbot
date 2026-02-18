require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const { content, checkStress } = require('./content');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

// Dashboard URL for stats tracking (optional)
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'http://localhost:3001';

const app = express();

// In-memory session store
const sessions = {};

// Function to send stats to dashboard
async function trackStats(userId, userMessage, botResponse, topic) {
    try {
        await fetch(`${DASHBOARD_URL}/api/stats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'track',
                userId,
                userMessage,
                botResponse: botResponse.substring(0, 200),
                topic
            })
        });
    } catch (error) {
        // Silent fail - dashboard might not be running
        console.log('Dashboard stats tracking skipped');
    }
}

// Function to determine topic from message
function getTopic(userText, wasWaitingForMv) {
    if (wasWaitingForMv) return 'stress';
    if (userText.includes('วัดความเครียด') || userText.includes('ตรวจสอบความเครียด') || userText.includes('ประเมินความเครียด')) return 'stress';
    if (userText.includes('ปลูก') || userText.includes('วิธีปลูก')) return 'planting';
    if (userText.includes('พริกคือ') || userText.includes('ข้อมูลพริก') || userText.includes('ประวัติ')) return 'general';
    if (userText.includes('ดูแล') || userText.includes('น้ำ') || userText.includes('ปุ๋ย')) return 'care';
    if (userText.includes('โรค') || userText.includes('ใบเหี่ยว') || userText.includes('เน่า')) return 'diseases';
    if (userText.includes('แมลง') || userText.includes('เพลี้ย') || userText.includes('หนอน')) return 'pests';
    if (userText.includes('เครียด') || userText.includes('วัดค่า')) return 'stress';
    return 'menu';
}

app.post('/callback', line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// Simple test route
app.get('/', (req, res) => {
    res.send('LINE Chatbot Server is running!');
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const userText = event.message.text.trim();
    const userId = event.source.userId;
    let replyText = '';
    let replyMessages = [];
    let topic = 'menu';
    const wasWaitingForMv = sessions[userId] === 'WAITING_FOR_MV';

    // Check session state
    if (wasWaitingForMv) {
        const stressLevel = checkStress(userText);
        if (stressLevel) {
            replyText = `📊 **ผลการประเมินความเครียดพริก**\n\n` +
                `ค่าความต่างศักย์: ${userText} mV\n` +
                `สถานะ: ${stressLevel.status}\n\n` +
                `${stressLevel.advice}`;
            topic = 'stress';
            delete sessions[userId]; // Clear session
        } else {
            // If input is not a valid number, check if they want to cancel or switch topic
            if (isNaN(parseFloat(userText))) {
                // Not a number, fall through to normal keywords (effectively cancelling)
                delete sessions[userId];
            } else {
                // It is a number but checkStress returned null? (unlikely given checkStress logic)
                // Just proceed to normal logic
            }
        }
    }

    if (!replyText) {
        topic = getTopic(userText, wasWaitingForMv);
        if (userText.includes('วัดความเครียด') || userText.includes('ตรวจสอบความเครียด') || userText.includes('ประเมินความเครียด')) {
            sessions[userId] = 'WAITING_FOR_MV';
            replyText = content.stressPrompt;
        } else if (userText.includes('ปลูก') || userText.includes('วิธีปลูก')) {
            replyText = content.planting;
        } else if (userText.includes('พริกคือ') || userText.includes('ข้อมูลพริก') || userText.includes('ประวัติ')) {
            replyText = content.general;
        } else if (userText.includes('ดูแล') || userText.includes('น้ำ') || userText.includes('ปุ๋ย')) {
            replyText = content.care;
        } else if (userText.includes('โรค') || userText.includes('ใบเหี่ยว') || userText.includes('เน่า')) {
            replyText = content.diseases;
        } else if (userText.includes('แมลง') || userText.includes('เพลี้ย') || userText.includes('หนอน')) {
            replyText = content.pests;
        } else if (userText.includes('เครียด') || userText.includes('วัดค่า')) {
            // Recommendation to use the proper command
            replyText = `⚡ **ระบบประเมินความเครียดของพริก**\n\n` +
                `พิมพ์คำว่า "วัดความเครียด" หรือ "ตรวจสอบความเครียด" เพื่อเริ่มใช้งานระบบประเมินครับ`;
        } else {
            // Default Menu
            replyMessages = [
                {
                    type: "text",
                    text: "สวัสดีครับ! ผมคือผู้ช่วยดูแลพริก\nกรุณาเลือกหัวข้อที่ต้องการ หรือพิมพ์คำถามได้เลยครับ\n(หรือพิมพ์ตัวเลขค่าความต่างศักย์ เพื่อประเมินความเครียด)",
                    quickReply: {
                        items: [
                            {
                                type: "action",
                                action: {
                                    type: "message",
                                    label: "วิธีปลูกพริก",
                                    text: "วิธีปลูกพริก"
                                }
                            },
                            {
                                type: "action",
                                action: {
                                    type: "message",
                                    label: "พริกคืออะไร?",
                                    text: "พริกคืออะไร"
                                }
                            },
                            {
                                type: "action",
                                action: {
                                    type: "message",
                                    label: "การดูแลรักษา",
                                    text: "การดูแลรักษา"
                                }
                            },
                            {
                                type: "action",
                                action: {
                                    type: "message",
                                    label: "โรคพืช",
                                    text: "โรคพืช"
                                }
                            },
                            {
                                type: "action",
                                action: {
                                    type: "message",
                                    label: "แมลงศัตรูพืช",
                                    text: "แมลงศัตรูพืช"
                                }
                            },
                            {
                                type: "action",
                                action: {
                                    type: "message",
                                    label: "ประเมินความเครียด",
                                    text: "วัดความเครียด"
                                }
                            }
                        ]
                    }
                }
            ];
        }
    }

    if (replyText) {
        replyMessages = [{ type: 'text', text: replyText }];
    }

    // Track stats to dashboard
    const responseText = replyText || replyMessages[0]?.text || '';
    trackStats(userId, userText, responseText, topic);

    const client = new line.Client(config);
    return client.replyMessage(event.replyToken, replyMessages);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
