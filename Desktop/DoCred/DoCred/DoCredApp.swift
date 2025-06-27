import SwiftUI
import SwiftData

@main
struct DoCredApp: App {
    @StateObject private var themeManager = ThemeManager.shared
    @State private var showWelcome = true
    
    var body: some Scene {
        WindowGroup {
            if showWelcome {
                WelcomeScreen(onContinue: { showWelcome = false })
                    .environmentObject(themeManager)
            } else {
                ContentView()
                    .environmentObject(themeManager)
                    .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
                    .accentColor(themeManager.customAccentColor)
            }
        }
    }
}

struct MainTabView: View {
    @StateObject private var themeManager = ThemeManager.shared
    @State private var selectedTab = 0
    @State private var showTaskCreation = false
    @State private var showExport = false
    @State private var showBadges = false
    @State private var showResubmit = false
    @State private var showMultiProof = false
    @State private var showFABProof = false
    @State private var showSettings = false
    
    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationView {
                ZStack(alignment: .topTrailing) {
                    DashboardView()
                    VStack {
                        HStack(spacing: 12) {
                            // Day/Night toggle button
                            Button(action: {
                                withAnimation(.spring()) {
                                    themeManager.toggleDarkMode()
                                    HapticManager.shared.mediumImpact()
                                }
                            }) {
                                Image(systemName: themeManager.isDarkMode ? "moon.fill" : "sun.max.fill")
                                    .font(.system(size: 28))
                                    .foregroundColor(themeManager.isDarkMode ? .yellow : .orange)
                                    .rotationEffect(.degrees(themeManager.isDarkMode ? 20 : 0))
                                    .scaleEffect(themeManager.isDarkMode ? 1.1 : 1.0)
                                    .shadow(radius: 2)
                                    .padding(.top, 8)
                            }
                            .accessibilityLabel(themeManager.isDarkMode ? "Switch to Day Mode" : "Switch to Night Mode")
                            // Menu button
                            Menu {
                                Button("Create Task") { 
                                    HapticManager.shared.mediumImpact()
                                    showTaskCreation = true 
                                }
                                Button("Export Data") { 
                                    HapticManager.shared.mediumImpact()
                                    showExport = true 
                                }
                                Button("View Badges") { 
                                    HapticManager.shared.mediumImpact()
                                    showBadges = true 
                                }
                                Button("Settings") { 
                                    HapticManager.shared.mediumImpact()
                                    showSettings = true 
                                }
                            } label: {
                                Image(systemName: "ellipsis.circle")
                                    .font(.title2)
                                    .foregroundColor(themeManager.customAccentColor)
                                    .padding(.top, 8)
                            }
                        }
                        .padding(.trailing, 8)
                        Spacer()
                    }
                    // Floating Action Button (FAB)
                    VStack {
                        Spacer()
                        HStack {
                            Spacer()
                            Button(action: {
                                HapticManager.shared.heavyImpact()
                                withAnimation(.spring()) {
                                    showFABProof = true
                                }
                            }) {
                                Image(systemName: "plus.circle.fill")
                                    .font(.system(size: 56))
                                    .foregroundColor(themeManager.customAccentColor)
                                    .shadow(radius: 6)
                                    .scaleEffect(showFABProof ? 1.15 : 1.0)
                                    .padding(.bottom, 24)
                                    .padding(.trailing, 24)
                            }
                            .accessibilityLabel("Submit Proof")
                        }
                    }
                }
                .sheet(isPresented: $showTaskCreation) {
                    NavigationView { TaskCreationView() }
                }
                .sheet(isPresented: $showExport) {
                    NavigationView { ExportModalView() }
                }
                .sheet(isPresented: $showBadges) {
                    NavigationView { BadgeViewerView() }
                }
                .sheet(isPresented: $showFABProof) {
                    NavigationView { UploadProofView() }
                }
                .sheet(isPresented: $showSettings) {
                    SettingsView()
                }
            }
            .tabItem {
                Image(systemName: selectedTab == 0 ? "house.fill" : "house")
                Text("Home")
            }
            .tag(0)
            .onTapGesture {
                if selectedTab == 0 {
                    HapticManager.shared.lightImpact()
                }
            }

            NavigationView { FullCalendarView() }
                .tabItem {
                    Image(systemName: selectedTab == 1 ? "calendar" : "calendar")
                    Text("Calendar")
                }
                .tag(1)

            NavigationView { LeaderboardView() }
                .tabItem {
                    Image(systemName: selectedTab == 2 ? "trophy.fill" : "trophy")
                    Text("Leaderboard")
                }
                .tag(2)

            NavigationView {
                SelectTaskView()
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Menu {
                                Button("Submit Proof") { 
                                    HapticManager.shared.mediumImpact()
                                }
                                Button("Resubmit/Appeal") { 
                                    HapticManager.shared.mediumImpact()
                                    showResubmit = true 
                                }
                                Button("Upload Multiple Proofs") { 
                                    HapticManager.shared.mediumImpact()
                                    showMultiProof = true 
                                }
                            } label: {
                                Image(systemName: "ellipsis.circle")
                                    .foregroundColor(themeManager.customAccentColor)
                            }
                        }
                    }
            }
            .sheet(isPresented: $showResubmit) {
                NavigationView { ResubmitAppealView() }
            }
            .sheet(isPresented: $showMultiProof) {
                NavigationView { UploadProofView() }
            }
            .tabItem {
                Image(systemName: selectedTab == 3 ? "plus.circle.fill" : "plus.circle")
                Text("Submit")
            }
            .tag(3)

            NavigationView { HistoryView() }
                .tabItem {
                    Image(systemName: selectedTab == 4 ? "clock.fill" : "clock")
                    Text("History")
                }
                .tag(4)

            NavigationView { ProfileView() }
                .tabItem {
                    Image(systemName: selectedTab == 5 ? "person.crop.circle.fill" : "person.crop.circle")
                    Text("Profile")
                }
                .tag(5)
        }
        .onChange(of: selectedTab) { oldValue, newValue in
            HapticManager.shared.lightImpact()
        }
    }
}
