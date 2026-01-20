export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-lg font-semibold">SRAS</h1>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Navigation placeholder
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-between">
            <div className="text-sm font-medium">Dashboard</div>
            <div className="text-sm text-muted-foreground">
              Header placeholder
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
