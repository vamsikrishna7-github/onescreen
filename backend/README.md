# OneScreen Backend API Documentation

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication
- **POST** `/api/auth/users/`
  - Register a new user
  - Body:
    ```json
    {
        "username": "your_username",
        "email": "your_email@example.com",
        "password": "your_password"
    }
    ```

- **POST** `/api/token/`
  - Login and get JWT tokens
  - Body:
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
  - Response:
    ```json
    {
        "access": "your_access_token",
        "refresh": "your_refresh_token"
    }
    ```

- **POST** `/api/token/refresh/`
  - Get new access token using refresh token
  - Body:
    ```json
    {
        "refresh": "your_refresh_token"
    }
    ```

### Platforms
- **GET** `/platforms/`
  - Get list of all available streaming platforms
  - Requires authentication
  - Response: List of platforms with id, name, icon, and deep_link_prefix

### User Platforms
- **GET** `/user-platforms/`
  - Get list of user's connected platforms
  - Requires authentication
  - Response: List of user's platforms with platform details and active status

- **POST** `/user-platforms/`
  - Connect a new platform to user's account
  - Requires authentication
  - Body:
    ```json
    {
        "platform": <platform_id>,
        "is_active": true
    }
    ```

- **PUT** `/user-platforms/{id}/`
  - Update user's platform connection
  - Requires authentication
  - Body:
    ```json
    {
        "is_active": true/false
    }
    ```

- **DELETE** `/user-platforms/{id}/`
  - Remove platform from user's account
  - Requires authentication

### Watchlist
- **GET** `/watchlist/`
  - Get user's watchlist items
  - Requires authentication
  - Response: List of watchlist items with details

- **POST** `/watchlist/`
  - Add new item to watchlist
  - Requires authentication
  - Body:
    ```json
    {
        "title": "Movie/Show Title",
        "tmdb_id": "12345",
        "media_type": "movie/tv",
        "platform_id": 1,
        "poster_path": "/path/to/poster.jpg"
    }
    ```

- **DELETE** `/watchlist/{id}/`
  - Remove item from watchlist
  - Requires authentication

## Postman Collection

Import the following collection into Postman:

```json
{
  "info": {
    "name": "OneScreen API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"username\": \"testuser\",\n    \"email\": \"test@example.com\",\n    \"password\": \"your_password\"\n}"
            },
            "url": {
              "raw": "{{base_url}}auth/users/",
              "host": ["{{base_url}}"],
              "path": ["auth", "users", ""]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"username\": \"testuser\",\n    \"password\": \"your_password\"\n}"
            },
            "url": {
              "raw": "{{base_url}}token/",
              "host": ["{{base_url}}"],
              "path": ["token", ""]
            }
          }
        },
        {
          "name": "Refresh Token",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"refresh\": \"{{refresh_token}}\"\n}"
            },
            "url": {
              "raw": "{{base_url}}token/refresh/",
              "host": ["{{base_url}}"],
              "path": ["token", "refresh", ""]
            }
          }
        }
      ]
    },
    {
      "name": "Platforms",
      "item": [
        {
          "name": "Get All Platforms",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{jwt_token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}platforms/",
              "host": ["{{base_url}}"],
              "path": ["platforms", ""]
            }
          }
        }
      ]
    },
    {
      "name": "User Platforms",
      "item": [
        {
          "name": "Get User Platforms",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{jwt_token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}user-platforms/",
              "host": ["{{base_url}}"],
              "path": ["user-platforms", ""]
            }
          }
        },
        {
          "name": "Add User Platform",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{jwt_token}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"platform\": 1,\n    \"is_active\": true\n}"
            },
            "url": {
              "raw": "{{base_url}}user-platforms/",
              "host": ["{{base_url}}"],
              "path": ["user-platforms", ""]
            }
          }
        }
      ]
    },
    {
      "name": "Watchlist",
      "item": [
        {
          "name": "Get Watchlist",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{jwt_token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}watchlist/",
              "host": ["{{base_url}}"],
              "path": ["watchlist", ""]
            }
          }
        },
        {
          "name": "Add to Watchlist",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{jwt_token}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"title\": \"Example Movie\",\n    \"tmdb_id\": \"12345\",\n    \"media_type\": \"movie\",\n    \"platform_id\": 1,\n    \"poster_path\": \"/path/to/poster.jpg\"\n}"
            },
            "url": {
              "raw": "{{base_url}}watchlist/",
              "host": ["{{base_url}}"],
              "path": ["watchlist", ""]
            }
          }
        },
        {
          "name": "Remove from Watchlist",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{jwt_token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}watchlist/1/",
              "host": ["{{base_url}}"],
              "path": ["watchlist", "1", ""]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api/"
    },
    {
      "key": "jwt_token",
      "value": "your_jwt_token_here"
    },
    {
      "key": "refresh_token",
      "value": "your_refresh_token_here"
    }
  ]
}
```

## Environment Variables
Create a Postman environment with the following variables:
- `base_url`: http://localhost:8000/api/
- `jwt_token`: Your JWT access token after login
- `refresh_token`: Your JWT refresh token after login

## Setup Instructions
1. Import the collection into Postman
2. Create an environment and set the variables
3. Register a new user using the "Register User" endpoint
4. Login using the "Login" endpoint to get your JWT tokens
5. Update the `jwt_token` and `refresh_token` variables with your tokens
6. Start testing the API endpoints 