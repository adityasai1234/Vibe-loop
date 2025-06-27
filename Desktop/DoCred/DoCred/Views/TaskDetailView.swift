import SwiftUI

struct TaskDetailView: View {
    let task: Task
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(task.title)
                .font(.largeTitle)
                .bold()
            Text(task.details)
                .font(.body)
            Text("Status: \(task.status.rawValue.capitalized)")
                .font(.headline)
            Spacer()
            NavigationLink(destination: SubmitProofView(task: task)) {
                Text("Submit Proof")
                    .padding()
                    .background(Color.accentColor)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
        .navigationTitle("Task Detail")
    }
}