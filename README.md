# OneScreen API Documentation

## Authentication Endpoints

### JWT Authentication
- **POST** `/api/token/`
  - Obtain JWT access and refresh tokens
  - Body: `{"username": "your_username", "password": "your_password"}`
  - Returns: `{"access": "token", "refresh": "token"}`

- **POST** `/api/token/refresh/`
  - Refresh JWT access token
  - Body: `{"refresh": "your_refresh_token"}`
  - Returns: `{"access": "new_access_token"}`

### Djoser Authentication
- **POST** `/api/auth/users/`
  - Register new user
  - Body: `{"username": "username", "password": "password", "email": "email@example.com"}`

- **POST** `/api/auth/token/login/`
  - Login and get auth token
  - Body: `{"username": "username", "password": "password"}`

- **POST** `/api/auth/token/logout/`
  - Logout (invalidate token)
  - Requires authentication

## Platform Endpoints

### Platforms
- **GET** `/api/platforms/`
  - List all available platforms
  - Requires authentication
  - Returns list of platforms with id, name, icon, and deep_link_prefix

### User Platforms
- **GET** `/api/user-platforms/`
  - List user's connected platforms
  - Requires authentication
  - Returns list of user's platforms with status

- **POST** `/api/user-platforms/`
  - Connect a new platform
  - Requires authentication
  - Body: `{"platform": platform_id, "is_active": true}`

- **GET** `/api/user-platforms/{id}/`
  - Get specific user platform details
  - Requires authentication

- **PUT/PATCH** `/api/user-platforms/{id}/`
  - Update user platform status
  - Requires authentication
  - Body: `{"is_active": true/false}`

- **DELETE** `/api/user-platforms/{id}/`
  - Remove platform connection
  - Requires authentication

## Watchlist Endpoints

### Watchlist Items
- **GET** `/api/watchlist/`
  - List user's watchlist items
  - Requires authentication
  - Returns list of watchlist items with details

- **POST** `/api/watchlist/`
  - Add item to watchlist
  - Requires authentication
  - Body: `{"title": "Movie Title", "tmdb_id": "123", "media_type": "movie", "platform": platform_id, "poster_path": "path/to/poster"}`

- **POST** `/api/watchlist/add_item/`
  - Add item to watchlist with platform validation
  - Requires authentication
  - Body: `{"platform_id": platform_id, "title": "Movie Title", "tmdb_id": "123", "media_type": "movie", "poster_path": "path/to/poster"}`

- **GET** `/api/watchlist/{id}/`
  - Get specific watchlist item details
  - Requires authentication

- **PUT/PATCH** `/api/watchlist/{id}/`
  - Update watchlist item
  - Requires authentication

- **DELETE** `/api/watchlist/{id}/`
  - Remove item from watchlist
  - Requires authentication

## Notes
- All endpoints require JWT authentication except for registration and login
- Include the JWT token in the Authorization header: `Authorization: Bearer <your_token>`
- All responses are in JSON format
- Error responses include appropriate HTTP status codes and error messages 