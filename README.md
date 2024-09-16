Created by Tamir Vardi on September 12, 2024

This project is a social media application with features like user profiles, status updates, notifications, and a navigation system. It is built using TypeScript and React.

Getting Started
Install dependencies:

1.npm install
2.npm run dev



Directory Structure
### Pages

- **_app.tsx**: This is the custom App component in Next.js, where global state providers like Redux or other wrappers are included.
- **layout.tsx**: Defines the structure and layout of the application.
- **login/**: The login page for user authentication.
- **register/**: The user registration page.
- **profile/**: User profile page, displaying and managing user-specific information.
- **page.tsx**: The main page of the application.

Components
ContentSection.tsx: Displays content sections in the user interface.
NavUserList.tsx: Renders a list of friends and all users in the sidebar with navigation links.
Notifications.tsx: Manages the display of user notifications.
PostCard.tsx: Represents an individual post in the feed.
ProfileComponent.tsx: Handles the display and management of user profile information.
ProfileHeader.tsx: Displays the profile header section, including the user's name and profile picture.
StatusFeed.tsx: Fetches and displays a feed of status updates.
TopNavigation.tsx: Manages the top navigation bar with various options like home, profile, etc.
UpdateStatus.tsx: Provides a UI for users to update their status.


Pages
_app.tsx: The main entry point for the application that wraps all pages and manages global state.
layout.tsx: Defines the layout of the application.
login.tsx: Manages the user login flow.
page.tsx: Handles the main page of the application.
profile.tsx: Displays user profile information and actions.
register.tsx: Manages user registration.



this project uses Redux for state management. The main features of the application are organized in the features folder.

Features
auth: Manages authentication state (login, register, user session).
friends: Handles fetching and managing friend lists and all users.
notifications: Manages user notifications and notifications updates.
posts: Deals with fetching and managing posts and status updates.
profile: Manages user profile-related state and actions.
Other Redux Folders
store: Contains the main Redux store configuration and middleware setup.
hooks: Contains custom hooks such as useAppDispatch and useAppSelector for type-safe interactions with Redux.
lib: Contains utility functions used across the application.
app: Central application-level settings, including the _app.tsx.
Usage
Run the app in development mode:

bash
Copy code
npm run dev
Open the application at http://localhost:3000.
