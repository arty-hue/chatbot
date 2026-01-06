# Chili Chatbot (LINE Bot)

Chatbot สำหรับแนะนำการปลูกพริก การดูแลรักษา และประเมินความเครียดพริกจากค่าความต่างศักย์

## ขั้นตอนการติดตั้งและใช้งาน

1. **ติดตั้งโปรแกรม**:
   - (คุณติดตั้ง dependencies เรียบร้อยแล้ว)

2. **ตั้งค่า LINE Project**:
   - ไปที่ [LINE Developers Console](https://developers.line.biz/)
   - สร้าง Provider และ Channel ใหม่ (ประเภท Messaging API)
   - ที่แท็บ **Messaging API**:
     - สแกน QR Code เพื่อเพิ่มเพื่อนกับบอท
     - เลื่อนลงมาล่างสุด หา **Channel Access Token** กด Issue เพื่อรับ Token
   - ที่แท็บ **Basic Settings**:
     - หา **Channel Secret**

3. **แก้ไขไฟล์ .env**:
   - เปิดไฟล์ `.env` ในโฟลเดอร์นี้
   - นำ **Channel Access Token** มาใส่ที่ `CHANNEL_ACCESS_TOKEN=`
   - นำ **Channel Secret** มาใส่ที่ `CHANNEL_SECRET=`

4. **รันโปรแกรม**:
   - เปิด Terminal แล้วพิมพ์คำสั่ง:
     ```bash
     npm start
     ```
   - ถ้าขึ้นว่า `Server is running on port 3000` แปลว่าพร้อมใช้งาน

5. **เชื่อมต่อ Webhook (สำหรับการทดสอบแบบออนไลน์)**:
   - หากรันบนเครื่องตัวเอง ต้องใช้โปรแกรมอย่าง `ngrok` เพื่อทำ Tunnel
   - รัน ngrok: `ngrok http 3000`
   - นำ URL ที่ได้ (เช่น `https://xxxx.ngrok-free.app`) ไปใส่ใน Webhook URL ของ LINE Developers Console และเติม `/callback` ต่อท้าย
     - ตัวอย่าง: `https://xxxx.ngrok-free.app/callback`
   - กด Verify เพื่อทดสอบ

## การใช้งาน Chatbot

- **พิมพ์คำถามทั่วไป**: "วิธีปลูก", "การดูแล", "โรคพืช", "แมลง"
- **เมนูหลัก**: พิมพ์อะไรก็ได้ที่ไม่เข้าใจ ระบบจะส่งเมนูให้เลือก
- **ประเมินความเครียด**: พิมพ์ตัวเลขค่าความต่างศักย์ (เช่น `50`, `120`) ระบบจะวิเคราะห์ให้ทันที

---
**ขอให้สนุกกับการปลูกพริกครับ!** 🌶️
