import SwiftUI
import Combine

class ThemeManager: ObservableObject {
    @Published var isDarkMode: Bool = false
    @Published var selectedTheme: AppTheme = .default
    @Published var customAccentColor: Color = .blue
    
    static let shared = ThemeManager()
    private init() {
        loadUserPreferences()
    }
    
    func toggleDarkMode() {
        isDarkMode.toggle()
        saveUserPreferences()
    }
    
    func setTheme(_ theme: AppTheme) {
        selectedTheme = theme
        customAccentColor = theme.accentColor
        saveUserPreferences()
    }
    
    private func loadUserPreferences() {
        // Load from UserDefaults
        isDarkMode = UserDefaults.standard.bool(forKey: "isDarkMode")
        if let themeName = UserDefaults.standard.string(forKey: "selectedTheme"),
           let theme = AppTheme(rawValue: themeName) {
            selectedTheme = theme
            customAccentColor = theme.accentColor
        }
    }
    
    private func saveUserPreferences() {
        UserDefaults.standard.set(isDarkMode, forKey: "isDarkMode")
        UserDefaults.standard.set(selectedTheme.rawValue, forKey: "selectedTheme")
    }
}

enum AppTheme: String, CaseIterable {
    case `default` = "default"
    case ocean = "ocean"
    case forest = "forest"
    case sunset = "sunset"
    case lavender = "lavender"
    
    var accentColor: Color {
        switch self {
        case .default: return .blue
        case .ocean: return .cyan
        case .forest: return .green
        case .sunset: return .orange
        case .lavender: return .purple
        }
    }
    
    var name: String {
        switch self {
        case .default: return "Default"
        case .ocean: return "Ocean"
        case .forest: return "Forest"
        case .sunset: return "Sunset"
        case .lavender: return "Lavender"
        }
    }
}