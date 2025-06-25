import SwiftUI

struct TaskCreationView: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Create a New Task")
                .font(.title2)
            // Form fields for task creation
            Spacer()
            Button("Create Task") {}
                .buttonStyle(.borderedProminent)
        }
        .padding()
        .navigationTitle("Task Creation")
    }
} 