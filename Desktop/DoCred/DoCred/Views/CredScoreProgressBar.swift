import SwiftUI

struct CredScoreProgressBar: View {
    var progress: Double
    var body: some View {
        VStack(alignment: .leading) {
            Text("Credibility Score")
                .font(.caption)
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(Color(.systemGray5))
                    .frame(height: 12)
                Capsule()
                    .fill(Color.accentColor)
                    .frame(width: CGFloat(progress) * 200, height: 12)
            }
            .frame(height: 12)
        }
        .padding(.vertical, 4)
    }
}