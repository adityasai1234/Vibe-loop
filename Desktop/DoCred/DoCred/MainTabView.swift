import SwiftUI

struct MainTabView: View {
    @Binding var chores: [Chore]
    @Binding var totalPoints: Int
    @Binding var streak: Int
    @Binding var selectedImage: UIImage?
    @Binding var userProfile: UserProfile

    var body: some View {
        TabView {
            HomeView(chores: $chores, totalPoints: $totalPoints, streak: $streak, selectedImage: $selectedImage, userProfile: $userProfile)
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }
            LeaderboardView()
                .tabItem {
                    Label("Leaderboard", systemImage: "list.number")
                }
            RewardsView(totalPoints: $totalPoints)
                .tabItem {
                    Label("Rewards", systemImage: "gift.fill")
                }
            ProfileView(userProfile: $userProfile)
                .tabItem {
                    Label("Profile", systemImage: "person.crop.circle")
                }
        }
        .accentColor(.blue)
    }
}

#Preview {
    MainTabView(
        chores: .constant(Chore.mockChores),
        totalPoints: .constant(250),
        streak: .constant(3),
        selectedImage: .constant(nil),
        userProfile: .constant(.mock)
    )
} 