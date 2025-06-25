import SwiftUI

struct BottomNavBarView: View {
    @Binding var selectedTab: Int
    var body: some View {
        HStack {
            Spacer()
            navButton(icon: "house.fill", index: 0)
            Spacer()
            navButton(icon: "trophy.fill", index: 1)
            Spacer()
            navButton(icon: "plus.circle.fill", index: 2)
            Spacer()
            navButton(icon: "clock.fill", index: 3)
            Spacer()
            navButton(icon: "person.crop.circle", index: 4)
            Spacer()
        }
        .font(.title2)
        .padding(.vertical, 8)
        .background(Color(.systemGray6))
    }
    func navButton(icon: String, index: Int) -> some View {
        Button(action: { selectedTab = index }) {
            Image(systemName: icon)
                .foregroundColor(selectedTab == index ? .accentColor : .gray)
        }
        .accessibilityLabel(Text(icon))
    }
} 