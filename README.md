# Marginalia

**Live app:** https://react-project-softuni.vercel.app/

## 1. Project Overview

- **Application Name** — Marginalia
- **Application Category / Topic** — Book review website
- **Main Purpose** — Marginalia helps readers find their next book through honest reviews from other readers. Anyone can browse the catalog and read reviews. Registered users can publish their own reviews with a star rating, genre and cover image, edit or delete them, like other people's reviews and discuss them in the comments.

## 2. User Access & Permissions

### Guest (Not Authenticated)

- **Available pages / routes:**
  - Home (`/`)
  - Reviews catalog (`/books`)
  - Review details (`/books/:bookId`)
  - Login (`/login`)
  - Register (`/register`)
- **Public data shown:**
  - All reviews, with book title, author, genre, star rating, cover image, review text, reviewer and date
  - The like count of every review
  - All comments
  - Instead of the like button and comment form, guests see "Log in to like" and "Log in to join the discussion" links

### Authenticated User

- **Main sections / pages** — Everything a guest can see (except Login/Register), plus Add a review (`/books/new`) and My reviews (`/my-reviews`)
- **Details pages:**
  - Review details (`/books/:bookId`), where logged-in users can like the review (unless they wrote it) and post comments
  - The author also sees Edit and Delete buttons
- **Create / Edit / Delete actions:**
  - **Create** — Any logged-in user can create reviews and comments
  - **Edit** — Only the author can edit a review, at `/books/:bookId/edit`
  - **Delete** — Only the author can delete a review, and users can delete their own comments
  - **Likes** — Users can like a review once and remove the like, but cannot like their own reviews

## 3. Authentication & Session Handling

### Authentication Flow

- **What happens when the app loads** — `AuthProvider` wraps the whole app and subscribes to Supabase's `onAuthStateChange`. While the saved session is being checked, `isAuthLoading` is `true` and the route guards show a loading spinner.
- **How authentication status is checked** — Supabase reports the saved session first (`INITIAL_SESSION`), then every login, logout and token refresh. `AuthProvider` keeps the user in state and shares it through `AuthContext`, and components read it with the `useAuth()` hook.
- **What happens on successful login or registration:**
  - The form calls `signInWithPassword` or `signUp`. Registration also saves the username in the user's metadata.
  - Email confirmation is off, so the user is logged in immediately.
  - The header switches to the logged-in links ("Hi, username", Add a review, My reviews, Logout).
  - `GuestGuard` redirects the user to the page they came from, or to Home.
- **What happens on logout** — The app navigates to Home, then calls `signOut()`. The user becomes `null`, and the header shows Login and Register again.

### Session Persistence

- **How is the user session stored?** — The Supabase client stores the session (access and refresh tokens) in `localStorage`. The current user is kept in React state in `AuthProvider` and shared through the Context API.
- **How is automatic login handled after a page refresh?** — The Supabase client reads the saved session from `localStorage`, refreshes the token if needed, and fires `INITIAL_SESSION`, so `AuthProvider` restores the user without logging in again.

## 4. Routing Structure

### Route Guards Logic

- **`AuthGuard` (private routes)** — Protects `/books/new`, `/books/:bookId/edit` and `/my-reviews`. Guests are redirected to `/login`, and the requested page is remembered, so they return to it after logging in.
- **`GuestGuard` (guest-only routes)** — Protects `/login` and `/register`. Logged-in users are redirected to the remembered page, or to `/`.
- **Author check** — On top of the guard, the Edit page redirects anyone who is not the review's author back to the details page.

### Main Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home with the 3 latest reviews | Everyone |
| `/books` | Reviews catalog | Everyone |
| `/books/:bookId` | Review details, likes and comments | Everyone |
| `/books/new` | Add a review | Logged-in users |
| `/books/:bookId/edit` | Edit review | Review author |
| `/my-reviews` | My reviews | Logged-in users |
| `/login` | Login | Guests only |
| `/register` | Register | Guests only |
| `*` | Page not found | Everyone |

- **Number and type of top-level pages** — There are 9 pages:
  - 5 pages load their data from the backend: Home, Catalog, Details, Edit and My reviews
  - 1 form page: Add a review
  - 2 auth pages: Login and Register
  - 1 page-not-found page

### Nested & Parameterized Routes

- **Nested routing** — Yes. `Layout` is a layout route that renders the header, the footer and an `<Outlet />`. `AuthGuard` and `GuestGuard` are pathless layout routes nested inside it, with the protected pages nested inside them.
- **Routes with URL parameters** — `/books/:bookId` and `/books/:bookId/edit`.

## 5. List → Details Flow

### Catalog / List Page

