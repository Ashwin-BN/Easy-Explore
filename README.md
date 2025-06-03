# Easy Explore

## Project Status

**Juan** Completed

**Ashwin** Completed user authentication module with secure login, registration, and protected routes.

**Suraj** Completed 

**Alex** Completed
## Features In Progress

### Suraj Sapkota
- Designed and implemented the **Home Page UI** with responsive layout
- Created a visually appealing **Navbar** (Home, Search, About Us, Login, Sign Up)
- Connected navigation buttons to their respective pages
- Added **page transitions and animations** using Framer Motion

**Juanjo**
- [x] Live search suggestions (`/api/suggest`)
      -API returns 200.
- [x] Search for nearby attractions (`/api/search`)
      -Added search bar which uses the OpenTripMap API.
      -Fine tuning required for future features.

**Ashwin**

* [x] User registration and login (`/api/user`)

  * User data stored in MongoDB with bcrypt-hashed passwords.
  * Validates input, and enforces unique emails.
* [x] JWT-based authentication

  * Tokens issued on successful login and stored locally.
     
**Alex**
- [x] Set up MongoDB database and add dummy data.
- [x] Test back-end connection to database

Jeelkumar Patel
Enhanced Search Filters and Relevant Results (In Progress)

Working on extending the /api/search endpoint to support filters like category, tags, radius, and popularity.

Designing the UI filters to allow users to easily refine their search.

Ensuring the backend correctly processes new filter parameters and returns accurate results.

Planning to test the feature with and without filters using Postman for backend verification and UI testing for result relevance.

Aiming to improve user experience by making the search more personalized and efficient.
