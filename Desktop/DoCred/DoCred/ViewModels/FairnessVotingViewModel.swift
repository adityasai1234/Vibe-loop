import Foundation
import Combine

class FairnessVotingViewModel: ObservableObject {
    @Published var votes: [FairnessVote] = []
    @Published var isVotingActive: Bool = false
    @Published var votingEndsAt: Date?
    let choreId: String
    let userIds: [String] // all users in group

    init(choreId: String, userIds: [String]) {
        self.choreId = choreId
        self.userIds = userIds
    }

    func startVoting(reason: String?) {
        isVotingActive = true
        votingEndsAt = Date().addingTimeInterval(3600) // 1 hour
        // Optionally store reason for audit
    }

    func castVote(userId: String, vote: Bool, reason: String? = nil) {
        guard isVotingActive, !votes.contains(where: { $0.userId == userId }) else { return }
        votes.append(FairnessVote(choreId: choreId, userId: userId, vote: vote, reason: reason))
    }

    var reassignVotes: Int { votes.filter { $0.vote }.count }
    var keepVotes: Int { votes.filter { !$0.vote }.count }
    var totalVotes: Int { votes.count }
    var majorityReached: Bool { totalVotes > userIds.count / 2 }
    var votingResult: String? {
        guard majorityReached else { return nil }
        return reassignVotes > keepVotes ? "reassign" : "keep"
    }
} 