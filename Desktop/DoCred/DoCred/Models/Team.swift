import Foundation

struct Team: Identifiable, Codable {
    var id: String
    var name: String
    var members: [String] // userIds
    var leaderboardScore: Int
}
