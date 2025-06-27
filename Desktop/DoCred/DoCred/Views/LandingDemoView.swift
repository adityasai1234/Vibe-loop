import SwiftUI

struct LandingDemoView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 32) {
                Spacer()
                Image(systemName: "checkmark.seal.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.accentColor)
                Text("Welcome to DoCred!")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                Text("Gamified Chore & Proof Manager\nwith Social Features")
                    .font(.title3)
                    .multilineTextAlignment(.center)
                    .foregroundColor(.secondary)
                Spacer()
                VStack(spacing: 16) {
                    NavigationLink(destination: DemoSocialFeaturesView()) {
                        Label("Try Social Features Demo", systemImage: "face.smiling")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.accentColor)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                            .shadow(radius: 2)
                    }
                    NavigationLink(destination: DashboardView()) {
                        Label("Go to Dashboard", systemImage: "list.bullet.rectangle")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(.systemGray6))
                            .foregroundColor(.accentColor)
                            .cornerRadius(12)
                            .shadow(radius: 1)
                    }
                }
                .padding(.horizontal)
                Spacer()
            }
            .padding()
        }
    }
}