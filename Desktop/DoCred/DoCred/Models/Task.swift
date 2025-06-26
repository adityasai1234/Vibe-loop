import Foundation

struct Task: Identifiable, Codable {
    var id: String
    var title: String
    var description: String
    var status: TaskStatus
    var proof: [Proof]
    var createdAt: Date
    var updatedAt: Date?
    var assignedTo: String // userId
    var reviewedBy: String? // userId
    var score: Int?
    var teamId: String?
}

enum TaskStatus: String, Codable {
    case pending, reviewed, approved
}