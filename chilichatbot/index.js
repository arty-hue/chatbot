require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const { content, checkStress } = require('./content');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();

// In-memory session store
const sessions = {};

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

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const userText = event.message.text.trim();
    const userId = event.source.userId;
    let replyText = '';
    let replyMessages = [];

    // Check session state
    if (sessions[userId] === 'WAITING_FOR_MV') {
        const stressLevel = checkStress(userText);
        if (stressLevel) {
            replyText = `📊 **ผลการประเมินความเครียดพริก**\n\n` +
                `ค่าความต่างศักย์: ${userText} mV\n` +
                `สถานะ: ${stressLevel.status}\n\n` +
                `${stressLevel.advice}`;
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

    const client = new line.Client(config);
    return client.replyMessage(event.replyToken, replyMessages);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
