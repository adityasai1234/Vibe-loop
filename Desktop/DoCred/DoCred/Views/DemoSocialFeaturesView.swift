import SwiftUI

struct DemoSocialFeaturesView: View {
    let mockProof = Proof(id: "proof1", type: .photo, url: nil, notes: "Sample proof", timestamp: Date(), status: .approved, reviewer: nil)
    let mockTask = Task(id: "task1", title: "Take out trash", details: "Take out the trash before 8pm", status: .approved, createdAt: Date(), updatedAt: nil, assignedTo: "demoUser1", reviewedBy: nil, score: nil, teamId: nil, recurrence: .none, recurrenceEndDate: nil)
    let mockUserIds = ["demoUser1", "demoUser2", "demoUser3"]

    var body: some View {
        VStack(spacing: 32) {
            Text("Proof Reactions & Comments")
                .font(.headline)
            ProofInteractionView(
                viewModel: ProofInteractionViewModel(
                    proofId: mockProof.id,
                    userId: "demoUser1"
                )
            )
            Divider()
            Text("Task Fairness Voting")
                .font(.headline)
            FairnessVotingView(
                viewModel: FairnessVotingViewModel(
                    choreId: mockTask.id,
                    userIds: mockUserIds
                )
            )
        }
        .padding()
    }
}
