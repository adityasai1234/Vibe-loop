import SwiftUI

struct GetStartedView: View {
    var body: some View {
        VStack(spacing: 32) {
            Text("Let's get started!")
                .font(.largeTitle)
                .bold()
            Button("Continue") {}
                .buttonStyle(.borderedProminent)
            Spacer()
        }
        .padding()
    }
}
