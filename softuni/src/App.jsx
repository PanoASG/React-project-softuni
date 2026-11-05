import { Route, Routes } from 'react-router'
import Layout from './components/layout/Layout.jsx'
import BookDetailsPage from './pages/BookDetailsPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import CreateBookPage from './pages/CreateBookPage.jsx'
import EditBookPage from './pages/EditBookPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MyReviewsPage from './pages/MyReviewsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<CatalogPage />} />
        <Route path="books/new" element={<CreateBookPage />} />
        <Route path="books/:bookId" element={<BookDetailsPage />} />
        <Route path="books/:bookId/edit" element={<EditBookPage />} />
        <Route path="my-reviews" element={<MyReviewsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
