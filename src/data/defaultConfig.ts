export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  entities: Array<{
    name: string;
    fields: Array<{
      name: string;
      type: string;
      constraints?: string[];
      options?: string[];
      default?: string;
      reference?: string;
    }>;
  }>;
  pages: Array<{
    name: string;
    path: string;
    layout: string;
    components: Array<{
      type: string;
      props?: Record<string, any>;
      children?: Array<{
        type: string;
        props?: Record<string, any>;
      }>;
    }>;
  }>;
  workflows?: Array<{
    name: string;
    trigger: string;
    condition?: string;
    actions: string[];
  }>;
}

export const defaultConfig: AppConfig = {
  app: {
    name: "Task Manager",
    version: "1.0.0",
    description: "A simple task management application"
  },
  entities: [
    {
      name: "User",
      fields: [
        { name: "id", type: "uuid", constraints: ["primary", "auto"] },
        { name: "email", type: "string", constraints: ["required", "unique"] },
        { name: "name", type: "string", constraints: ["required"] },
        { name: "role", type: "enum", options: ["admin", "user"], default: "user" },
        { name: "createdAt", type: "datetime", constraints: ["auto"] }
      ]
    },
    {
      name: "Project",
      fields: [
        { name: "id", type: "uuid", constraints: ["primary", "auto"] },
        { name: "title", type: "string", constraints: ["required"] },
        { name: "description", type: "text" },
        { name: "status", type: "enum", options: ["active", "archived"], default: "active" },
        { name: "ownerId", type: "uuid", reference: "User.id" },
        { name: "createdAt", type: "datetime", constraints: ["auto"] }
      ]
    },
    {
      name: "Task",
      fields: [
        { name: "id", type: "uuid", constraints: ["primary", "auto"] },
        { name: "title", type: "string", constraints: ["required"] },
        { name: "description", type: "text" },
        { name: "priority", type: "enum", options: ["low", "medium", "high", "critical"], default: "medium" },
        { name: "status", type: "enum", options: ["todo", "in_progress", "done"], default: "todo" },
        { name: "projectId", type: "uuid", reference: "Project.id" },
        { name: "assigneeId", type: "uuid", reference: "User.id" },
        { name: "dueDate", type: "date" },
        { name: "createdAt", type: "datetime", constraints: ["auto"] },
        { name: "updatedAt", type: "datetime", constraints: ["auto"] }
      ]
    }
  ],
  pages: [
    {
      name: "Dashboard",
      path: "/",
      layout: "dashboard",
      components: [
        { type: "heading", props: { text: "Task Dashboard", level: 1 } },
        { type: "columns", props: { count: 3 }, children: [
          { type: "card", props: { title: "Total Tasks", source: "Task", aggregate: "count" } },
          { type: "card", props: { title: "In Progress", source: "Task", aggregate: "count", filter: { status: "in_progress" } } },
          { type: "card", props: { title: "Completed", source: "Task", aggregate: "count", filter: { status: "done" } } }
        ]},
        { type: "chart", props: { type: "bar", source: "Task", xField: "status", yField: "count" } }
      ]
    },
    {
      name: "Tasks",
      path: "/tasks",
      layout: "list",
      components: [
        { type: "heading", props: { text: "All Tasks", level: 1 } },
        { type: "table", props: { source: "Task", columns: ["title", "priority", "status", "dueDate"], actions: ["edit", "delete"] } }
      ]
    },
    {
      name: "New Task",
      path: "/tasks/new",
      layout: "form",
      components: [
        { type: "heading", props: { text: "Create Task", level: 1 } },
        { type: "form", props: { source: "Task", submitText: "Create Task", fields: ["title", "description", "priority", "status", "projectId", "assigneeId", "dueDate"] } }
      ]
    }
  ],
  workflows: [
    { name: "Task Created", trigger: "Task.onCreate", actions: ["sendNotification", "logActivity"] },
    { name: "Task Status Changed", trigger: "Task.onUpdate", condition: "status changed", actions: ["sendNotification", "logActivity"] },
    { name: "Project Archived", trigger: "Project.onUpdate", condition: "status = archived", actions: ["validateData", "logActivity"] }
  ]
};
