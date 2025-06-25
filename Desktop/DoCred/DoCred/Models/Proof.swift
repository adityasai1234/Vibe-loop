import Foundation

enum ProofType: String, Codable {
    case photo, file, link, note
}

struct Proof: Identifiable, Codable {
    var id: String
    var type: ProofType
    var url: String?
    var notes: String?
    var timestamp: Date
    var status: TaskStatus
    var reviewer: String?
} 