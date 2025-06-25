import Foundation

struct FairnessVote: Identifiable, Codable {
    var id: String { choreId + userId }
    var choreId: String
    var userId: String
    var vote: Bool // true = reassign, false = keep
    var reason: String?
} 