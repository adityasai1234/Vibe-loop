import SwiftUI

struct ProfileView: View {
    @StateObject private var themeManager = ThemeManager.shared
    @State private var showAchievement = false
    // Mock user and completed tasks
    let user = User(id: "demoUser1", name: "Alex Johnson", email: "alex@example.com", credibilityScore: 120, teamId: nil, badges: ["Starter", "Reliable"], role: .member)
    let completedTasks: [Task] = [
        Task(id: "task1", title: "Take out trash", details: "Take out the trash before 8pm", status: .approved, createdAt: Date().addingTimeInterval(-86400 * 2), updatedAt: nil, assignedTo: "demoUser1", reviewedBy: nil, score: 10, teamId: nil, recurrence: .none, recurrenceEndDate: nil),
        Task(id: "task2", title: "Wash dishes", details: "Wash all dishes after dinner", status: .approved, createdAt: Date().addingTimeInterval(-86400 * 1), updatedAt: nil, assignedTo: "demoUser1", reviewedBy: nil, score: 8, teamId: nil, recurrence: .none, recurrenceEndDate: nil)
    ]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Profile header
                VStack(spacing: 20) {
                    // Avatar and user info
                    VStack(spacing: 16) {
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        gradient: Gradient(colors: [
                                            themeManager.customAccentColor,
                                            themeManager.customAccentColor.opacity(0.7)
                                        ]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 80, height: 80)
                                .shadow(color: themeManager.customAccentColor.opacity(0.3), radius: 8, x: 0, y: 4)
                            
                            Text(user.name.prefix(2).uppercased())
                                .font(.system(size: 32, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                        }
                        
                        VStack(spacing: 4) {
                            Text(user.name)
                                .font(.system(size: 24, weight: .bold, design: .rounded))
                                .foregroundColor(.primary)
                            
                            Text(user.email)
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    // Stats cards
                    HStack(spacing: 16) {
                        StatCard(
                            title: "Credibility",
                            value: "\(user.credibilityScore)",
                            icon: "star.fill",
                            color: themeManager.customAccentColor
                        )
                        
                        StatCard(
                            title: "Tasks Done",
                            value: "\(completedTasks.count)",
                            icon: "checkmark.circle.fill",
                            color: .green
                        )
                        
                        StatCard(
                            title: "Badges",
                            value: "\(user.badges.count)",
                            icon: "medal.fill",
                            color: .orange
                        )
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                
                // Completed tasks section
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text("Recent Completed Tasks")
                            .font(.system(size: 22, weight: .bold, design: .rounded))
                        Spacer()
                        Button("View All") {
                            // Navigate to full history
                        }
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(themeManager.customAccentColor)
                    }
                    .padding(.horizontal, 20)
                    
                    LazyVStack(spacing: 12) {
                        ForEach(completedTasks) { task in
                            CompletedTaskCard(task: task)
                        }
                    }
                    .padding(.horizontal, 20)
                    .onAppear {
                        if completedTasks.count >= 10 {
                            showAchievement = true
                        }
                    }
                }
                
                // Badges section
                VStack(alignment: .leading, spacing: 16) {
                    Text("Your Badges")
                        .font(.system(size: 22, weight: .bold, design: .rounded))
                        .padding(.horizontal, 20)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 16) {
                            ForEach(user.badges, id: \.self) { badge in
                                BadgeCard(badgeName: badge)
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                }
            }
            .padding(.bottom, 20)
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
        .navigationTitle("Profile")
        .navigationBarTitleDisplayMode(.large)
        .sheet(isPresented: $showAchievement) {
            AchievementAnimationView(
                title: "Task Master!",
                subtitle: "You've completed 10 tasks!",
                icon: "star.fill",
                color: .yellow,
                isPresented: $showAchievement
            )
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .medium))
                .foregroundColor(color)
            
            Text(value)
                .font(.system(size: 20, weight: .bold, design: .rounded))
                .foregroundColor(.primary)
            
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.secondary)
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
}

struct CompletedTaskCard: View {
    let task: Task
    
    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(Color.green.opacity(0.2))
                .frame(width: 40, height: 40)
                .overlay(
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.green)
                )
            
            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text(task.createdAt, style: .date)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if let score = task.score {
                Text("+\(score)")
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(.yellow)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(
                        RoundedRectangle(cornerRadius: 6)
                            .fill(Color.yellow.opacity(0.15))
                    )
            }
        }
        .padding(16)
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
}

struct BadgeCard: View {
    let badgeName: String
    
    var body: some View {
        VStack(spacing: 8) {
            Circle()
                .fill(Color.orange.opacity(0.2))
                .frame(width: 50, height: 50)
                .overlay(
                    Image(systemName: "medal.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.orange)
                )
            
            Text(badgeName)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.primary)
                .multilineTextAlignment(.center)
        }
        .frame(width: 80)
        .padding(.vertical, 12)
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
}
