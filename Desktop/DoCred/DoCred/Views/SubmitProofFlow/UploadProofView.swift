import SwiftUI

struct UploadProofView: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Upload Proof for Task")
                .font(.title2)
            // will add Upload photo, video, notes, link, preview section
            Spacer()
            Button("Submit Proof") {}
                .buttonStyle(.borderedProminent)
                .disabled(true) // gonna xEnable when at least one field is filled
        }
        .padding()
        .navigationTitle("Upload Proof")
    }
}