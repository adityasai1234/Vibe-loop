import SwiftUI

struct AccessibilityInfoView: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Accessibility Features")
                .font(.title2)
            Text("VoiceOver, Dynamic Type, High Contrast, Focus Indicators, and more.")
                .multilineTextAlignment(.center)
            Spacer()
        }
        .padding()
    }
}