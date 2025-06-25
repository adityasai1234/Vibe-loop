import SwiftUI

struct LeaderboardView: View {
    @State private var selectedTab = 0
    let tabs = ["Today", "This Week", "Month", "All Time"]
    var body: some View {
        VStack {
            Picker("Leaderboard", selection: $selectedTab) {
                ForEach(0..<tabs.count, id: \ .self) { i in
                    Text(tabs[i])
                }
            }
            .pickerStyle(.segmented)
            .padding()
            Spacer()
        }
        .navigationTitle("Leaderboard")
    }
}