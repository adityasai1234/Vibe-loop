import SwiftUI
import AVFoundation

class SoundManager {
    static let shared = SoundManager()
    private var player: AVAudioPlayer?
    func playSound(named name: String) {
        if let url = Bundle.main.url(forResource: name, withExtension: "mp3") {
            player = try? AVAudioPlayer(contentsOf: url)
            player?.play()
        }
    }
}

struct AchievementAnimationView: View {
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    @Binding var isPresented: Bool
    @State private var scale: CGFloat = 0.1
    @State private var opacity: Double = 0
    @State private var rotation: Double = 0
    @State private var showConfetti = false
    
    var body: some View {
        ZStack {
            // Background overlay
            Color.black.opacity(0.3)
                .ignoresSafeArea()
                .onTapGesture {
                    dismiss()
                }
            
            // Achievement card
            VStack(spacing: 20) {
                // Icon with animation
                ZStack {
                    Circle()
                        .fill(color.opacity(0.2))
                        .frame(width: 80, height: 80)
                    
                    Image(systemName: icon)
                        .font(.system(size: 40))
                        .foregroundColor(color)
                        .rotationEffect(.degrees(rotation))
                }
                .scaleEffect(scale)
                
                // Text content
                VStack(spacing: 8) {
                    Text(title)
                        .font(.title2)
                        .fontWeight(.bold)
                        .multilineTextAlignment(.center)
                    
                    Text(subtitle)
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .opacity(opacity)
                
                // Action button
                Button("Continue") {
                    HapticManager.shared.success()
                    dismiss()
                }
                .buttonStyle(.borderedProminent)
                .opacity(opacity)
            }
            .padding(30)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color(.systemBackground))
                    .shadow(radius: 20)
            )
            .scaleEffect(scale)
            .opacity(opacity)
            
            // Confetti effect
            if showConfetti {
                ConfettiView()
            }
        }
        .onAppear {
            animateIn()
            SoundManager.shared.playSound(named: "success")
        }
    }
    
    private func animateIn() {
        withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
            scale = 1.0
            opacity = 1.0
        }
        
        withAnimation(.easeInOut(duration: 0.8).repeatCount(3, autoreverses: true)) {
            rotation = 360
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation(.easeInOut(duration: 0.5)) {
                showConfetti = true
            }
        }
        
        HapticManager.shared.success()
    }
    
    private func dismiss() {
        withAnimation(.easeInOut(duration: 0.3)) {
            scale = 0.1
            opacity = 0
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            isPresented = false
        }
    }
}

struct ConfettiView: View {
    let colors: [Color] = [.red, .blue, .green, .yellow, .purple, .orange]
    
    var body: some View {
        ZStack {
            ForEach(0..<20, id: \.self) { index in
                Circle()
                    .fill(colors[index % colors.count])
                    .frame(width: 8, height: 8)
                    .offset(x: CGFloat.random(in: -150...150), y: CGFloat.random(in: -300...300))
                    .animation(
                        .easeOut(duration: 2)
                        .delay(Double.random(in: 0...0.5)),
                        value: UUID()
                    )
            }
        }
    }
}

// Usage example
struct AchievementExample: View {
    @State private var showAchievement = false
    
    var body: some View {
        Button("Show Achievement") {
            showAchievement = true
        }
        .sheet(isPresented: $showAchievement) {
            AchievementAnimationView(
                title: "Task Master!",
                subtitle: "You've completed 10 tasks this week",
                icon: "star.fill",
                color: .yellow,
                isPresented: $showAchievement
            )
        }
    }
} 
