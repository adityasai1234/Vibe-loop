import SwiftUI

struct DashboardView: View {
    @StateObject var viewModel = DashboardViewModel()
    @EnvironmentObject private var themeManager: ThemeManager
    @State private var showMiniGame = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header section
                VStack(alignment: .leading, spacing: 16) {
                    if let user = viewModel.user {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Hello, \(user.name)")
                                .font(.system(size: 28, weight: .bold, design: .rounded))
                                .foregroundColor(.primary)
                            
                            Text("Ready to tackle today's tasks?")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                    // Progress indicator
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Today's Progress")
                                .font(.system(size: 18, weight: .semibold))
                            Spacer()
                            Text("\(viewModel.tasks.filter { $0.status == .approved }.count)/\(viewModel.tasks.count)")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                        ProgressView(value: Double(viewModel.tasks.filter { $0.status == .approved }.count), total: Double(max(viewModel.tasks.count, 1)))
                            .progressViewStyle(LinearProgressViewStyle(tint: themeManager.customAccentColor))
                            .scaleEffect(x: 1, y: 2, anchor: .center)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                // Tasks section
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text("Your Tasks")
                            .font(.system(size: 22, weight: .bold, design: .rounded))
                        Spacer()
                        Button("View All") {
                        }
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(themeManager.customAccentColor)
                    }
                    .padding(.horizontal, 20)
                    LazyVStack(spacing: 12) {
                        ForEach(viewModel.tasks) { task in
                            NavigationLink(destination: TaskDetailView(task: task)) {
                                TaskCardView(task: task)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.horizontal, 20)
                }
                VStack(alignment: .leading, spacing: 16) {
                    Text("Quick Actions")
                        .font(.system(size: 22, weight: .bold, design: .rounded))
                        .padding(.horizontal, 20)
                    HStack(spacing: 12) {
                        QuickActionButton(
                            title: "Submit Proof",
                            icon: "plus.circle.fill",
                            color: themeManager.customAccentColor
                        ) {
                            // Handle submit proof
                        }
                        QuickActionButton(
                            title: "View History",
                            icon: "clock.fill",
                            color: .blue
                        ) {
                            // Navigate to history
                        }
                        QuickActionButton(
                            title: "Leaderboard",
                            icon: "trophy.fill",
                            color: .orange
                        ) {
                            // Navigate to leaderboard
                        }
                        QuickActionButton(
                            title: "Mini-Game",
                            icon: "gamecontroller.fill",
                            color: .purple
                        ) {
                            showMiniGame = true
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
            .padding(.bottom, 100) // Space for FAB
        }
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(.systemBackground),
                    Color(.systemGray6).opacity(0.3)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .navigationTitle("Dashboard")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {
                    withAnimation(.spring()) {
                        themeManager.toggleDarkMode()
                        HapticManager.shared.mediumImpact()
                    }
                }) {
                    Image(systemName: themeManager.isDarkMode ? "moon.fill" : "sun.max.fill")
                        .font(.system(size: 22))
                        .foregroundColor(themeManager.isDarkMode ? .yellow : .orange)
                        .rotationEffect(.degrees(themeManager.isDarkMode ? 20 : 0))
                        .scaleEffect(themeManager.isDarkMode ? 1.1 : 1.0)
                        .shadow(radius: 2)
                }
                .accessibilityLabel(themeManager.isDarkMode ? "Switch to Day Mode" : "Switch to Night Mode")
            }
        }
        .onAppear {
            viewModel.loadDashboard(userId: "demoUserId")
        }
        .sheet(isPresented: $showMiniGame) {
            MiniGameView(users: ["Alice", "Bob", "Charlie", "Dana"])
        }
    }
}

struct QuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: {
            HapticManager.shared.mediumImpact()
            action()
        }) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 24, weight: .medium))
                    .foregroundColor(color)
                
                Text(title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(.systemBackground))
                    .shadow(
                        color: Color.black.opacity(0.05),
                        radius: 4,
                        x: 0,
                        y: 2
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(.systemGray5), lineWidth: 0.5)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}
