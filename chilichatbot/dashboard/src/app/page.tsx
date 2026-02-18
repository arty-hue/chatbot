import StressChecker from "@/components/StressChecker";
import ContentCards from "@/components/ContentCards";
import ChatSimulator from "@/components/ChatSimulator";
import AdminStats from "@/components/AdminStats";
import { AdminSidebar, MobileSidebar } from "@/components/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <MobileSidebar />
              <span className="text-4xl lg:hidden">🌶️</span>
              <div>
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  ระบบจัดการแชทบอทผู้ช่วยดูแลพริก
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
              <TabsTrigger value="stats">สถิติ</TabsTrigger>
              <TabsTrigger value="tools">เครื่องมือ</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-2xl">
                      🌱
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">5</p>
                      <p className="text-sm text-muted-foreground">สายพันธุ์พริก</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-2xl">
                      🍂
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">4</p>
                      <p className="text-sm text-muted-foreground">โรคที่ระบุได้</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-2xl">
                      🐛
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">4</p>
                      <p className="text-sm text-muted-foreground">แมลงศัตรูพืช</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl">
                      ⚡
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">5</p>
                      <p className="text-sm text-muted-foreground">ระดับความเครียด</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Admin Stats */}
              <AdminStats />
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <AdminStats />
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StressChecker />
                <ChatSimulator />
              </div>
              <ContentCards />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              🌶️ ChiliChatBot Admin - ระบบจัดการแชทบอทผู้ช่วยดูแลพริก
            </p>
            <p className="mt-1">
              เชื่อมต่อกับ LINE Messaging API | พัฒนาด้วย Next.js + shadcn/ui
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
