import SwiftUI

struct DashboardView: View {
    @StateObject var viewModel = DashboardViewModel()
    var body: some View {
        VStack(alignment: .leading) {
            if let user = viewModel.user {
                Text("Hello, \(user.name)")
                    .font(.title)
                    .bold()
                Text("Credibility Score: \(user.credibilityScore)")
                    .font(.headline)
            }
            List(viewModel.tasks) { task in
                NavigationLink(destination: TaskDetailView(task: task)) {
                    TaskCardView(task: task)
                }
            }
            .listStyle(PlainListStyle())
            Spacer()
            NavigationLink(destination: ProfileView()) {
                Text("Go to Profile")
                    .padding()
                    .background(Color.accentColor)
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    .cornerRadius(8)
            }
        }
        .padding()
        .navigationTitle("Dashboard")
        .navigationBarTitleDisplayMode(.large)
    }
}