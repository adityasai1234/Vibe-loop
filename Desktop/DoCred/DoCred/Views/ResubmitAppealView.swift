import SwiftUI

struct ResubmitAppealView: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Resubmit or Appeal")
                .font(.title2)
            // Form for resubmission or appeal
            Spacer()
            Button("Resubmit") {}
                .buttonStyle(.borderedProminent)
        }
        .padding()
        .navigationTitle("Appeal")
    }
} 
