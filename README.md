# Easy Explore - Frontend Application

[Live Demo](https://prj-566-ncc-team3.vercel.app)  
[Backend API Repository](https://github.com/Ashwin-BN/PRJ566NCC-Team3-user-api)

---

## Project Overview

Easy Explore is a modern, responsive web application designed to help users discover, plan, and share travel itineraries with ease. Built with Next.js and React, it provides interactive search, personalized recommendations, map integrations, collaborative itinerary management, and social features.

---

## Features

- Location-based search with filters for attraction types
- Interactive map with pins for search results
- User authentication and profile management (via backend API)
- Save favorite attractions and build travel itineraries
- Collaborator management for shared itinerary editing
- Reviews and ratings for attractions
- Dark mode and responsive UI for optimal user experience
- Seamless deployment on Vercel with continuous integration

---

## Technology Stack

- **Frontend:** Next.js (React), Bootstrap 5, React Bootstrap  
- **State Management:** React Context API  
- **Maps:** Leaflet.js with React-Leaflet integration  
- **Styling:** CSS Modules  
- **Other Libraries:** Framer Motion, React Toastify, JWT Decode  
- **Backend:** Separate Node.js/Express API (see backend repo)  
- **Deployment:** Vercel

---

## Installation & Setup

### Prerequisites

- Node.js (v18 or above recommended)
- npm (comes with Node.js)
- Access to the backend API ([backend repo](https://github.com/Ashwin-BN/PRJ566NCC-Team3-user-api))

---

### Production Setup (Running the Deployed App)

Access the live web app at:  
[https://prj-566-ncc-team3.vercel.app](https://prj-566-ncc-team3.vercel.app)

---

### Development Setup (Local Environment)

1. **Clone the repository:**

```bash
git clone https://github.com/Ashwin-BN/PRJ566NCC-Team3.git
cd PRJ566NCC-Team3
````

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_API_BASE_URL=<backend-api-base-url>
NEXT_PUBLIC_OTHER_ENV_VARS=<values-as-needed>
```

> Replace `<backend-api-base-url>` with your running backend API URL (e.g., `http://localhost:5000/api`)

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

### Build and Start for Production (Local)

```bash
npm run build
npm start
```

---

## Usage

* Use the search bar to find attractions by keyword, location, or category.
* View attractions on the interactive map and save favorites.
* Create, edit, and share personalized itineraries.
* Register and log in to access full features.
* Manage profile and collaborate with friends on trip planning.
* Toggle dark mode for comfortable viewing.

---

## Known Deviations from PRJ566 Proposal

* The backend API was split into a separate repository for better modularity and maintainability.
* Calendar sync feature was postponed due to API integration constraints.
* Some UI/UX enhancements (e.g., animation refinements) were deferred to future sprints.

---

## Running on a Public Server

The frontend is deployed on Vercel at the URL above. To run locally against the production backend:

* Ensure environment variable `NEXT_PUBLIC_API_BASE_URL` points to the production backend API URL.
* Test accounts for demo:

| Email  | Password  |
| --------- | --------- |
| demoUser1@gmail.com | DemoPass1@ |

---

## Contribution Guidelines

Please refer to the [backend repo](https://github.com/Ashwin-BN/PRJ566NCC-Team3-user-api) for API contribution details. Frontend contributions should follow standard React/Next.js practices and ESLint formatting rules.

---

## Contact

For issues, please open an issue on the GitHub repo or contact the project maintainer:

* Ashwin BN — [ashwin@example.com](mailto:ashwin@example.com)

---

## License

MIT License © 2025 Easy Explore Team

````

---

# WALKTHROUGH.md

```markdown
# Easy Explore - Frontend Application Walkthrough

## Introduction

Welcome to the Easy Explore frontend walkthrough. This document will guide you through the main components, architecture, and usage of the frontend application.

---

## Application Structure

- **Pages:**  
  - `/index.js` - Home and search landing page  
  - `/search.js` - Search results page with filters and map  
  - `/attraction/[id].js` - Detailed attraction information  
  - `/profile.js` and `/profile/[username]` - User profile and reviews  
  - `/itinerary.js` - Itinerary builder and management  
  - `/login.js` and `/register.js` - Authentication pages  

- **Components:**  
  - `AttractionCard` — Displays individual attraction info  
  - `AttractionMap` — Interactive map showing attraction pins  
  - `ItineraryForm` — Create or edit itineraries  
  - `CollaboratorManager` — Manage collaborators on itineraries  
  - `DarkModeToggle` — Toggle UI theme  
  - `Navbar` — Main navigation bar  
  - `ReviewStrip` and `Reviews` — User reviews and ratings  
  - `SearchBar` — Input for searching attractions  
  - `Suggestion` — Pre-search recommendations  
  - `VisitedPlacesPicker` — Select visited places for personalization  

- **Context:**  
  - `ThemeContext` — Manages dark/light mode state globally  

- **Controllers and Libs:**  
  - API calls and authentication logic separated into `controller` and `lib` folders  

---

## User Flow Overview

1. **Landing / Search:**  
   User lands on the homepage or search page. They can input keywords or select filters to find attractions. Results appear as a list and on a map.

2. **Attraction Details:**  
   Clicking an attraction card navigates to the detailed page with images, descriptions, reviews, and rating options.

3. **Authentication:**  
   Users can register or log in to access personalized features such as saving favorites and creating itineraries.

4. **Itinerary Management:**  
   Authenticated users can create, edit, share, and collaborate on travel itineraries.

5. **Profile and Social Features:**  
   Users can view and edit their profile, see their reviews, and explore other users’ itineraries.

6. **Dark Mode:**  
   Users can toggle dark/light mode to enhance UI comfort.

---

## Key Functionalities

- **Map Integration:**  
  Built with Leaflet and React-Leaflet, showing attractions with custom markers.

- **Personalized Recommendations:**  
  Suggestions based on user location and preferences.

- **Collaboration:**  
  Multiple users can share and edit itineraries in real-time.

- **Instant Feedback:**  
  Toast notifications inform users of successful actions or errors.

---

## Development Setup Summary

- Requires Node.js and npm installed.
- Clone repo, run `npm install` to install dependencies.
- Set environment variables in `.env.local`.
- Run `npm run dev` to start the local dev server.
- The frontend communicates with the backend API for all data operations.

---

## Deployment Notes

- The app is deployed on Vercel, with CI/CD linked to GitHub.
- Environment variables configured in Vercel dashboard.
- Backend API endpoints must be accessible from the deployed frontend.

---

## Testing & Quality Assurance

- Linting is enabled using ESLint with Next.js config (`npm run lint`).
- Unit and integration tests use Jest and React Testing Library.
- Ensure tests pass before merging any pull requests.

---

## Known Limitations and Future Enhancements

- Calendar sync integration is pending backend API support.
- Offline mode is not currently supported.
- Accessibility improvements are ongoing.

---

## Contact & Support

For support or questions, contact Ashwin BN: ashwin@example.com  
Or submit an issue on the GitHub repo.

---

Thank you for exploring Easy Explore!