import Foundation

enum ProofType: String, Codable {
    case photo, file, link, note
}

enum ProofTemplateType: String, Codable, CaseIterable {
    case photo
    case checklist
    case note
}

struct ProofChecklistItem: Codable, Identifiable {
    var id: UUID = UUID()
    var text: String
    var isChecked: Bool
}

struct ProofTemplate: Codable, Identifiable {
    var id: UUID = UUID()
    var type: ProofTemplateType
    var checklistItems: [ProofChecklistItem]? // for checklist
    var note: String? // for note
    // For photo, no extra fields needed
}

struct Proof: Identifiable, Codable {
    var id: String
    var type: ProofType
    var url: String?
    var notes: String?
    var timestamp: Date
    var status: TaskStatus
    var reviewer: String?
    // --- Added for templates ---
    var templateType: ProofTemplateType?
    var checklist: [ProofChecklistItem]?
    // --- End ---
} 