//
//  DoCredApp.swift
//  DoCred
//
//  Created by Aditysai B on 25/06/25.
//

import SwiftUI
import SwiftData

@main
struct DoCredApp: App {
    var body: some Scene {
        WindowGroup {
            MainTabView()
        }
    }
}

struct MainTabView: View {
    @State private var selectedTab = 0
    @State private var showTaskCreation = false
    @State private var showExport = false
    @State private var showBadges = false
    @State private var showResubmit = false
    @State private var showMultiProof = false
    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationView {
                ZStack(alignment: .topTrailing) {
                    DashboardView()
                    // Dropdown menu button
                    Menu {
                        Button("Create Task") { showTaskCreation = true }
                        Button("Export Data") { showExport = true }
                        Button("View Badges") { showBadges = true }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.title2)
                            .padding()
                    }
                }
                .sheet(isPresented: $showTaskCreation) {
                    NavigationView { TaskCreationView() }
                }
                .sheet(isPresented: $showExport) {
                    NavigationView { ExportModalView() }
                }
                .sheet(isPresented: $showBadges) {
                    NavigationView { BadgeViewerView() }
                }
            }
            .tabItem {
                Image(systemName: "house.fill")
                Text("Home")
            }.tag(0)

            NavigationView { FullCalendarView() }
                .tabItem {
                    Image(systemName: "calendar")
                    Text("Calendar")
                }.tag(1)

            NavigationView { LeaderboardView() }
                .tabItem {
                    Image(systemName: "trophy.fill")
                    Text("Leaderboard")
                }.tag(2)

            NavigationView {
                ZStack(alignment: .topTrailing) {
                    SelectTaskView()
                    Menu {
                        Button("Submit Proof") { }
                        Button("Resubmit/Appeal") { showResubmit = true }
                        Button("Upload Multiple Proofs") { showMultiProof = true }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.title2)
                            .padding()
                    }
                }
                .sheet(isPresented: $showResubmit) {
                    NavigationView { ResubmitAppealView() }
                }
                .sheet(isPresented: $showMultiProof) {
                    // For demo, reuse UploadProofView
                    NavigationView { UploadProofView() }
                }
            }
            .tabItem {
                Image(systemName: "plus.circle.fill")
                Text("Submit")
            }.tag(3)

            NavigationView { HistoryView() }
                .tabItem {
                    Image(systemName: "clock.fill")
                    Text("History")
                }.tag(4)

            NavigationView { ProfileView() }
                .tabItem {
                    Image(systemName: "person.crop.circle")
                    Text("Profile")
                }.tag(5)
        }
    }
}
