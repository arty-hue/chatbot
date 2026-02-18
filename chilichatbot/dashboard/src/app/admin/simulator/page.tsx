import { AdminSidebar, MobileSidebar } from "@/components/AdminSidebar";
import ChatSimulator from "@/components/ChatSimulator";
import StressChecker from "@/components/StressChecker";

export default function SimulatorPage() {
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
                  ทดสอบแชทบอท
                </h1>
                <p className="text-sm text-muted-foreground">
                  จำลองการสนทนาและทดสอบฟีเจอร์ต่างๆ
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChatSimulator />
            <StressChecker />
          </div>
        </main>
      </div>
    </div>
  );
}
