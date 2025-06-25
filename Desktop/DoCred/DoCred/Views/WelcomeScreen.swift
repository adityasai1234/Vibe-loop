import SwiftUI

struct WelcomeScreen: View {
    @State private var navigate = false
    var body: some View {
        NavigationStack {
            VStack(spacing: 40) {
                Spacer()
                Image(systemName: "star.circle.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100, height: 100)
                    .foregroundColor(.accentColor)
                Text("Welcome to DoCred!")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                Text("Your gamified, social chore manager.")
                    .font(.title3)
                    .foregroundColor(.secondary)
                Spacer()
                Button(action: { navigate = true }) {
                    Text("Continue")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.accentColor)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                        .shadow(radius: 2)
                }
                .padding(.horizontal)
                Spacer()
            }
            .padding()
            .navigationDestination(isPresented: $navigate) {
                LandingDemoView()
            }
        }
    }
} 