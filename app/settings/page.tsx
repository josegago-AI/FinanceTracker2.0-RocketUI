export const metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </header>

      <div className="space-y-6">
        {/* Profile Settings */}
        <section className="bg-card border border-border shadow-elevation-1 rounded-lg transition-all hover:shadow-elevation-2">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border-2 border-border rounded-lg bg-background text-foreground px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full border-2 border-border rounded-lg bg-background text-foreground px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-card border border-border shadow-elevation-1 rounded-lg transition-all hover:shadow-elevation-2">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
            <div className="space-y-4">
              {/* Currency */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Currency
                  </label>
                  <p className="text-sm text-muted-foreground/80">
                    Choose your preferred currency
                  </p>
                </div>
                <select className="border-2 border-border rounded-lg bg-background text-foreground px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring transition-all duration-200">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Theme
                  </label>
                  <p className="text-sm text-muted-foreground/80">
                    Choose your preferred theme
                  </p>
                </div>
                <select className="border-2 border-border rounded-lg bg-background text-foreground px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring transition-all duration-200">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground font-medium py-2 px-4 rounded-lg hover:brightness-110 active:scale-[0.98] focus:ring-2 focus:ring-ring transition-all duration-200">
            Save Changes
          </button>
        </div>
      </div>
    </main>
  )
}
