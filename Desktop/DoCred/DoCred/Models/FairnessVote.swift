import Foundation

struct FairnessVote: Identifiable, Codable {
    var id: UUID = UUID()
    var choreId: String
    var vote: Bool //true = reassign, false = keep
    var reason: String?
} 