import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Route, Routes, useLocation,
} from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Home from './pages/Home/Home';
import Book from './pages/Book/Book';
import { APP_ROUTES } from './utils/constants';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AddBook from './pages/AddBook/AddBook';
import UpdateBook from './pages/updateBook/UpdateBook';
import { useUser } from './lib/customHooks';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function LayoutWrapper() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { connectedUser } = useUser();

  useEffect(() => {
    setUser(connectedUser);
  }, [connectedUser]);

  // Hide Header/Footer on login page
  const hideLayout = location.pathname === APP_ROUTES.SIGN_IN;

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Header user={user} setUser={setUser} />}
      <Routes>
        <Route index element={<Home />} />
        <Route path={APP_ROUTES.SIGN_IN} element={<SignIn setUser={setUser} />} />
        <Route path={APP_ROUTES.BOOK} element={<Book />} />
        <Route path={APP_ROUTES.UPDATE_BOOK} element={<UpdateBook />} />
        <Route path={APP_ROUTES.ADD_BOOK} element={<AddBook />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
