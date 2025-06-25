import Foundation

enum UserRole: String, Codable {
    case admin, reviewer, member
}

struct User: Identifiable, Codable {
    var id: String
    var name: String
    var email: String
    var credibilityScore: Int
    var teamId: String?
    var badges: [String]
    var role: UserRole
} 