import Foundation
import Combine

class FairnessVotingViewModel: ObservableObject {
    @Published var votes: [FairnessVote] = []
    @Published var isVotingActive: Bool = false
    @Published var votingEndsAt: Date?
    let choreId: String
    let userIds: [String]
    @Published var hasVoted: Bool = false

    init(choreId: String, userIds: [String]) {
        self.choreId = choreId
        self.userIds = userIds
    }

    func startVoting(reason: String?) {
        isVotingActive = true
        votingEndsAt = Date().addingTimeInterval(3600)
        hasVoted = false
    }

    func castVote(vote: Bool, reason: String? = nil) {
        guard isVotingActive, !hasVoted else { return }
        votes.append(FairnessVote(choreId: choreId, vote: vote, reason: reason))
        hasVoted = true
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