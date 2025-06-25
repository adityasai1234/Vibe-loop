import SwiftUI

struct TaskCardView: View {
    let task: Task
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(task.title)
                    .font(.headline)
                Spacer()
                if let xp = task.score {
                    HStack(spacing: 4) {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                            .font(.caption)
                        Text("+\(xp) XP")
                            .font(.caption)
                            .foregroundColor(.yellow)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color.yellow.opacity(0.12))
                    .cornerRadius(8)
                }
            }
            Text(task.description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            HStack {
                Text("Status: ")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(task.status.rawValue.capitalized)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(color(for: task.status))
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.06), radius: 3, x: 0, y: 2)
        .padding(.vertical, 4)
    }
    
    func color(for status: TaskStatus) -> Color {
        switch status {
        case .approved: return .green
        case .pending: return .blue
        case .reviewed: return .orange
        }
    }
} 