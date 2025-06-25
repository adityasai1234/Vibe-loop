import SwiftUI

struct ProfileView: View {
        let user = User(id: "demoUser1", name: "Alex Johnson", email: "alex@example.com", credibilityScore: 120, teamId: nil, badges: ["Starter", "Reliable"], role: .member)
    let completedTasks: [Task] = [
        Task(id: "task1", title: "Take out trash", description: "Take out the trash before 8pm", status: .approved, proof: [], createdAt: Date().addingTimeInterval(-86400 * 2), updatedAt: nil, assignedTo: "demoUser1", reviewedBy: nil, score: 10, teamId: nil),
        Task(id: "task2", title: "Wash dishes", description: "Wash all dishes after dinner", status: .approved, proof: [], createdAt: Date().addingTimeInterval(-86400 * 1), updatedAt: nil, assignedTo: "demoUser1", reviewedBy: nil, score: 8, teamId: nil)
    ]
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            HStack(spacing: 16) {
                Circle()
                    .fill(Color.accentColor.opacity(0.2))
                    .frame(width: 60, height: 60)
                    .overlay(
                        Text(user.name.prefix(2).uppercased())
                            .font(.title)
                            .foregroundColor(.accentColor)
                    )
                VStack(alignment: .leading) {
                    Text(user.name)
                        .font(.title2).bold()
                    Text(user.email)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    Text("Credibility: \(user.credibilityScore)")
                        .font(.caption)
                        .foregroundColor(.accentColor)
                }
            }
            Text("Completed Chores")
                .font(.headline)
            List(completedTasks) { task in
                HStack {
                    VStack(alignment: .leading) {
                        Text(task.title)
                            .font(.body)
                        Text(task.createdAt, style: .date)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    Spacer()
                    Image(systemName: "checkmark.seal.fill")
                        .foregroundColor(.accentColor)
                }
                .padding(.vertical, 4)
            }
            .listStyle(.plain)
        }
        .padding()
        .navigationTitle("Profile")
    }
} 