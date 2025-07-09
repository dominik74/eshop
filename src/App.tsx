import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import EditProductPage from './components/pages/EditProductPage'
import ProductPage from './components/pages/ProductPage'
import Navbar from './components/Navbar'
import s from './less/app.module.less'
import AuthPage from './components/pages/AuthPage'
import ErrorPage from './components/pages/ErrorPage'
import ErrorBar from './components/ErrorBar'
import { useState } from 'react'
import RedirectListener from './components/RedirectListener'
import type { User } from './types/User'
import PageNotFoundPage from './components/pages/PageNotFoundPage'

function App() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [user, setUser] = useState<User | undefined>();
  
  return (
    <div className={s.component}>
      <BrowserRouter>
        <RedirectListener setErrorMessage={setErrorMessage} />
        <Navbar setErrorMessage={setErrorMessage} user={user} />
        
        {errorMessage &&
          <ErrorBar errorMessage={errorMessage} />
        }
        
        <div className={s.page}>
          <Routes>
            <Route path="/" element={<HomePage setErrorMessage={setErrorMessage} />} />
            <Route path="/add_product" element={<EditProductPage setErrorMessage={setErrorMessage} />} />
            <Route path="/product/:id" element={<ProductPage setErrorMessage={setErrorMessage} user={user} />} />
            <Route path="/update/:id" element={<EditProductPage setErrorMessage={setErrorMessage} />} />
            <Route path="/login" element={<AuthPage setErrorMessage={setErrorMessage} setUser={setUser} isLoginPage={true} />} />
            <Route path="/register" element={<AuthPage setErrorMessage={setErrorMessage} setUser={setUser} isLoginPage={false} />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<PageNotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
