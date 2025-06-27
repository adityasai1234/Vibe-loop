import SwiftUI

struct HistoryView: View {
    @State private var selectedStatus = 0
    let statuses = ["All", "Pending", "Approved", "Rejected"]
    var body: some View {
        VStack {
            Picker("Status", selection: $selectedStatus) {
                ForEach(0..<statuses.count, id: \ .self) { i in
                    Text(statuses[i])
                }
            }
            .pickerStyle(.segmented)
            .padding()
            Button("Export") {}
                .buttonStyle(.bordered)
            Spacer()
        }
        .navigationTitle("My History")
    }
}