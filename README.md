# Easy Explore

## Project Status

**Juan** Working on the search bar and backend API integration using OpenTripMap.

**Ashwin** Completed user authentication module with secure login, registration, and protected routes.

## Features In Progress

**Juanjo**
- [x] Live search suggestions (`/api/suggest`)
      -API returns 200, however results are not displayed.
- [x] Search for nearby attractions (`/api/search`)
      -Search works but the results could be better, perhaps need a different API.

**Ashwin**

* [x] User registration and login (`/api/user`)

  * User data stored in MongoDB with bcrypt-hashed passwords.
  * Validates input, and enforces unique emails.
* [x] JWT-based authentication

  * Tokens issued on successful login and stored locally.
