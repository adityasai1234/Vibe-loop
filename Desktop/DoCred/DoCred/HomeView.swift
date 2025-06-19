import SwiftUI

struct HomeView: View {
    @Binding var chores: [Chore]
    @Binding var totalPoints: Int
    @Binding var streak: Int
    @Binding var selectedImage: UIImage?
    @Binding var userProfile: UserProfile
    @State private var selectedChore: Chore? = nil
    @State private var showDetail = false

    var completedCount: Int { chores.filter { $0.isCompleted }.count }
    var progress: Double { chores.isEmpty ? 0 : Double(completedCount) / Double(chores.count) }
    var todayChores: [Chore] { chores.filter { $0.dueDate == nil || Calendar.current.isDateInToday($0.dueDate!) } }
    var upcomingChores: [Chore] { chores.filter { $0.dueDate != nil && !Calendar.current.isDateInToday($0.dueDate!) } }

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Progress Bar
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Today's Progress")
                            .font(.headline)
                        ZStack(alignment: .leading) {
                            Capsule()
                                .fill(Color(.systemGray5))
                                .frame(height: 12)
                            Capsule()
                                .fill(Color.green)
                                .frame(width: CGFloat(progress) * UIScreen.main.bounds.width * 0.85, height: 12)
                                .animation(.easeInOut(duration: 0.4), value: progress)
                        }
                        Text("\(completedCount) of \(chores.count) completed")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal)

                    // Streak Banner
                    HStack {
                        Image(systemName: "flame.fill")
                            .foregroundColor(.orange)
                        Text("You're on a \(streak)-day streak!")
                            .font(.headline)
                    }
                    .padding()
                    .background(Color.orange.opacity(0.1))
                    .cornerRadius(16)
                    .shadow(radius: 4)

                    // Points
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text("You've earned \(totalPoints) points")
                            .font(.headline)
                    }
                    .padding(.bottom, 8)

                    Divider()

                    // Today's Chores
                    if !todayChores.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Today's Chores")
                                .font(.title2).bold()
                            ForEach(todayChores) { chore in
                                Button(action: {
                                    selectedChore = chore
                                    showDetail = true
                                }) {
                                    HStack {
                                        Image(systemName: chore.isCompleted ? "checkmark.circle.fill" : "circle")
                                            .foregroundColor(chore.isCompleted ? .green : .gray)
                                            .font(.title2)
                                            .scaleEffect(chore.isCompleted ? 1.2 : 1.0)
                                            .animation(.spring(), value: chore.isCompleted)
                                        VStack(alignment: .leading) {
                                            Text(chore.title)
                                                .font(.headline)
                                            if let due = chore.dueDate {
                                                Text("Due: \(due, style: .time)")
                                                    .font(.caption)
                                                    .foregroundColor(.secondary)
                                            }
                                        }
                                        Spacer()
                                        Text("+\(chore.points)")
                                            .font(.subheadline).bold()
                                            .foregroundColor(.orange)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(Color.orange.opacity(0.15))
                                            .cornerRadius(8)
                                    }
                                    .padding()
                                    .background(Color(.systemBackground))
                                    .cornerRadius(16)
                                    .shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
                                    .opacity(chore.isCompleted ? 0.6 : 1.0)
                                    .animation(.easeInOut(duration: 0.3), value: chore.isCompleted)
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                        .padding(.horizontal)
                    }

                    // Upcoming Chores
                    if !upcomingChores.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Upcoming Chores")
                                .font(.title3).bold()
                            ForEach(upcomingChores) { chore in
                                HStack {
                                    Image(systemName: "clock")
                                        .foregroundColor(.blue)
                                    Text(chore.title)
                                        .font(.headline)
                                    Spacer()
                                    Text("+\(chore.points)")
                                        .font(.subheadline).bold()
                                        .foregroundColor(.blue)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.blue.opacity(0.15))
                                        .cornerRadius(8)
                                }
                                .padding()
                                .background(Color(.systemBackground))
                                .cornerRadius(16)
                                .shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
                            }
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Home")
            .background(Color(.systemGray6).ignoresSafeArea())
            .sheet(isPresented: $showDetail) {
                if let chore = selectedChore {
                    ChoreDetailView(
                        chore: chore,
                        onComplete: { updatedChore, pointsEarned, newStreak in
                            if let idx = chores.firstIndex(where: { $0.id == updatedChore.id }) {
                                chores[idx] = updatedChore
                                totalPoints += pointsEarned
                                streak = newStreak
                                userProfile.totalPoints = totalPoints
                                userProfile.streak = streak
                                userProfile.completedChores.append(updatedChore)
                            }
                            showDetail = false
                        },
                        selectedImage: $selectedImage,
                        streak: streak
                    )
                }
            }
        }
    }
}

#Preview {
    HomeView(
        chores: .constant(Chore.mockChores),
        totalPoints: .constant(250),
        streak: .constant(3),
        selectedImage: .constant(nil),
        userProfile: .constant(.mock)
    )
} 