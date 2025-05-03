---

# 🌾 Revin Krishi: Task Scheduling & Analytics Dashboard

A full-stack agricultural project management platform designed for **Revin Techno Solutions Pvt. Ltd.** to help visualize, manage, and schedule farm-related projects and tasks.
![image](https://github.com/user-attachments/assets/6b389b3e-2419-44a9-bfb7-1b5e405e10b9)

Built with:
- ⚙️ **Django REST Framework** (Backend)
- ⚛️ **Next.js** (Frontend)
- 🍃 **Postgres** (Database)
- 📊 **Chart.js / Recharts** (Visualization)

---

## 📌 Project Structure

```
revin-krishi/
├── farm-backend/          # Django REST Framework APIs
│   ├── models/       # MongoEngine models for Farms, Fields, Projects, Tasks
│   ├── serializers/
│   ├── views/
│   └── urls.py
├── farm-dashboard/         # Next.js frontend dashboard
│   ├── components/
│   ├── pages/
│   └── utils/
├── .gitignore
└── README.md
```

---

## 🚀 Features

### 1. 🧑‍🌾 User Dashboard
- Total Counts: Farms, Fields, Crops, Projects
- Upcoming Harvests & Tasks (Calendar View)
- Task Status Overview (Pending | In Progress | Completed)
- Charts via **Chart.js** / **Recharts**

### 2. 📅 Project Scheduling System
- Create and assign Projects with:
  - Title, Description, Deadline
  - Assigned Farm/Field
- Calendar View of Scheduled Tasks
- Assign tasks to Farm Managers / Field Workers
- Full CRUD on Projects and Tasks

### 3. 🗓️ Calendar Integration
- View all scheduled tasks and deadlines
- Clickable events for task details
- Dynamic updates via API

### 4. ✅ Task Status Management
- Update project status: Pending / In Progress / Completed
- Filter projects by:
  - Status
  - Farm
  - Assigned User

---

## 🔧 Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | Next.js, React, Tailwind CSS      |
| Backend   | Django REST Framework             |
| Database  | MongoDB (via Djongo / MongoEngine)|
| Charts    | Chart.js, Recharts                |
| Calendar  | FullCalendar / React Big Calendar |

---

## 📦 Installation

### 🔙 Backend (DRF + Postgres)
```bash
cd farm-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 🔜 Frontend (Next.js)
```bash
cd farm-dashboard
pnpm install
pnpm run dev
```

---

## 🧪 API Endpoints (Sample)

| Endpoint                    | Method | Description                    |
|----------------------------|--------|--------------------------------|
| `/api/farms/`              | GET    | List all farms                 |
| `/api/projects/`           | POST   | Create new project             |
| `/api/tasks/?status=done`  | GET    | Filter tasks by status         |
| `/api/calendar/events/`    | GET    | Get all task events for calendar |

---

## 📽️ Submission Checklist

- [x] ✅ Functional Dashboard with charts
- [x] ✅ CRUD for Projects & Tasks
- [x] ✅ Calendar View with interactive tasks
- [x] ✅ Status filtering and updating
- [x] ✅ Demo video
- [x] ✅ Presentation slides
- [x] ✅ GitHub repository

---

## 🎥 Demo & Slides

- 🔗 [Demo Video](https://youtu.be/0n1xrnRJNFg)
- 📑 [Presentation Slides](https://youtu.be/QBIlkYHYtFY)

---



## 🙌 Acknowledgement

Thank you for the opportunity to demonstrate my skills and creativity.  
Looking forward to contributing to the vision of **Revin Krishi**.

---
