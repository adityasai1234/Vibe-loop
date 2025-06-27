import SwiftUI

struct CalendarBarView: View {
    @Binding var selectedDate: Date
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(0..<7) { offset in
                    let date = Calendar.current.date(byAdding: .day, value: offset, to: Date())!
                    VStack {
                        Text(date, format: .dateTime.weekday(.abbreviated))
                            .font(.caption)
                        Text(date, format: .dateTime.day())
                            .font(.headline)
                            .padding(8)
                            .background(selectedDate.isSameDay(as: date) ? Color.accentColor : Color(.systemGray6))
                            .foregroundColor(selectedDate.isSameDay(as: date) ? .white : .primary)
                            .clipShape(Circle())
                    }
                    .onTapGesture { selectedDate = date }
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
    }
}

extension Date {
    func isSameDay(as other: Date) -> Bool {
        Calendar.current.isDate(self, inSameDayAs: other)
    }
}