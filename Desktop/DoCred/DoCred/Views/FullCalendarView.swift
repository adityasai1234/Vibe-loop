import SwiftUI

struct FullCalendarView: View {
    @State private var selectedView = 0
    let views = ["Month", "Day"]
    var body: some View {
        VStack {
            Picker("View", selection: $selectedView) {
                ForEach(0..<views.count, id: \ .self) { i in
                    Text(views[i])
                }
            }
            .pickerStyle(.segmented)
            .padding()
            // Calendar grid or day list goes here
            Spacer()
        }
        .navigationTitle("Calendar")
    }
}