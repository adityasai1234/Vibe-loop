import SwiftUI

struct FairnessVotingView: View {
    @StateObject var viewModel: FairnessVotingViewModel
    @State private var userVote: Bool? = nil
    @State private var showReasonModal = false
    @State private var reasonText = ""

    var body: some View {
        VStack(spacing: 16) {
            if !viewModel.isVotingActive {
                Button("⚠️ Report Unfair") {
                    showReasonModal = true
                }
                .sheet(isPresented: $showReasonModal) {
                    VStack(spacing: 16) {
                        Text("Why is this unfair?")
                        TextField("Optional reason...", text: $reasonText)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                        Button("Start Vote") {
                            viewModel.startVoting(reason: reasonText)
                            showReasonModal = false
                        }
                    }
                    .padding()
                }
            } else {
                Text("Voting: Is this task fair?")
                    .font(.headline)
                HStack {
                    Button(action: { userVote = false; viewModel.castVote(vote: false) }) {
                        Text("✅ Keep as is (\(viewModel.keepVotes))")
                    }
                    .disabled(viewModel.hasVoted)
                    Button(action: { userVote = true; viewModel.castVote(vote: true) }) {
                        Text("🔄 Reassign (\(viewModel.reassignVotes))")
                    }
                    .disabled(viewModel.hasVoted)
                }
                Text("\(viewModel.totalVotes) of \(viewModel.userIds.count) have voted")
                if let endsAt = viewModel.votingEndsAt {
                    Text("Voting ends in \(Int(endsAt.timeIntervalSinceNow/60)) min")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                if let result = viewModel.votingResult {
                    Text(result == "reassign" ? "Task will be reassigned. Admin notified." : "Majority agreed it's fair.")
                        .font(.headline)
                        .foregroundColor(result == "reassign" ? .red : .green)
                }
            }
        }
        .padding()
    }
}