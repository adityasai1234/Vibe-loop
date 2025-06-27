import Foundation
import Combine

class ProofInteractionViewModel: ObservableObject {
    @Published var reactions: [Reaction] = []
    @Published var comments: [Comment] = []
    let proofId: String
    let userId: String

    let availableEmojis = ["👍", "😂", "😍", "👎"]

    init(proofId: String, userId: String) {
        self.proofId = proofId
        self.userId = userId
    }

    func toggleReaction(emoji: String) {
        if let idx = reactions.firstIndex(where: { $0.userId == userId && $0.proofId == proofId }) {
            if reactions[idx].emoji == emoji {
                reactions.remove(at: idx)
            } else {
                reactions[idx].emoji = emoji
            }
        } else {
            reactions.append(Reaction(userId: userId, proofId: proofId, emoji: emoji))
        }
    }

    func reactionCount(for emoji: String) -> Int {
        reactions.filter { $0.proofId == proofId && $0.emoji == emoji }.count
    }

    func userReaction() -> String? {
        reactions.first(where: { $0.userId == userId && $0.proofId == proofId })?.emoji
    }

    func addComment(text: String) {
        let comment = Comment(userId: userId, proofId: proofId, text: text, timestamp: Date())
        comments.append(comment)
    }

    var filteredComments: [Comment] {
        comments.filter { $0.proofId == proofId }
    }
}
