import SwiftUI

struct WheelView: View {
    let users: [String]
    let angle: Double
    var body: some View {
        ZStack {
            Circle()
                .strokeBorder(Color.accentColor, lineWidth: 6)
                .frame(width: 220, height: 220)
            let count = users.count
            ForEach(users.indices, id: \.self) { i in
                let theta = Double(i) / Double(count) * 2 * .pi - .pi/2
                UserLabel(user: users[i], theta: theta)
            }
            Triangle()
                .fill(Color.red)
                .frame(width: 24, height: 24)
                .offset(y: -120)
        }
        .rotationEffect(.radians(angle))
    }
}

struct UserLabel: View {
    let user: String
    let theta: Double
    var body: some View {
        VStack {
            Text(user)
                .font(.headline)
                .rotationEffect(.radians(-theta))
            Spacer()
        }
        .frame(width: 100, height: 100)
        .offset(x: 90 * cos(theta), y: 90 * sin(theta))
    }
}

struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}