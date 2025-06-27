//
//  ContentView.swift
//  DoCred
//
//  Created by Aditysai B on 25/06/25.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    @State private var selectedTab = 0
    @EnvironmentObject private var themeManager: ThemeManager
    @State private var showingSubmitSheet = false
    @State private var showingThemeToggle = false
    
    var body: some View {
        ZStack {
            // Main tab view
            TabView(selection: $selectedTab) {
                NavigationView {
                    DashboardView()
                }
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }
                .tag(0)
                
                NavigationView {
                    FullCalendarView()
                }
                .tabItem {
                    Image(systemName: "calendar")
                    Text("Calendar")
                }
                .tag(1)
                
                NavigationView {
                    LeaderboardView()
                }
                .tabItem {
                    Image(systemName: "trophy.fill")
                    Text("Leaderboard")
                }
                .tag(2)
                
                // Submit tab - just a placeholder
                Color.clear
                    .tabItem {
                        Image(systemName: "plus.circle.fill")
                        Text("Submit")
                    }
                    .tag(3)
                
                NavigationView {
                    HistoryView()
                }
                .tabItem {
                    Image(systemName: "clock.fill")
                    Text("History")
                }
                .tag(4)
                
                NavigationView {
                    ProfileView()
                }
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("Profile")
                }
                .tag(5)
            }
            .accentColor(themeManager.customAccentColor)
            .onChange(of: selectedTab) { newValue in
                if newValue == 3 {
                    selectedTab = 0
                    showingSubmitSheet = true
                }
            }
            
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button(action: {
                        HapticManager.shared.heavyImpact()
                        withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                            showingSubmitSheet = true
                        }
                    }) {
                        Image(systemName: "plus")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 60, height: 60)
                            .background(
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            gradient: Gradient(colors: [
                                                themeManager.customAccentColor,
                                                themeManager.customAccentColor.opacity(0.8)
                                            ]),
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .shadow(
                                        color: themeManager.customAccentColor.opacity(0.4),
                                        radius: 12,
                                        x: 0,
                                        y: 6
                                    )
                            )
                    }
                    .padding(.bottom, 32)
                    .padding(.trailing, 24)
                }
            }
        }
        .sheet(isPresented: $showingSubmitSheet) {
            NavigationView {
                SubmitProofView(task: Task(
                    id: "demoTask",
                    title: "Demo Task",
                    details: "This is a demo task for proof submission.",
                    status: .pending,
                    createdAt: Date(),
                    updatedAt: nil,
                    assignedTo: "demoUserId",
                    reviewedBy: nil,
                    score: 5,
                    teamId: nil,
                    recurrence: .none,
                    recurrenceEndDate: nil
                ))
            }
        }
        .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Item.self, inMemory: true)
}
