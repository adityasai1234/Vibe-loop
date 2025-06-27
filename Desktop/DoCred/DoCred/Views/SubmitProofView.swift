import SwiftUI

struct SubmitProofView: View {
    let task: Task
    @State private var notes: String = ""
    var body: some View {
        Form {
            Section(header: Text("Notes")) {
                TextField("Enter notes", text: $notes)
            }
            Button("Submit Proof") {
            }
        }
        .navigationTitle("Submit Proof")
    }
}