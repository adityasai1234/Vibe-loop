import SwiftUI

struct BottomNavBarView: View {
    @Binding var selectedTab: Int
    @StateObject private var themeManager = ThemeManager.shared
   var body: some View {
        HStack(spacing: 0) {
            ForEach(0..<6) { index in
                Button(action: {
                    HapticManager.shared.lightImpact()
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedTab = index
                    }
                }) {
                    VStack(spacing: 4) {
                        Image(systemName: iconName(for: index))
                            .font(.system(size: 20, weight: selectedTab == index ? .semibold : .medium))
                            .foregroundColor(selectedTab == index ? themeManager.customAccentColor : .secondary)
                            .scaleEffect(selectedTab == index ? 1.1 : 1.0)
                            .animation(.easeInOut(duration: 0.2), value: selectedTab)
                        
                        Text(tabTitle(for: index))
                            .font(.system(size: 10, weight: selectedTab == index ? .semibold : .medium))
                            .foregroundColor(selectedTab == index ? themeManager.customAccentColor : .secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(
                        VStack {
                            if selectedTab == index {
                                Rectangle()
                                    .fill(themeManager.customAccentColor)
                                    .frame(height: 3)
                                    .cornerRadius(1.5)
                                    .matchedGeometryEffect(id: "tab", in: namespace)
                            } else {
                                Rectangle()
                                    .fill(Color.clear)
                                    .frame(height: 3)
                            }
                        }
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .background(
            Rectangle()
                .fill(Color(.systemBackground))
                .shadow(
                    color: Color.black.opacity(0.1),
                    radius: 8,
                    x: 0,
                    y: -2
                )
                .overlay(
                    Rectangle()
                        .stroke(Color(.systemGray5), lineWidth: 0.5)
                )
        )
    }
    
    @Namespace private var namespace
    
    func iconName(for index: Int) -> String {
        switch index {
        case 0: return "house.fill"
        case 1: return "calendar"
        case 2: return "trophy.fill"
        case 3: return "plus.circle.fill"
        case 4: return "clock.fill"
        case 5: return "person.fill"
        default: return "circle"
        }
    }
    
    func tabTitle(for index: Int) -> String {
        switch index {
        case 0: return "Home"
        case 1: return "Calendar"
        case 2: return "Leaderboard"
        case 3: return "Submit"
        case 4: return "History"
        case 5: return "Profile"
        default: return ""
        }
    }
}