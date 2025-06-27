import SwiftUI

struct BadgeViewerView: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Your Badges & Rewards")
                .font(.title2)
            // List of badges goes here
            Spacer()
        }
        .padding()
        .navigationTitle("Badges")
    }
}