import SwiftUI

struct LeaderboardView: View {
    @State private var isWeekly = true
    var body: some View {
        VStack(spacing: 16) {
            Text("🏆 Weekly Leaderboard")
                .font(.largeTitle).bold()
                .padding(.top)
            Picker("Leaderboard Type", selection: $isWeekly) {
                Text("Weekly").tag(true)
                Text("All-Time").tag(false)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding(.horizontal)
            ScrollView {
                LazyVStack(spacing: 16) {
                    ForEach(Array(LeaderboardUser.mockWeekly.prefix(3).enumerated()), id: \ .element.id) { index, user in
                        HStack(spacing: 16) {
                            Text("\(index + 1)")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(index == 0 ? .yellow : (index == 1 ? .gray : .orange))
                                .frame(width: 40)
                            Image(systemName: "person.crop.circle.fill")
                                .resizable()
                                .frame(width: 48, height: 48)
                                .foregroundColor(.accentColor)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(user.name)
                                    .font(.headline)
                                Capsule()
                                    .fill(Color.orange.opacity(0.15))
                                    .frame(height: 28)
                                    .overlay(
                                        Text("\(user.points) pts")
                                            .font(.subheadline).bold()
                                            .foregroundColor(.orange)
                                    )
                            }
                            Spacer()
                        }
                        .padding()
                        .background(Color(.systemBackground))
                        .cornerRadius(16)
                        .shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
                        .transition(.scale.combined(with: .opacity))
                        .animation(.easeInOut(duration: 0.3), value: user.points)
                    }
                }
                .padding(.horizontal)
            }
        }
        .background(Color(.systemGray6).ignoresSafeArea())
    }
}

#Preview {
    LeaderboardView()
} 