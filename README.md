Task Manager
A robust, AI-powered Task Management application built with MetaForge. This application provides a complete system for tracking projects and individual tasks, featuring automated status workflows and a comprehensive dashboard.

🚀 OverviewThe 
Task Manager is designed to streamline team productivity by offering centralized project tracking, status reporting, and automated notifications.

Core FeaturesDynamic Dashboard: 
Real-time visualization of task status (Total, In Progress, Completed) and productivity analytics.Comprehensive Task Management: Create, track, edit, and delete tasks with ease.
Automated Workflows: 
Intelligent triggers for task creation, status updates, and project archiving.
Structured Data: 
Integrated management of Users, Projects, and Tasks with enforced constraints.
📊 Data Schema
Entity,Description,Key Fields
User,System users,"email, role, createdAt"
Project,Organizational grouping,"title, status, ownerId"
Task,Trackable items,"title, priority, status, dueDate"
⚙️ Workflows
The application includes automated logic to keep your team informed:

Task Lifecycle: Automatic notifications and activity logging upon task creation and updates.

Project Integrity: Automated data validation and logging when a project is archived.

🛠️ Tech Stack
Runtime: MetaForge Runtime v1.0

Configuration: JSON-driven architecture for rapid iteration and deployment.
