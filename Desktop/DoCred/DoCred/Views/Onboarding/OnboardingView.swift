import SwiftUI

struct OnboardingView: View {
    var body: some View {
        VStack(spacing: 32) {
            Text("Welcome to DoCred – Chore Edition!")
                .font(.largeTitle)
                .bold()
            Spacer()
            Button("Get Started") {}
                .buttonStyle(.borderedProminent)
        }
        .padding()

    }
} 
