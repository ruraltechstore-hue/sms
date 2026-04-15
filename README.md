# 🎓 EduManager — School Management System

A comprehensive, modern school management platform built with React, TypeScript, and Tailwind CSS. EduManager streamlines every aspect of school administration — from admissions to exams, fees to parent communication.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

---

## ✨ Features at a Glance

| Module | Highlights |
|--------|-----------|
| **Admissions** | Multi-step enrollment forms, document uploads, class allocation, student profiles |
| **Attendance** | QR-based marking, calendar heatmaps, analytics charts, smart scheduling |
| **Fee Management** | Payment tracking, fee structures, receipts, collection analytics, late-fee automation |
| **Exams & Results** | Exam scheduling, grade entry, auto-generated report cards, performance analytics |
| **Staff & HR** | Staff directory, department grid, leave tracker, profile management |
| **Messaging** | School-wide announcements, group chat, notification center with read/unread tracking |
| **Parent Portal** | Child progress tracking, fee status, attendance view, direct communication |
| **Settings** | School profile, academic year config, notification preferences, theme customization |
| **Dashboard** | Role-based views (Admin/Teacher/Student/Parent), real-time charts, cross-module analytics |

---

## 🛠 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3 + shadcn/ui component library
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Routing:** React Router DOM v6
- **State:** React Query (TanStack Query) + React Context
- **Icons:** Lucide React
- **Notifications:** Sonner toast library

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd edumanager

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@school.com` | `password` |
| Teacher | `teacher@school.com` | `password` |
| Student | `student@school.com` | `password` |
| Parent | `parent@school.com` | `password` |

Each role provides a tailored dashboard experience with relevant modules and data.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── admissions/      # Enrollment forms, student tables & profiles
│   ├── attendance/      # Marking, calendar, charts
│   ├── exams/           # Scheduling, grading, report cards, analytics
│   ├── fees/            # Structures, payments, receipts, analytics
│   ├── landing/         # Hero, features, testimonials, CTA, footer
│   ├── messaging/       # Announcements, group chat, notifications
│   ├── parent/          # Child progress, fees, attendance, communication
│   ├── settings/        # School profile, academic year, theme
│   ├── staff/           # Directory, departments, leave tracking
│   └── ui/              # shadcn/ui primitives (button, card, dialog…)
├── lib/                 # Mock data, auth context, utilities
├── pages/               # Route-level page components
├── hooks/               # Custom React hooks
└── index.css            # Design tokens & global styles
```

---

## 🎨 Design System

- **Theming:** HSL-based CSS custom properties with full dark mode support
- **Typography:** Custom `heading` and `body` font families
- **Animations:** Shimmer, pulse, scale-in, fade-in keyframes + Framer Motion transitions
- **Micro-interactions:** `.hover-lift`, `.active-press`, `.hover-glow` utility classes

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
