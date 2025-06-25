import SwiftUI

struct SettingsView: View {
    @StateObject private var themeManager = ThemeManager.shared
    @State private var hapticEnabled = true
    @State private var showThemePicker = false
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        Spacer()
                        Button(action: {
                            withAnimation(.spring()) {
                                themeManager.toggleDarkMode()
                                HapticManager.shared.mediumImpact()
                            }
                        }) {
                            Image(systemName: themeManager.isDarkMode ? "moon.fill" : "sun.max.fill")
                                .font(.system(size: 32))
                                .foregroundColor(themeManager.isDarkMode ? .yellow : .orange)
                                .rotationEffect(.degrees(themeManager.isDarkMode ? 20 : 0))
                                .scaleEffect(themeManager.isDarkMode ? 1.1 : 1.0)
                                .shadow(radius: 4)
                                .padding(.vertical, 8)
                        }
                        .accessibilityLabel(themeManager.isDarkMode ? "Switch to Day Mode" : "Switch to Night Mode")
                        Spacer()
                    }
                }
                Section("Appearance") {
                    HStack {
                        Image(systemName: "moon.fill")
                            .foregroundColor(.purple)
                        Text("Dark Mode")
                        Spacer()
                        Toggle("", isOn: $themeManager.isDarkMode)
                            .onChange(of: themeManager.isDarkMode) { newValue in
                                HapticManager.shared.lightImpact()
                            }
                    }
                    
                    HStack {
                        Image(systemName: "paintbrush.fill")
                            .foregroundColor(themeManager.customAccentColor)
                        Text("Theme")
                        Spacer()
                        Button(themeManager.selectedTheme.name) {
                            HapticManager.shared.mediumImpact()
                            showThemePicker = true
                        }
                        .foregroundColor(themeManager.customAccentColor)
                    }
                }
                
                Section("Feedback") {
                    HStack {
                        Image(systemName: "iphone.radiowaves.left.and.right")
                            .foregroundColor(.blue)
                        Text("Haptic Feedback")
                        Spacer()
                        Toggle("", isOn: $hapticEnabled)
                            .onChange(of: hapticEnabled) { newValue in
                                if newValue {
                                    HapticManager.shared.lightImpact()
                                }
                            }
                    }
                }
                
                Section("About") {
                    HStack {
                        Image(systemName: "info.circle")
                            .foregroundColor(.gray)
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .sheet(isPresented: $showThemePicker) {
                ThemePickerView()
            }
        }
        .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
        .accentColor(themeManager.customAccentColor)
    }
}

struct ThemePickerView: View {
    @StateObject private var themeManager = ThemeManager.shared
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                ForEach(AppTheme.allCases, id: \.self) { theme in
                    HStack {
                        Circle()
                            .fill(theme.accentColor)
                            .frame(width: 20, height: 20)
                        Text(theme.name)
                        Spacer()
                        if themeManager.selectedTheme == theme {
                            Image(systemName: "checkmark")
                                .foregroundColor(theme.accentColor)
                        }
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        HapticManager.shared.mediumImpact()
                        themeManager.setTheme(theme)
                        dismiss()
                    }
                }
            }
            .navigationTitle("Choose Theme")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        HapticManager.shared.lightImpact()
                        dismiss()
                    }
                }
            }
        }
    }
} 