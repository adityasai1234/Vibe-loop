import SwiftUI

struct TaskCreationView: View {
    @State private var title: String = ""
    @State private var details: String = ""
    @State private var assignedTo: String = ""
    @State private var teamId: String = ""
    @State private var recurrence: RecurrenceRule = .none
    @State private var recurrenceEndDate: Date = Date()
    
    // Mock data for users and teams
    let users = ["demoUser1", "demoUser2", "demoUser3"]
    let teams = ["team1", "team2"]
    
    var body: some View {
        Form {
            Section(header: Text("Task Details")) {
                TextField("Title", text: $title)
                TextField("Details", text: $details)
            }
            Section(header: Text("Assign To")) {
                Picker("User", selection: $assignedTo) {
                    Text("None").tag("")
                    ForEach(users, id: \.self) { user in
                        Text(user).tag(user)
                    }
                }
                Picker("Team", selection: $teamId) {
                    Text("None").tag("")
                    ForEach(teams, id: \.self) { team in
                        Text(team).tag(team)
                    }
                }
            }
            Section(header: Text("Recurrence")) {
                Picker("Recurrence", selection: $recurrence) {
                    ForEach(RecurrenceRule.allCases, id: \.self) { rule in
                        Text(rule.rawValue.capitalized).tag(rule)
                    }
                }
                if recurrence != .none {
                    DatePicker("End Date", selection: $recurrenceEndDate, displayedComponents: .date)
                }
            }
            Button("Create Task") {
                let newTask = Task(
                    id: UUID().uuidString,
                    title: title,
                    details: details,
                    status: .pending,
                    createdAt: Date(),
                    updatedAt: nil,
                    assignedTo: assignedTo,
                    reviewedBy: nil,
                    score: nil,
                    teamId: teamId.isEmpty ? nil : teamId,
                    recurrence: recurrence,
                    recurrenceEndDate: recurrence == .none ? nil : recurrenceEndDate
                )
                print("Created Task: \(newTask)")
            }
            .buttonStyle(.borderedProminent)
        }
        .navigationTitle("Task Creation")
    }
}
// still solving some basic errors 