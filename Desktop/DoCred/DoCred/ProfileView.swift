import SwiftUI

struct ProfileView: View {
    @Binding var userProfile: UserProfile
    @State private var showImagePicker = false
    @State private var tempImage: UIImage? = nil
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Avatar and Nickname
                VStack(spacing: 8) {
                    ZStack(alignment: .bottomTrailing) {
                        if let image = userProfile.profileImage {
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 100, height: 100)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color.accentColor, lineWidth: 3))
                        } else {
                            Image(systemName: "person.crop.circle.fill")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 100, height: 100)
                                .foregroundColor(.gray)
                        }
                        Button(action: { showImagePicker = true }) {
                            Image(systemName: "camera.fill")
                                .padding(8)
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(radius: 2)
                        }
                        .offset(x: 8, y: 8)
                    }
                    Text(userProfile.nickname)
                        .font(.title).bold()
                }
                // Streak and Points
                HStack(spacing: 32) {
                    VStack {
                        Text("🔥")
                        Text("Streak")
                            .font(.caption)
                        Text("\(userProfile.streak) days")
                            .font(.headline)
                    }
                    VStack {
                        Text("⭐️")
                        Text("Points")
                            .font(.caption)
                        Text("\(userProfile.totalPoints)")
                            .font(.headline)
                    }
                }
                // Badges
                VStack(alignment: .leading) {
                    Text("Badges")
                        .font(.headline)
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(userProfile.badges, id: \ .self) { badge in
                                Text(badge)
                                    .font(.caption)
                                    .padding(.vertical, 6)
                                    .padding(.horizontal, 12)
                                    .background(Color.yellow.opacity(0.2))
                                    .cornerRadius(12)
                            }
                        }
                    }
                }
                // History
                VStack(alignment: .leading, spacing: 8) {
                    Text("History")
                        .font(.headline)
                    ForEach(userProfile.completedChores) { chore in
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text(chore.title)
                                .font(.body)
                            Spacer()
                            Text("+\(chore.points)")
                                .foregroundColor(.blue)
                        }
                        .padding(.vertical, 4)
                    }
                }
                Spacer()
            }
            .padding()
        }
        .sheet(isPresented: $showImagePicker, onDismiss: {
            if let img = tempImage {
                userProfile.profileImage = img
            }
        }) {
            ImagePicker(image: $tempImage)
        }
    }
}

#Preview {
    ProfileView(userProfile: .constant(.mock))
} 