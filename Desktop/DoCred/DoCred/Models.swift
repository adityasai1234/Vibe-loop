import SwiftUI

struct Chore: Identifiable {
    let id = UUID()
    let title: String
    let description: String?
    let points: Int
    var isCompleted: Bool = false
    var proofImage: UIImage? = nil
    let dueDate: Date?
    
    static let mockChores: [Chore] = [
        Chore(title: "Clean Dishes", description: nil, points: 50, dueDate: Date().addingTimeInterval(3600)),
        Chore(title: "Sweep Floor", description: nil, points: 40, dueDate: Date().addingTimeInterval(7200)),
        Chore(title: "Take Out Trash", description: nil, points: 30, dueDate: Date().addingTimeInterval(10800))
    ]
}

struct LeaderboardUser: Identifiable {
    let id = UUID()
    let name: String
    let points: Int
    
    static let mockWeekly: [LeaderboardUser] = [
        LeaderboardUser(name: "User Demo 1", points: 350),
        LeaderboardUser(name: "User Demo 2", points: 300),
        LeaderboardUser(name: "User Demo 3", points: 240)
    ]
}

struct Reward: Identifiable {
    let id = UUID()
    let title: String
    let points: Int
    let type: RewardType
    let icon: String // Emoji or SF Symbol name
    
    enum RewardType { case group, individual }
    
    static let mockRewards: [Reward] = [
        Reward(title: "Pizza Night", points: 500, type: .group, icon: "🍕"),
        Reward(title: "Skip a Chore", points: 200, type: .individual, icon: "⏭️"),
        Reward(title: "Movie Pick", points: 300, type: .group, icon: "🎬")
    ]
}

struct UserProfile {
    var nickname: String
    var avatar: String
    var streak: Int
    var totalPoints: Int
    var badges: [String]
    var completedChores: [Chore]
    var profileImage: UIImage? = nil
    
    static let mock = UserProfile(
        nickname: "You",
        avatar: "😎",
        streak: 3,
        totalPoints: 250,
        badges: ["Dish Destroyer", "Streak Starter"],
        completedChores: [Chore.mockChores[0]],
        profileImage: nil
    )
} 