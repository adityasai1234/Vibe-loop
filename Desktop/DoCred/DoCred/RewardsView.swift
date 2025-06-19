import SwiftUI

struct RewardsView: View {
    @Binding var totalPoints: Int
    @State private var showAlert = false
    @State private var selectedReward: Reward? = nil
    let rewards = Reward.mockRewards

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("🎁 Rewards Store")
                .font(.largeTitle).bold()
                .padding(.top)
            ScrollView {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 20) {
                    ForEach(rewards) { reward in
                        VStack(spacing: 12) {
                            Text(reward.icon)
                                .font(.system(size: 48))
                            Text(reward.title)
                                .font(.headline)
                            Text("\(reward.points) pts")
                                .font(.subheadline)
                                .foregroundColor(.blue)
                            Button(action: {
                                selectedReward = reward
                                showAlert = true
                            }) {
                                Text("Redeem")
                                    .font(.subheadline)
                                    .frame(maxWidth: .infinity)
                                    .padding(8)
                                    .background(Color.orange)
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                            }
                        }
                        .padding()
                        .background(Color(.systemBackground))
                        .cornerRadius(16)
                        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
                    }
                }
                .padding(.horizontal)
            }
        }
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text("Redeem Reward"),
                message: Text("You need \(selectedReward?.points ?? 0) points to redeem \(selectedReward?.title ?? "this reward")."),
                dismissButton: .default(Text("OK"))
            )
        }
    }
}

#Preview {
    RewardsView(totalPoints: .constant(250))
} 