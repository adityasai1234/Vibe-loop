import Foundation

struct Reaction: Identifiable, Codable {
    var id: String { userId + proofId }
    var userId: String
    var proofId: String
    var emoji: String // e.g., "👍"
}