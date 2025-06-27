import SwiftUI

struct ExportModalView: View {
    @State private var selectedFormat = 0
    let formats = ["PDF", "CSV"]
    var body: some View {
        VStack(spacing: 24) {
            Text("Export Data")
                .font(.title2)
            Picker("Format", selection: $selectedFormat) {
                ForEach(0..<formats.count, id: \ .self) { i in
                    Text(formats[i])
                }
            }
            .pickerStyle(.segmented)
            // Field selection checkboxes go here later
            Button("Export") {}
                .buttonStyle(.borderedProminent)
            Spacer()
        }
        .padding()
    }
}
