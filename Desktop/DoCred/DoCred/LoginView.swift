import SwiftUI

struct LoginView: View {
    @Binding var isLoggedIn: Bool
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            Image(systemName: "checkmark.seal.fill")
                .resizable()
                .frame(width: 80, height: 80)
                .foregroundColor(.accentColor)
                .padding(.bottom, 8)
            Text("Welcome to DoCred")
                .font(.largeTitle).fontWeight(.bold)
            Text("Earn points and rewards for completing real chores.")
                .font(.title3)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            Spacer()
            Button(action: { isLoggedIn = true }) {
                Text("Continue")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.accentColor)
                    .foregroundColor(.white)
                    .cornerRadius(16)
                    .shadow(radius: 2)
            }
            .padding(.horizontal)
            Spacer()
        }
        .background(Color(.systemGroupedBackground))
        .ignoresSafeArea()
    }
}

#Preview {
    LoginView(isLoggedIn: .constant(false))
} 