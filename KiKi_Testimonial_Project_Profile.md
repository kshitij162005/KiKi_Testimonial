# KiKi Testimonial — Project Profile

## Overview
- Customer testimonial collection platform with public feedback pages ("Spaces") per organization.
- Supports text and video feedback, optional star ratings, and rich analytics.
- Users create spaces with custom questions and share a public URL to collect responses.
- Built as a modern MERN application with a polished dark-themed design system.

## Live & Base URLs
- Frontend (production origin): `https://kiki-testimonial-client.vercel.app`
- Backend (default production base): `https://kiki-testimonial-backend.vercel.app`
- Dev API base: `http://localhost:3000` (configurable via `VITE_API_BASE_URL`).

## Tech Stack
- Frontend: `React 18`, `Vite 5`, `Tailwind CSS 3`, `Radix UI`, `lucide-react`, `react-icons`, `framer-motion`, `react-hook-form`, `react-router-dom 6`, `zod`, `js-cookie`.
- Testing: `Vitest 3`, `@testing-library/react`, `@testing-library/jest-dom`, `user-event`, `jsdom`.
- Tooling: `ESLint`, `Tailwind plugins (forms, typography)`, `@vitejs/plugin-react`.
- Backend: `Node.js`, `Express 4`, `MongoDB`, `Mongoose 8`, `JWT`, `bcrypt`, `multer`, `Cloudinary v2`, `nodemailer` (Gmail), `cors`, `dotenv`.
- Deployment: `Vercel` for client and serverless backend; explicit CORS headers and rewrites.

## Key Frontend Features
- Landing Page: Product value props, animated backgrounds, CTA to sign up/login.
- Auth: SignUp and Login pages with validations, loader, modals, success/error states.
- Dashboard: List spaces for an organization; grid/list toggle; copy links; quick stats; sentiment analysis UI component.
- Create Space: New and legacy forms to configure space name, `publicUrl`, header, message, questions, star ratings, image upload.
- Space Page (Public): Feedback submission UI (name, email, answers, optional rating) mapped to backend by `publicUrl`.
- Space Details: Per-space analytics (counts, rating distribution), activation toggle, sharing/copy link, links collection.
- Profile: Fetch/update user details, profile image preview/upload.
- API Docs Page: Base URL awareness, endpoint examples, one-click copy.
- Design System: Tailwind dark theme tokens, glass UI, modern components (`Card`, `Button`, `Input`, `EditableField`, `StarRating`, `AnimatedBackground`).

## Backend APIs (selected)
- Auth: `POST /SignUp`, `POST /login`, `POST /forget-password`, `PUT /reset-password`.
- Users: `GET /users`, `GET /user/:id`, `PUT /user/:id`.
- Spaces: `POST /addSpace` (image upload), `GET /getSpaces`, `GET /getSpacesByUserId/:userId`, `GET /space/:publicUrl`, `PUT /space/:publicUrl/update`, `PUT /space/:publicUrl/activation`, `POST /space/:publicUrl/addLink`.
- Feedback: `POST /space/:publicUrl/feedback`, `GET /space/:publicUrl/feedbackDetails`, `GET /space/:publicUrl/feedbackCounts`, `GET /space/:publicUrl/analytics/ratings`.
- Organization: `GET /api/organization/:userId/feedbacks`, `GET /api/organization/:userId/space/:publicUrl/feedbacks`.
- Uploads: `POST /upload` (image), `POST /uploadVideo` (video, Cloudinary `resource_type: video`).

## Data Model
- User: `{ firstName, lastName, email (unique), phoneNum, password, otp?, otpExpiration? }`.
- Space: `{ spacename, publicUrl (unique), headerTitle?, customMessage?, questions[], starRatings (bool), isActive (bool), createdAt, user_Id (ref User), feedback[], links[], img? }`.
- Feedback (embedded in Space): `{ name, email, rating (1–5?), responses[{ question, answer }], feedbackType ('text'|'video'), video?, submittedAt }`.

## Architecture Notes
- Routing: Client `react-router-dom` pages for `/`, `/signup`, `/login`, `/dashboard`, `/create-space`, `/:publicUrl`, `/space-details`, `/profile`, `/reset-password`, `/api-docs`.
- API Base: Auto-detects prod/dev in `src/config/api.js`; endpoints constructed from `API_BASE_URL`.
- CORS: Server allows multiple origins or `CORS_ORIGIN` env; preflight handled; Vercel headers also set to allow the client domain.
- Media: `multer` disk storage (5MB, jpg/jpeg/png/mp4), uploaded to Cloudinary; video uploads use `resource_type: 'video'`.
- Auth: JWT issued on signup/login (email payload, 1h expiry). Note: routes do not currently enforce JWT via middleware; protected endpoints rely on user context parameters.

## Setup & Run
- Frontend: `cd Client && npm install && npm run dev` (runs on `http://localhost:5173`).
- Backend: `cd Server && npm install && npm run dev` or `npm start`.
- Env (Client): `.env` → `VITE_API_BASE_URL` to point at backend.
- Env (Server): `.env` → `DATABASE_URI`, `JWT_SECRET`, `EMAIL_SERVICE`, `EMAIL_PASSWORD`, `CLOUDINARY_*`, `PORT`, `CORS_ORIGIN`, optional `TWILIO_*`.
- Deployment: Client `vercel.json` rewrite to `index.html`; Server `vercel.json` routes all to `server.js` with CORS headers.

## Testing
- Commands: `npm run test` or `npm run test:run` in `Client`.
- Examples: `Footer` tests (brand, links, accessibility, responsive classes). `Dashboard` navigation test mocks `useNavigate` and components.

## Resume Highlights
- Designed and built a full-stack testimonial platform with React + Express + MongoDB.
- Implemented dynamic space creation with custom questions, public URLs, and optional star ratings.
- Delivered feedback analytics (counts, rating distribution) and organization-level APIs.
- Integrated secure media pipeline using `multer` + `Cloudinary` for images and videos.
- Shipped a responsive, accessible, dark-themed UI with a reusable component library.
- Set up environment-aware API config, Vercel deployments, and CORS for cross-origin reliability.
- Added testing with Vitest + Testing Library to validate key UI flows.