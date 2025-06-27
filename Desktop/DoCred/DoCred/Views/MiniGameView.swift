import SwiftUI
import AVFoundation

struct MiniGameView: View {
    let users: [String]
    @State private var selectedIndex: Int? = nil
    @State private var isSpinning = false
    @State private var showResult = false
    @State private var angle: Double = 0
    
    var body: some View {
        VStack(spacing: 32) {
            Text("Who does the extra chore?")
                .font(.title2)
                .fontWeight(.bold)
            ZStack {
                WheelView(users: users, angle: angle)
                // Arrow always on top, not rotating
                Triangle()
                    .fill(Color.red)
                    .frame(width: 24, height: 24)
                    .offset(y: -120)
            }
            .animation(.easeInOut(duration: isSpinning ? 2.0 : 0.0), value: angle)
            Button(isSpinning ? "Spinning..." : "Spin the Wheel") {
                guard !isSpinning else { return }
                isSpinning = true
                let winner = Int.random(in: 0..<users.count)
                let spins = Double.random(in: 3...5)
                let finalAngle = 2 * .pi * spins - (Double(winner) / Double(users.count)) * 2 * .pi
                withAnimation(.easeInOut(duration: 2.0)) {
                    angle = finalAngle
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    selectedIndex = winner
                    isSpinning = false
                    showResult = true
                    HapticManager.shared.success()
                    SoundManager.shared.playSound(named: "success")
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(isSpinning)
            if showResult, let winner = selectedIndex {
                VStack(spacing: 12) {
                    Text("🎉 \(users[winner]) will do the chore!")
                        .font(.title2)
                        .fontWeight(.bold)
                    ConfettiView()
                    Button("OK") {
                        showResult = false
                        selectedIndex = nil
                        angle = 0
                    }
                    .buttonStyle(.bordered)
                }
            }
        }
        .padding()
    }
}