import SwiftUI

struct ProofConfirmationView: View {
    var body: some View {
        VStack(spacing: 32) {
            Text("✅ Proof Submitted!")
                .font(.largeTitle)
            Text("Your proof was submitted successfully.")
            Text("Expected review time: 1-2 hours")
                .font(.caption)
                .foregroundColor(.secondary)
            Button("Go to My History") {}
                .buttonStyle(.borderedProminent)
        }
        .padding()
        .navigationTitle("Confirmation")
    }
} 
    