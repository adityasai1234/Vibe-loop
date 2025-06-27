import SwiftUI

struct WelcomeScreen: View {
    var onContinue: () -> Void = {}
    var body: some View {
        NavigationView {
            VStack(spacing: 40) {
                Spacer()
                Image(systemName: "hand.wave.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100, height: 100)
                    .foregroundColor(.accentColor)
                Text("Welcome to DoCred!")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                Text("Spin the wheel to see who does the extra chore!")
                    .font(.title3)
                    .foregroundColor(.secondary)
                Spacer()
                Button(action: { onContinue() }) {
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
            .background(Color(.white))
            .navigationTitle("")
        }
    }
}