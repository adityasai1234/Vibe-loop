import SwiftUI

struct ReviewDetailView: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Review Proof Submission")
                .font(.title2)
            // Proof preview carousel, notes, approve/reject, feedback
            Spacer()
            HStack {
                Button("Reject") {}
                    .buttonStyle(.bordered)
                Button("Approve") {}
                    .buttonStyle(.borderedProminent)
            }
        }
        .padding()
        .padding(3)
        .navigationTitle("Review Detail")
    }
}