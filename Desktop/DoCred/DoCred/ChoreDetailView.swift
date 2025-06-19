import SwiftUI

struct ChoreDetailView: View {
    var chore: Chore
    var onComplete: (Chore, Int, Int) -> Void
    @Binding var selectedImage: UIImage?
    var streak: Int
    @State private var showImagePicker = false
    @State private var showConfirmation = false

    var body: some View {
        VStack(spacing: 24) {
            Text(chore.title)
                .font(.largeTitle).bold()
            if let desc = chore.description {
                Text(desc)
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button(action: { showImagePicker = true }) {
                HStack {
                    Image(systemName: "photo.on.rectangle")
                    Text(selectedImage == nil ? "Upload Proof" : "Change Photo")
                }
                .font(.headline)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(16)
            }
            if let image = selectedImage {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 180)
                    .cornerRadius(16)
                    .shadow(radius: 2)
            }
            Spacer()
            Button(action: {
                if selectedImage != nil {
                    var updated = chore
                    updated.isCompleted = true
                    updated.proofImage = selectedImage
                    showConfirmation = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        onComplete(updated, chore.points, streak + 1)
                        selectedImage = nil
                    }
                }
            }) {
                Text("Mark as Done")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(selectedImage == nil ? Color.gray : Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(16)
            }
            .disabled(selectedImage == nil)
            if showConfirmation {
                VStack(spacing: 8) {
                    Text("✅ Task Complete! +\(chore.points) points added.")
                        .font(.headline)
                    Text("🔥 Streak: \(streak + 1) days")
                        .font(.subheadline)
                        .foregroundColor(.orange)
                }
                .transition(.opacity)
            }
        }
        .padding()
        .sheet(isPresented: $showImagePicker) {
            ImagePicker(image: $selectedImage)
        }
    }
}

#Preview {
    ChoreDetailView(
        chore: Chore.mockChores[0],
        onComplete: {_,_,_ in},
        selectedImage: .constant(nil),
        streak: 3
    )
} 