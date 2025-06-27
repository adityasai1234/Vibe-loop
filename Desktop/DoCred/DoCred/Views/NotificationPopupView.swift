import SwiftUI

struct NotificationPopupView: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("🔔 Notification")
                .font(.title2)
            Text("You have a new task assigned!")
            Spacer()
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(16)
        .shadow(radius: 4)
        .padding()
    }
}
