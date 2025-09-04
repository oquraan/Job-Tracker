# Lab 11: Job Tracker with AI Features

## Objective
Build a React application where users can register/login and manage their job applications using **Firebase Firestore**.  
Users can **create, read, update, delete (CRUD)** and **filter** applications by status.  

### Application Statuses:
- Applied
- Interview
- Rejected
- Hired

The app uses **Redux Toolkit** for state management and **Redux Persist** for local persistence.

---

## Features
### Core Features
- **Authentication** – Register/Login with Firebase Auth.
- **Job Applications CRUD** – Add, edit, delete, and list job applications in Firestore.
- **Filtering** – Filter applications by status (Applied, Interview, Rejected, Hired).
- **Persistent State** – Redux Persist keeps state after refresh.
- **UI Components** – Modern React components styled with Material UI or Tailwind CSS.

### AI Features
- **CV Analysis & Job Matching** – Analyze candidate CVs and job descriptions.
- **Suitability Score** – Calculate how well a candidate matches a job role.
- **Keyword Suggestions** – Recommend essential keywords to improve CV visibility.
- **Areas for Development** – Highlight skills or experiences the candidate needs to strengthen.
- **Professional Email Draft** – Generate a polite, confident email to HR if suitability is partial.
- **Application Status Analysis** – Count applications per status and provide a motivational summary:
