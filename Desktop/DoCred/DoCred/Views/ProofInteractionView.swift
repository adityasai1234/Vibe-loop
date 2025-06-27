import SwiftUI

struct ProofInteractionView: View {
    @StateObject var viewModel: ProofInteractionViewModel
    @State private var commentText = ""
    @Namespace private var emojiNamespace
    
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 18) {
                    ForEach(viewModel.availableEmojis, id: \.self) { emoji in
                        Button(action: {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                                viewModel.toggleReaction(emoji: emoji)
                            }
                        }) {
                            ZStack {
                                if viewModel.userReaction() == emoji {
                                    Circle()
                                        .fill(Color.accentColor.opacity(0.18))
                                        .frame(width: 48, height: 48)
                                        .matchedGeometryEffect(id: "selectedEmoji", in: emojiNamespace)
                                }
                                VStack(spacing: 2) {
                                    Text(emoji)
                                        .font(.system(size: 28))
                                        .scaleEffect(viewModel.userReaction() == emoji ? 1.2 : 1.0)
                                        .animation(.spring(), value: viewModel.userReaction())
                                    if viewModel.reactionCount(for: emoji) > 0 {
                                        Text("\(viewModel.reactionCount(for: emoji))")
                                            .font(.caption2)
                                            .foregroundColor(.secondary)
                                    }
                                }
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                        .accessibilityLabel("\(emoji) reaction, \(viewModel.reactionCount(for: emoji))")
                    }
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 10)
                .background(
                    Capsule()
                        .fill(Color(.systemGray6).opacity(0.7))
                        .shadow(color: Color.black.opacity(0.04), radius: 2, x: 0, y: 1)
                )
                .padding(.bottom, 4)
            }

            // Comments List
            VStack(alignment: .leading, spacing: 10) {
                ForEach(viewModel.filteredComments) { comment in
                    HStack(alignment: .bottom, spacing: 8) {
                        Circle()
                            .fill(Color.accentColor.opacity(0.18))
                            .frame(width: 32, height: 32)
                            .overlay(
                                Text(initials(for: comment.userId))
                                    .font(.caption)
                                    .foregroundColor(.accentColor)
                            )
                        VStack(alignment: .leading, spacing: 4) {
                            Text(comment.text)
                                .padding(10)
                                .background(Color(.systemGray5).opacity(0.8))
                                .cornerRadius(12)
                                .foregroundColor(.primary)
                            Text(comment.timestamp, style: .time)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .animation(.easeInOut, value: viewModel.filteredComments.count)

            // Comment Input
            HStack(spacing: 8) {
                TextField("Add a comment...", text: $commentText)
                    .textFieldStyle(PlainTextFieldStyle())
                    .padding(10)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color.accentColor.opacity(0.15), lineWidth: 1)
                    )
                Button(action: {
                    guard !commentText.trimmingCharacters(in: .whitespaces).isEmpty else { return }
                    withAnimation {
                        viewModel.addComment(text: commentText)
                        commentText = ""
                    }
                }) {
                    Image(systemName: "paperplane.fill")
                        .font(.title3)
                        .foregroundColor(commentText.trimmingCharacters(in: .whitespaces).isEmpty ? .gray : .accentColor)
                        .padding(8)
                        .background(Color.accentColor.opacity(commentText.trimmingCharacters(in: .whitespaces).isEmpty ? 0.08 : 0.18))
                        .clipShape(Circle())
                }
                .disabled(commentText.trimmingCharacters(in: .whitespaces).isEmpty)
                .animation(.easeInOut, value: commentText)
            }
        }
        .padding(.vertical)
        .padding(.horizontal, 2)
    }

    // Helper to get initials from userId (for demo)
    func initials(for userId: String) -> String {
        let comps = userId.split(separator: " ")
        if comps.count > 1 {
            return comps.compactMap { $0.first }.prefix(2).map { String($0) }.joined().uppercased()
        } else {
            return String(userId.prefix(2)).uppercased()
        }
    }
}