- **What data is displayed?** — Each review is a card with the cover (or a placeholder with the title's first letter), title, book author, star rating, genre, reviewer, and like and comment counts.
- **How does the user interact with the list?** — Reviews are sorted newest first, and clicking a card opens its details page. The Home page shows the 3 newest reviews with a "See all reviews" button, and My reviews shows only the user's own. There is no search or filter.

### Details Page

- **How is navigation triggered?** — Each card is wrapped in a `<Link to={`/books/${review.id}`}>`. `useNavigate` is used after actions: creating or editing a review opens its details page, and deleting a review goes to My reviews.
- **What data is received via route parameters?** — The review ID (`bookId`), read with `useParams()` and used to load the review from Supabase. An unknown or malformed ID shows "Review not found" with a link back to the catalog.

## 6. Data Source & Backend

### Backend Type

- **Real backend** — **Supabase** (Backend-as-a-Service: a PostgreSQL database with Supabase Auth), used through the official `@supabase/supabase-js` client. No data is hardcoded.
- **Tables** — `reviews` (the main collection), `likes` and `comments`.
- **Security** — Row Level Security is enabled on every table:
  - Everyone can read.
  - Logged-in users can only create rows as themselves.
  - Only the owner can edit or delete a review or comment.
  - Authors cannot like their own reviews.
- **Note for reviewers** — Supabase can pause free projects after a period of inactivity. If no reviews appear, wait a moment and refresh.

## 7. Data Operations (CRUD)

All four operations are implemented for the `reviews` collection in `src/services/reviewService.js`.

### Create (POST)

- **How does the user create new data?** — A logged-in user fills in the Add a review form (title, author, genre, rating, optional cover link, review text) and clicks Publish review. `createReview()` saves it with the user's ID and username, and the user is taken to the new review's details page.

### Read (GET)

- **Where is data fetched and displayed?**
  - `getLatestReviews()` — Home page
  - `getAllReviews()` — Catalog
  - `getReviewsByUser()` — My reviews
  - `getReviewById()` — Details and Edit pages
  - `getLikes()` and `getComments()` — Details page (comments load 5 at a time with a "Show more comments" button)

### Update (PUT/PATCH)

- **How does the author edit an existing record?** — The author clicks Edit on the details page. The Edit page shows the same form as Create, pre-filled with the current values, and Save changes calls `updateReview()`.
- **How is the UI updated after the change?** — The user is taken to the details page, which loads the updated review. If saving fails, the error is shown and the form keeps the input.

### Delete

- **How does the author delete an existing record?** — The author clicks Delete and confirms in the on-page panel ("Delete this review? This cannot be undone."). `deleteReview()` removes the review, and its likes and comments are deleted with it.
- **How is the UI updated after the change?** — The user is taken to My reviews, which reloads without the deleted review. If deleting fails, the error is shown in the confirmation panel.

## 8. Forms & Validation

### Forms Used

- **Register** — Email, username, password, repeat password
- **Login** — Email, password
- **Add a review** — Book title, author, genre, rating, cover image link, review text
- **Edit review** — The same fields as Add a review, pre-filled
- **Add a comment** — Comment text

All inputs are controlled (bound to state) and use React synthetic events (`onChange`, `onSubmit`) through the shared `useForm` hook. Field errors appear under each input, and server errors (for example, a wrong password) appear above the submit button.

### Validation Rules

- **Email** — Required, must be a valid email address
- **Username** — Required, 3–20 characters, letters, numbers and underscores only
- **Password** — Required, at least 6 characters
- **Repeat password** — Must match the password
- **Book title** — Required, max 150 characters
- **Author** — Required, max 100 characters
- **Genre** — Required, chosen from the list
- **Rating** — Required, a whole number from 1 to 5
- **Cover image link** — Optional, but if filled in it must start with `http://` or `https://`
- **Review text** (multiple rules) — Required, at least 10 characters, at most 3000 characters, and spaces at the start and end are ignored
- **Comment** — Required, max 1000 characters

The database has matching limits, so invalid data cannot be saved even by bypassing the form.

## 9. React-Specific Techniques

### Hooks & Component Lifecycle

- **Which hooks are used, and where?**
  - **`useState`** — Form values and errors, loading and error states, the delete confirmation, the like state and the comment list
  - **`useEffect`** — Subscribing to auth changes in `AuthProvider`, and loading data in `useFetch` and `useComments`
  - **`useContext`** — Reading `AuthContext` inside `useAuth`
  - **`useCallback`** — Keeps data-loading functions stable, so they only reload when their inputs change
  - **React Router hooks** — `useParams`, `useNavigate`, `useLocation`
  - **Custom hooks:**
    - `useAuth` — The current user
    - `useForm` — Form state, validation and submit
    - `useFetch` — Loading, error and retry for any request
    - `useComments` — Loading, show more, add and delete for comments
- **Mount / update / unmount example:**
  - **Mount** — When `AuthProvider` mounts, its `useEffect` subscribes to Supabase auth events. When the details page mounts, `useFetch` loads the review.
  - **Update** — `useFetch` runs again when the `bookId` in the URL changes or the user clicks "Try again". `LikeButton` reloads the likes when the logged-in user changes.
  - **Unmount** — `AuthProvider`'s cleanup unsubscribes from Supabase. `useFetch` and `useComments` set an `ignore` flag in their cleanup, so responses that arrive after the user leaves the page do not update state.

### Context API

- **What state/data is shared through Context?** — `AuthContext` shares `user`, `username`, `isAuthenticated` and `isAuthLoading`.
- **Which components consume it?** — Through `useAuth()`:
  - `Header`
  - `AuthGuard` and `GuestGuard`
  - `BookDetailsPage`, `CreateBookPage`, `EditBookPage` and `MyReviewsPage`
  - `LikeButton` and `CommentsSection`

### Component Styling

- **How are components styled?** — Plain external CSS files, with no CSS library:
  - **Shared styles** — `src/styles/` holds `global.css` (colours, fonts, buttons, messages), `forms.css` and `animations.css`.
  - **Component and page styles** — These sit next to the files that use them: `Layout.css`, `Reviews.css`, `Comments.css`, `BookDetailsPage.css` and `HomePage.css`.
  - **Colours** — Defined once as CSS variables.
  - **Phones and motion** — The layout adapts to phone screens, and animations turn off for users who prefer reduced motion.

## 10. Typical User Flow

1. User opens the Home page, sees the 3 latest reviews and clicks "See all reviews" to browse the catalog
2. User opens a review, reads it with its comments, clicks "Log in to join the discussion", registers, and is brought back to the same review
3. User likes the review and posts a comment, and both appear immediately
4. User clicks "Add a review", publishes a new review and lands on its details page
5. User edits their review with the Edit button, then finds it on My reviews
6. User logs out from the navigation bar and is taken to the Home page

## 11. Error & Edge Case Handling

- **Authentication errors:**
  - A wrong email or password shows "Wrong email or password."
  - An email that is already registered shows "An account with this email already exists."
  - Too many attempts shows a "please wait" message.
  - Guests are redirected away from private pages, and logged-in users away from Login and Register.
- **Network or data errors:**
  - Every request has error handling, so a failed request never crashes the app.
  - If a page's data fails to load, an error box with a "Try again" button is shown.
  - Failed saves, deletes, likes and comments show the error next to the action, and forms keep the user's input.
  - Buttons are disabled while a request is in progress, so actions cannot be sent twice.
- **Empty or missing data states:**
  - Empty lists show a message, for example "No reviews yet. Be the first to add one!" or "No comments yet. Start the conversation!"
  - An unknown review ID shows "Review not found", and unknown URLs show the 404 page.
  - Missing or broken cover images are replaced with a placeholder.

## Project Architecture

The code is split into layers:
- **Pages** arrange components and choose what to load.
- **Components** display data.
- **Hooks** hold shared logic.
- **Services** are the only place that talks to Supabase.

```
src/
├── main.jsx                          # Entry point: router, AuthProvider, global CSS
├── App.jsx                           # All routes and route guards
├── components/
│   ├── common/                       # FormField, LoadingSpinner, ErrorMessage
│   ├── comments/                     # Comments section, comment form and comment item
│   ├── guards/
│   │   ├── AuthGuard.jsx             # Blocks guests from private pages
│   │   └── GuestGuard.jsx            # Blocks logged-in users from login/register
│   ├── layout/                       # Layout, Header (navigation), Footer, logo
│   └── reviews/                      # Review list and card, form, cover, stars,
│                                     # like button, edit/delete actions
├── contexts/
│   ├── AuthContext.js                # The auth context
│   └── AuthProvider.jsx              # Tracks the logged-in user
├── hooks/
│   ├── useAuth.js                    # Reads the current user
│   ├── useForm.js                    # Controlled forms and validation
│   ├── useFetch.js                   # Loading, error and retry for requests
│   └── useComments.js                # Comments with "show more"
├── pages/                            # Home, Catalog, Details, Create, Edit,
│                                     # My reviews, Login, Register, 404
├── services/
│   ├── supabaseClient.js             # Supabase initialization
│   ├── authService.js
│   ├── reviewService.js
│   ├── likeService.js
│   └── commentService.js
├── styles/                           # global.css, forms.css, animations.css
└── utils/
    ├── validation.js                 # All validation rules
    ├── genres.js                     # Genre list
    └── formatDate.js                 # Date formatting
```

`vercel.json` sends every URL to `index.html`, so direct links and refreshes work on the deployed site.

## Technologies Used

| Frontend | Routing | Backend | Styling | Hosting | Tools |
|---|---|---|---|---|---|
| React 19 | React Router 8 | Supabase (PostgreSQL + Auth) | CSS | Vercel | Vite 8, ESLint |

## How to Run the Project

### Prerequisites

- Node.js installed (version 20.19+ or 22.12+)

That's it. The Supabase backend is already configured and connected, so no setup is required. The Supabase URL and publishable key in `.env` are public by design, and the data is protected by Row Level Security.

### Steps

Clone the repository:

```
git clone https://github.com/PanoASG/React-project-softuni.git
cd React-project-softuni
```

Install dependencies:

```
npm install
```

Start the application:

```
npm run dev
```

Open <http://localhost:5173> in your browser.

To test the full flow: click **Register** in the navbar, create an account, then add a review. To try likes and comments as another user, register a second account.

Other commands: `npm run build` (production build), `npm run preview` (serve the build) and `npm run lint` (ESLint).
