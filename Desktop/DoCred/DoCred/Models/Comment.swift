import Foundation

struct Comment: Identifiable, Codable {
    var id: String { userId + proofId + String(timestamp.timeIntervalSince1970) }
    var userId: String
    var proofId: String
    var text: String
    var timestamp: Date
} 