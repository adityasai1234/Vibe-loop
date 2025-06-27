import SwiftUI

struct SelectTaskView: View {
    var body: some View {
        VStack {
            Text("Select a Task to Submit Proof")
                .font(.title2)
                .padding()
            // List of tasks goes here
            Spacer()
        }
        .navigationTitle("Submit Proof")
    }
}
