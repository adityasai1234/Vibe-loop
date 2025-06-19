//
//  ContentView.swift
//  DoCred
//
//  Created by Aditysai B on 19/06/25.
//

import SwiftUI
import PhotosUI

struct ContentView: View {
    @State private var isLoggedIn = false
    @State private var chores: [Chore] = Chore.mockChores
    @State private var totalPoints: Int = 250
    @State private var streak: Int = 3
    @State private var selectedImage: UIImage? = nil
    @State private var userProfile: UserProfile = .mock

    var body: some View {
        if !isLoggedIn {
            LoginView(isLoggedIn: $isLoggedIn)
        } else {
            MainTabView(
                chores: $chores,
                totalPoints: $totalPoints,
                streak: $streak,
                selectedImage: $selectedImage,
                userProfile: $userProfile
            )
        }
    }
}
