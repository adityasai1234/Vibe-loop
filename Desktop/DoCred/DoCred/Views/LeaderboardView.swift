import SwiftUI

struct LeaderboardView: View {
    @StateObject private var themeManager = ThemeManager.shared
    @State private var selectedTimeframe: Timeframe = .week
    
    let users: [User] = [
        User(id: "user1", name: "Alex Johnson", email: "alex@example.com", credibilityScore: 120, teamId: nil, badges: ["Starter", "Reliable"], role: .member),
        User(id: "user2", name: "Sarah Chen", email: "sarah@example.com", credibilityScore: 95, teamId: nil, badges: ["Starter"], role: .member),
        User(id: "user3", name: "Mike Rodriguez", email: "mike@example.com", credibilityScore: 87, teamId: nil, badges: ["Starter"], role: .member),
        User(id: "user4", name: "Emma Wilson", email: "emma@example.com", credibilityScore: 76, teamId: nil, badges: ["Starter"], role: .member),
        User(id: "user5", name: "David Kim", email: "david@example.com", credibilityScore: 65, teamId: nil, badges: ["Starter"], role: .member)
    ]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header section
                VStack(spacing: 16) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Leaderboard")
                                .font(.system(size: 28, weight: .bold, design: .rounded))
                                .foregroundColor(.primary)
                            
                            Text("Top performers this \(selectedTimeframe.rawValue)")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                    }
                    
                    // Timeframe selector
                    HStack(spacing: 8) {
                        ForEach(Timeframe.allCases, id: \.self) { timeframe in
                            TimeframeButton(
                                timeframe: timeframe,
                                isSelected: selectedTimeframe == timeframe
                            ) {
                                withAnimation(.easeInOut(duration: 0.2)) {
                                    selectedTimeframe = timeframe
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                
                // Top 3 podium
                VStack(spacing: 16) {
                    Text("Top 3")
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .padding(.horizontal, 20)
                    
                    HStack(alignment: .bottom, spacing: 12) {
                        // 2nd place
                        if users.count > 1 {
                            PodiumCard(
                                user: users[1],
                                rank: 2,
                                color: .gray,
                                height: 120
                            )
                        }
                        
                        // 1st place
                        if users.count > 0 {
                            PodiumCard(
                                user: users[0],
                                rank: 1,
                                color: .yellow,
                                height: 140
                            )
                        }
                        
                        // 3rd place
                        if users.count > 2 {
                            PodiumCard(
                                user: users[2],
                                rank: 3,
                                color: .orange,
                                height: 100
                            )
                        }
                    }
                    .padding(.horizontal, 20)
                }
                
                // Full leaderboard
                VStack(alignment: .leading, spacing: 16) {
                    Text("All Rankings")
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .padding(.horizontal, 20)
                    
                    LazyVStack(spacing: 12) {
                        ForEach(Array(users.enumerated()), id: \.element.id) { index, user in
                            LeaderboardRow(
                                user: user,
                                rank: index + 1,
                                isTopThree: index < 3
                            )
                        }
                    }
                    .padding(.horizontal, 20)
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
        .navigationTitle("Leaderboard")
        .navigationBarTitleDisplayMode(.large)
    }
}

struct PodiumCard: View {
    let user: User
    let rank: Int
    let color: Color
    let height: CGFloat
    
    var body: some View {
        VStack(spacing: 8) {
            // Rank badge
            ZStack {
                Circle()
                    .fill(color.opacity(0.2))
                    .frame(width: 40, height: 40)
                
                Text("\(rank)")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(color)
            }
            
            // User avatar
            Circle()
                .fill(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            color,
                            color.opacity(0.7)
                        ]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 50, height: 50)
                .overlay(
                    Text(user.name.prefix(2).uppercased())
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                )
                .shadow(color: color.opacity(0.3), radius: 4, x: 0, y: 2)
            
            // User name
            Text(user.name)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.primary)
                .lineLimit(1)
            
            // Score
            Text("\(user.credibilityScore)")
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundColor(color)
        }
        .frame(width: 80, height: height)
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

struct LeaderboardRow: View {
    let user: User
    let rank: Int
    let isTopThree: Bool
    
    var body: some View {
        HStack(spacing: 16) {
            // Rank
            ZStack {
                Circle()
                    .fill(rankColor.opacity(0.2))
                    .frame(width: 36, height: 36)
                
                Text("\(rank)")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(rankColor)
            }
            
            // User avatar
            Circle()
                .fill(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            Color.blue,
                            Color.blue.opacity(0.7)
                        ]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 40, height: 40)
                .overlay(
                    Text(user.name.prefix(2).uppercased())
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                )
            
            // User info
            VStack(alignment: .leading, spacing: 2) {
                Text(user.name)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text("\(user.badges.count) badges")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            // Score
            VStack(alignment: .trailing, spacing: 2) {
                Text("\(user.credibilityScore)")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(rankColor)
                
                Text("Cred")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(.secondary)
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
                        .stroke(isTopThree ? rankColor.opacity(0.3) : Color(.systemGray5), lineWidth: isTopThree ? 1.5 : 0.5)
                )
        )
    }
    
    var rankColor: Color {
        switch rank {
        case 1: return .yellow
        case 2: return .gray
        case 3: return .orange
        default: return .blue
        }
    }
}

struct TimeframeButton: View {
    let timeframe: Timeframe
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: {
            HapticManager.shared.lightImpact()
            action()
        }) {
            Text(timeframe.rawValue.capitalized)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(isSelected ? .white : .primary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(isSelected ? Color.blue : Color(.systemGray6))
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

enum Timeframe: String, CaseIterable {
    case week = "week"
    case month = "month"
    case year = "year"
}
