import { AdminSidebar, MobileSidebar } from "@/components/AdminSidebar";
import ContentCards from "@/components/ContentCards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContentPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <MobileSidebar />
              <span className="text-4xl lg:hidden">🌶️</span>
              <div>
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  จัดการเนื้อหา
                </h1>
                <p className="text-sm text-muted-foreground">
                  ดูและจัดการเนื้อหาที่แชทบอทใช้ตอบ
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 space-y-6">
          {/* Content Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <span className="text-3xl">🌱</span>
                <p className="text-2xl font-bold mt-2">1</p>
                <p className="text-sm text-muted-foreground">วิธีปลูก</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <span className="text-3xl">🌶️</span>
                <p className="text-2xl font-bold mt-2">1</p>
                <p className="text-sm text-muted-foreground">ข้อมูลทั่วไป</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <span className="text-3xl">💧</span>
                <p className="text-2xl font-bold mt-2">1</p>
                <p className="text-sm text-muted-foreground">การดูแล</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <span className="text-3xl">🍂</span>
                <p className="text-2xl font-bold mt-2">4</p>
                <p className="text-sm text-muted-foreground">โรคพืช</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <span className="text-3xl">🐛</span>
                <p className="text-2xl font-bold mt-2">4</p>
                <p className="text-sm text-muted-foreground">แมลงศัตรูพืช</p>
              </CardContent>
            </Card>
          </div>

          {/* Keywords Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                คำสำคัญที่บอทจะตอบ
              </CardTitle>
              <CardDescription>
                เมื่อผู้ใช้พิมพ์ข้อความที่มีคำเหล่านี้ บอทจะตอบด้วยเนื้อหาที่เกี่ยวข้อง
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span>🌱</span> วิธีปลูก
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">ปลูก</Badge>
                    <Badge variant="secondary">วิธีปลูก</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span>🌶️</span> ข้อมูลทั่วไป
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">พริกคือ</Badge>
                    <Badge variant="secondary">ข้อมูลพริก</Badge>
                    <Badge variant="secondary">ประวัติ</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span>💧</span> การดูแล
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">ดูแล</Badge>
                    <Badge variant="secondary">น้ำ</Badge>
                    <Badge variant="secondary">ปุ๋ย</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span>🍂</span> โรคพืช
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">โรค</Badge>
                    <Badge variant="secondary">ใบเหี่ยว</Badge>
                    <Badge variant="secondary">เน่า</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span>🐛</span> แมลงศัตรูพืช
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">แมลง</Badge>
                    <Badge variant="secondary">เพลี้ย</Badge>
                    <Badge variant="secondary">หนอน</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span>⚡</span> ประเมินความเครียด
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">วัดความเครียด</Badge>
                    <Badge variant="secondary">ตรวจสอบความเครียด</Badge>
                    <Badge variant="secondary">ประเมินความเครียด</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Preview */}
          <ContentCards />

          {/* Stress Levels Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                ระดับความเครียดที่ประเมินได้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="font-medium">≥120 mV</span>
                  <span className="text-muted-foreground">ปกติ (ไม่เครียด)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-lime-100 dark:bg-lime-900/30">
                  <div className="w-4 h-4 rounded-full bg-lime-500"></div>
                  <span className="font-medium">100-119 mV</span>
                  <span className="text-muted-foreground">ปกติ</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="font-medium">70-99 mV</span>
                  <span className="text-muted-foreground">เริ่มมีความเครียดเล็กน้อย</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="font-medium">40-69 mV</span>
                  <span className="text-muted-foreground">มีความเครียด</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="font-medium">&lt;40 mV</span>
                  <span className="text-muted-foreground">ความเครียดสูง (วิกฤต)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
