import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var themeManager: ThemeManager
    @State private var showingExportModal = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("Settings")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(.primary)
                    
                    Text("Customize your DoCred experience")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 20)
                .padding(.top, 16)
                
                // Appearance section
                SettingsSection(title: "Appearance") {
                    VStack(spacing: 16) {
                        // Theme toggle
                        SettingsRow(
                            icon: "paintbrush.fill",
                            title: "Dark Mode",
                            subtitle: "Switch between light and dark themes"
                        ) {
                            Toggle("", isOn: $themeManager.isDarkMode)
                                .toggleStyle(SwitchToggleStyle(tint: themeManager.customAccentColor))
                                .onChange(of: themeManager.isDarkMode) { newValue in
                                    HapticManager.shared.lightImpact()
                                }
                        }
                        
                        // Accent color picker
                        SettingsRow(
                            icon: "paintpalette.fill",
                            title: "Accent Color",
                            subtitle: "Choose your preferred color theme"
                        ) {
                            ColorPicker("", selection: $themeManager.customAccentColor)
                                .labelsHidden()
                                .onChange(of: themeManager.customAccentColor) { newValue in
                                    HapticManager.shared.lightImpact()
                                }
                        }
                    }
                }
                
                // Feedback section
                SettingsSection(title: "Feedback") {
                    VStack(spacing: 16) {
                        // Notification settings
                        SettingsRow(
                            icon: "bell.fill",
                            title: "Notifications",
                            subtitle: "Manage your notification preferences"
                        ) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                // Data section
                SettingsSection(title: "Data & Privacy") {
                    VStack(spacing: 16) {
                        // Export data
                        SettingsRow(
                            icon: "square.and.arrow.up.fill",
                            title: "Export Data",
                            subtitle: "Download your task history and achievements"
                        ) {
                            Button(action: {
                                HapticManager.shared.mediumImpact()
                                showingExportModal = true
                            }) {
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.secondary)
                            }
                        }
                        
                        // Privacy settings
                        SettingsRow(
                            icon: "lock.fill",
                            title: "Privacy",
                            subtitle: "Manage your privacy and data settings"
                        ) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                // Support section
                SettingsSection(title: "Support") {
                    VStack(spacing: 16) {
                        // Help & FAQ
                        SettingsRow(
                            icon: "questionmark.circle.fill",
                            title: "Help & FAQ",
                            subtitle: "Get help and find answers to common questions"
                        ) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                        
                        // Contact support
                        SettingsRow(
                            icon: "envelope.fill",
                            title: "Contact Support",
                            subtitle: "Reach out to our support team"
                        ) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                        
                        // Rate app
                        SettingsRow(
                            icon: "star.fill",
                            title: "Rate DoCred",
                            subtitle: "Share your feedback on the App Store"
                        ) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                // About section
                SettingsSection(title: "About") {
                    VStack(spacing: 16) {
                        // Version info
                        SettingsRow(
                            icon: "info.circle.fill",
                            title: "Version",
                            subtitle: "1.0.0 (Build 1)"
                        ) {
                            EmptyView()
                        }
                        
                        // Terms of service
                        SettingsRow(
                            icon: "doc.text.fill",
                            title: "Terms of Service",
                            subtitle: "Read our terms and conditions"
                        ) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                        
                        // Privacy policy
                        SettingsRow(
                            icon: "hand.raised.fill",
                            title: "Privacy Policy",
                            subtitle: "Learn how we protect your data"
                        ) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .padding(.bottom, 20)
        }
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(.systemBackground),
                    Color(.systemGray6).opacity(0.3)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .navigationTitle("Settings")
        .navigationBarTitleDisplayMode(.large)
        .sheet(isPresented: $showingExportModal) {
            ExportModalView()
        }
    }
}

struct SettingsSection<Content: View>: View {
    let title: String
    let content: Content
    
    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.primary)
                .padding(.horizontal, 20)
            
            VStack(spacing: 0) {
                content
            }
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(.systemBackground))
                    .shadow(
                        color: Color.black.opacity(0.05),
                        radius: 8,
                        x: 0,
                        y: 4
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color(.systemGray5), lineWidth: 0.5)
                    )
            )
            .padding(.horizontal, 20)
        }
    }
}

struct SettingsRow<Content: View>: View {
    let icon: String
    let title: String
    let subtitle: String
    let content: Content
    
    init(icon: String, title: String, subtitle: String, @ViewBuilder content: () -> Content) {
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self.content = content()
    }
    
    var body: some View {
        HStack(spacing: 16) {
            // Icon
            Image(systemName: icon)
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(.blue)
                .frame(width: 24, height: 24)
            
            // Text content
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text(subtitle)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            // Action content
            content
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .background(Color(.systemBackground))
    }
}