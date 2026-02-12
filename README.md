# ALX Nexus - SmartRecruiters Job Board

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SmartRecruiters](https://img.shields.io/badge/SmartRecruiters-Enterprise-0055DA?style=flat&logo=smartrecruiters&logoColor=white)](https://www.smartrecruiters.com/)

ALX Nexus is a premium, enterprise-grade job board platform integrated with the **SmartRecruiters** ecosystem. Built with a focus on high-fidelity UI and robust data integration, it provides a seamless experience for freelancers to discover opportunities and employers to manage high-volume recruitment pipelines.

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔌 SmartRecruiters Integration](#-smartrecruiters-integration)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🏗️ Architecture](#️-architecture)
- [🌐 Performance & SEO](#-performance--seo)
- [🚢 Deployment](#-deployment)

---

## 🎯 Overview

The platform serves as a modern bridge between talent and global opportunities. By leveraging the **SmartRecruiters Posting and Candidate APIs**, we ensure that every job listed is live, verifiable, and manageable through an industry-standard ATS (Applicant Tracking System).

### Strategic Value

- **Enterprise-Grade Data**: Direct integration with SmartRecruiters ensures data integrity.
- **Unified Experience**: Seamless transition from job discovery to application submission.
- **Reactive Architecture**: High-performance filtering and real-time state management.

---

## ✨ Key Features

### For Freelancers & Candidates

- **Smart Search**: Reactive filtering system by job type, experience level, and remote status.
- **Rich Job Profiles**: High-fidelity job detail pages with rendered HTML descriptions and technical requirements.
- **Application Hub**: Track submitted applications and manage professional profiles.
- **Safe Filtering**: Instant search results without manual page refreshes.

### For Employers & Organizations

- **Management Dashboard**: Comprehensive overview of live postings and candidate volume.
- **Job Creation Wizard**: Direct job creation into the SmartRecruiters ecosystem with automated default mapping.
- **Candidate Analytics**: Visualized recruitment metrics and application trends.
- **Profile Manager**: Curate company identity and branding.

---

## 🛠️ Tech Stack

| Technology        | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| **Next.js 14**    | Production-grade React framework with SSR capabilities |
| **TypeScript**    | Strict type safety across the entire API layer         |
| **Tailwind CSS**  | Premium glassmorphism and dark-mode aesthetic          |
| **Redux Toolkit** | Global state management for auth and user preferences  |
| **React Query**   | Intelligent server-state caching and synchronization   |
| **Axios**         | Robust HTTP client with SmartRecruiters interceptors   |
| **Lucide React**  | Modern, consistent iconography                         |

---

## 🔌 SmartRecruiters Integration

ALX Nexus utilizes three core SmartRecruiters API layers:

1.  **Posting API**: Public access for job discovery and retrieval.
2.  **Job API**: Secured management layer for creating and updating job records.
3.  **Application API**: Enterprise bridge for candidate submissions and recruitment workflow.

### Security & Throttling

- **X-SmartToken**: Secured management access.
- **Automatic Rate Limiting**: Intelligent request queuing to prevent API lockout.
- **Sanitization Layer**: Automated HTML stripping for clean previews and safe rendering.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- SmartRecruiters API Key (X-SmartToken)
- SmartRecruiters Company ID

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/JesutofunmiOludu/alx-nexus-projectFE.git
   cd alx-nexus-projectFE/job_board
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_SMARTRECRUITERS_API_KEY=your_token_here
   NEXT_PUBLIC_SMARTRECRUITERS_COMPANY_ID=your_company_id
   NEXT_PUBLIC_APP_ENV=development
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
job_board/
├── api/                # SmartRecruiters client & service layer
├── components/         # Premium UI component library
├── config/             # Environment & service configurations
├── hooks/              # Custom data-fetching hooks (React Query)
├── lib/                # Utility functions & HTML sanitizers
├── pages/              # Next.js file-based routing
├── store/              # Redux logic & slices
└── types/              # Unified TypeScript interfaces
```

---

## 🏗️ Architecture

### Data Mapping Layer

We use a sophisticated mapping system to translate SmartRecruiters' complex response objects (UUIDs, structured sections, nested objects) into a flat, predictable `Job` interface used throughout the frontend.

### Reactive State

Search filters use a **Side-Effect-Free** pattern where filter changes trigger immediate, cached API calls via React Query, ensuring the UI stays perfectly in sync with the live data source.

---

## 🌐 Performance & SEO

- **Image Optimization**: Automatic scaling and WebP conversion.
- **HTML Sanitization**: Custom DOM-based stripping for sub-optimal API data.
- **Lazy Loading**: Component-level code splitting for faster initial paint.

---

## 🚢 Deployment

Optimized for **Vercel** deployment with automated CI/CD:

1. Fork/Clone the repo.
2. Connect to Vercel.
3. Add SmartRecruiters keys as Environment Variables.
4. Deploy!

---

Developed as part of the **ALX Nexus Project** by **Jesutofunmi Oludu**.
