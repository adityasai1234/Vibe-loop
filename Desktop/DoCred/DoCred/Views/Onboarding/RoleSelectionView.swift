import SwiftUI

struct RoleSelectionView: View {
    @State private var selectedRole = 0
    let roles = ["User", "Admin"]
    var body: some View {
        VStack(spacing: 24) {
            Text("Choose Your Role")
                .font(.title2)
            Picker("Role", selection: $selectedRole) {
                ForEach(0..<roles.count, id: \ .self) { i in
                    Text(roles[i])
                }
            }
            .pickerStyle(.segmented)
            Spacer()
        }
        .padding()
    }
}