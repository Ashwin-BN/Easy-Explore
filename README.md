# Easy Explore - Frontend Application

[Live Demo](https://prj-566-ncc-team3.vercel.app)  
[Backend API Repository](https://github.com/Ashwin-BN/PRJ566NCC-Team3-user-api)  
[User Walkthrough Guide](./WALKTHROUGH.md)

---

## Project Overview

**Easy Explore** is a modern, responsive web platform that helps tourists and locals efficiently plan trips, discover attractions, and share itineraries. It combines location-based search, interactive maps, collaborative planning, and personalized recommendations to simplify travel experiences.

This project aligns with the **SRS (Software Requirements Specification)** goals:

- Personalized travel planning based on user preferences.
- Advanced filters and itinerary optimization.
- Real-time updates on attraction availability and hours.
- Scalable and responsive web design for cross-device access.

---

## Features

- Location-based search with filters (keywords, categories, proximity, budget)
- Interactive map with custom pins for attractions
- User authentication and profile management via backend API
- Save favorite attractions and build travel itineraries
- Real-time collaborative itinerary editing
- Reviews and ratings for attractions
- Dark mode and fully responsive UI
- Seamless deployment via Vercel

---

## Technology Stack

- **Frontend:** Next.js (React), Bootstrap 5, React-Bootstrap  
- **State Management:** React Context API  
- **Maps:** Leaflet.js + React-Leaflet  
- **Styling:** CSS Modules  
- **Libraries:** Framer Motion, React Toastify, JWT Decode  
- **Backend:** Node.js/Express API (separate repo)  
- **Deployment:** Vercel

---

## Installation & Setup

### Prerequisites

- Node.js v18+
- npm
- Access to backend API ([repo link](https://github.com/Ashwin-BN/PRJ566NCC-Team3-user-api))

### Running the Deployed App

Visit: [https://prj-566-ncc-team3.vercel.app](https://prj-566-ncc-team3.vercel.app)

### Development Setup (Local)

1. Clone the repository:

```bash
git clone https://github.com/Ashwin-BN/PRJ566NCC-Team3.git
cd PRJ566NCC-Team3
````

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL="https://prj-566-ncc-team3-user-api.vercel.app/api"
# For local development, you can uncomment:
# NEXT_PUBLIC_API_URL="http://localhost:8080/api"

OPENTRIPMAP_API_KEY=<your-opentripmap-api-key>
GEOAPIFY_KEY=<your-geoapify-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

4. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

* Search for attractions by keyword, location, or filters.
* View attractions on the map and save favorites.
* Create, edit, and share personalized itineraries.
* Collaborate with friends on trips in real-time.
* Manage profile settings and toggle dark mode.

For a detailed step-by-step user guide with screenshots, see: [WALKTHROUGH.md](./WALKTHROUGH.md)

---

## Project Structure

The Easy Explore frontend is organized for modularity, maintainability, and scalability. Below is an overview of the key directories and files:

```

PRJ566NCC-Team3/
│
├── **README.md**                # Project overview and setup
├── **WALKTHROUGH.md**           # User guide with screenshots
├── **components/**              # Reusable UI components
│   ├── AttractionCard/          # Card to display attraction info
│   ├── AttractionMap/           # Interactive map component
│   ├── CollaboratorManager/     # Manage itinerary collaborators
│   ├── DarkModeToggle.js        # Dark/light mode toggle
│   ├── ItineraryForm/           # Form to create/edit itineraries
│   ├── ItineraryList/           # List of itineraries
│   ├── ItineraryModal/          # Modal for itinerary details
│   ├── Navbar/                  # Navigation bar
│   ├── ProfileEditModal/        # Edit user profile
│   ├── ReviewStrip/             # Display summarized reviews
│   ├── Reviews/                 # Review submission and display
│   ├── SearchBar/               # Search input component
│   ├── StarRating.js            # Rating component
│   ├── Suggestion/              # Pre-search recommendations
│   └── VisitedPlacesPicker/     # Select visited places for personalization
│
├── **context/**                 # Global React context (ThemeContext)
├── **controller/**              # API interaction logic
│   ├── attractionController.js
│   ├── itineraryController.js
│   └── profileController.js
├── **doc/**                     # Documentation (SRS, project docs)
├── **lib/**                     # Helper functions and libraries
│   ├── authentication.js
│   ├── mongodb.js
│   ├── reviewApi.js
│   └── toast.js
├── **pages/**                   # Next.js pages (routes)
│   ├── \_app.js / \_document.js   # Next.js app setup
│   ├── index.js                 # Home/Search landing page
│   ├── search.js                # Search results page
│   ├── attraction/\[id].js       # Attraction details page
│   ├── profile.js / profile/\[username]/
│   ├── itinerary.js             # Itinerary builder
│   ├── login.js / register.js   # Authentication pages
│   ├── savedAttractions.js
│   └── shared-itinerary/\[itineraryId].js
├── **public/**                  # Static assets (images, icons, Leaflet)
├── **styles/**                  # CSS modules for pages and global styles
├── package.json                 # Project dependencies
└── next.config.mjs              # Next.js configuration

```

## Deviations from SRS

While the project largely follows the initial SRS, the following deviations were made due to API limitations, scope, or prioritization:

1. **Business Owner Feature:** The ability for business owners to list attractions was not implemented, as Phase 1 focuses on user-side functionality.
2. **Advanced Filters:** Budget and transportation-based filters were omitted because the public API does not provide this data.
3. **Real-Time Updates:** Attraction availability, operating hours, and transportation options cannot be updated in real-time due to API constraints.
4. **UI Adjustments:** Some UI fixes were made, and the application is not bilingual yet.

---

## Known Limitations

* Google Maps API costs limit real-time query usage, restricting certain map features.
* Offline mode is not supported.
* Accessibility enhancements and multi-language support are partially implemented.

---

## Running on a Public Server

The frontend is deployed on Vercel. To run locally against production backend:

* Ensure `NEXT_PUBLIC_API_BASE_URL` points to the production backend API.
* Test accounts:

| Email                                             | Password   |
| ------------------------------------------------- | ---------- |
| [demoUser1@gmail.com](mailto:demoUser1@gmail.com) | DemoPass1@ |

---

## Application Structure

* **Pages:** Home (`/index.js`), Search (`/search.js`), Attraction Details (`/attraction/[id].js`), Profile (`/profile.js`), Itinerary (`/itinerary.js`), Login/Register
* **Components:** AttractionCard, AttractionMap, ItineraryForm, CollaboratorManager, DarkModeToggle, Navbar, ReviewStrip, SearchBar, Suggestion, VisitedPlacesPicker
* **Context:** ThemeContext for dark/light mode
* **Controllers/Libs:** API calls and authentication separated for modularity

---

## User Flow

1. Landing / Search → Find attractions via map/list.
2. Attraction Details → View descriptions, images, reviews.
3. Authentication → Register/login for personalized features.
4. Itinerary Management → Create, edit, share, and collaborate on plans.
5. Profile → Manage account, view favorites, explore other users.
6. Dark Mode → Toggle for optimal viewing comfort.

---

## Contact & Support

For questions or issues:

* **Ashwin BN** — Full-stack Developer ([GitHub](https://github.com/Ashwin-BN))
* **Alex Leung** — Frontend Collaborator ([GitHub](https://github.com/Alex-Leungg))
* **Jeelkumar Patel** — Frontend Collaborator ([GitHub](https://github.com/jeelpatel22))
* **Juan Moncayo** — Backend Collaborator ([GitHub](https://github.com/Juancinn))
* **Suraj Sapkota** — Backend Collaborator ([GitHub](https://github.com/surajsapkota))

---

## License

MIT License © 2025 Easy Explore Team

---

**Note:** For detailed step-by-step instructions, images, and user workflow, refer to the [Walkthrough Guide](./WALKTHROUGH.md).

```

Yes! I can create a **polished PDF version** that combines the README and WALKTHROUGH, including all screenshots, headings, and a professional layout—essentially a full user and project manual ready for submission or client delivery.

Do you want it formatted with **step-by-step user instructions first, then project technical details**, or **combined throughout**?
