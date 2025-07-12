import { Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditProductPage from './pages/EditProductPage'
import ProductPage from './pages/ProductPage'
import Navbar from './Navbar'
import s from '../less/routes_wrapper.module.less'
import AuthPage from './pages/AuthPage'
import ErrorPage from './pages/ErrorPage'
import ErrorBar from './ErrorBar'
import { useEffect, useState } from 'react'
import RedirectListener from './RedirectListener'
import type { User } from '../types/User'
import PageNotFoundPage from './pages/PageNotFoundPage'
import ProtectedRoute from './ProtectedRoute'
import { LOCAL_STORAGE_AUTH_TOKEN, LOCAL_STORAGE_CART_ITEMS } from '../constants'
import { getUserDetails } from '../api/auth'
import SearchResultsPage from './pages/SearchResultsPage'
import type { Product } from '../types/Product'
import * as prodApi from '../api/products';
import CartPage from './pages/CartPage'

export default function RoutesWrapper() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [user, setUser] = useState<User | undefined>();
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  
  const navigate = useNavigate();
  
  useEffect(() => {
      tryAutologin();
      tryLoadCartProducts();
  }, []);
  
  useEffect(() => {
    const ids = [];
    
    for (const cartProd of cartProducts) {
        ids.push(cartProd.id);
    }
    
    localStorage.setItem(LOCAL_STORAGE_CART_ITEMS, JSON.stringify(ids));
  }, [cartProducts]);
  
  async function tryAutologin() {
    if (user) {
        return;
    }
    
    const token = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN);

    if (!token) {
        return;
    }
    
    try {
        setUser(await getUserDetails(token));
    } catch (e) {
        if (e instanceof Error) {
            navigate('/login');
        }
    }
  }
  
  async function tryLoadCartProducts() {
    const cartIdsString = localStorage.getItem(LOCAL_STORAGE_CART_ITEMS);
      
    const cartIds = cartIdsString ? JSON.parse(cartIdsString) : [];
      
    const cartProds = [];
    
    for (const cartId of cartIds) {
        const product = await prodApi.getProductById(cartId);
        cartProds.push(product);
    }
    
    setCartProducts(cartProds);
  }
  
  return (
    <div className={s.component}>
        <RedirectListener setErrorMessage={setErrorMessage} />
        <Navbar setErrorMessage={setErrorMessage} user={user} />
        
        {errorMessage &&
            <ErrorBar errorMessage={errorMessage} />
        }
        
        <div className={s.page}>
            <Routes>
            {/* public */}
            <Route path="/" element={<HomePage setErrorMessage={setErrorMessage} cartProducts={cartProducts} setCartProducts={setCartProducts} />} />
            <Route path="/product/:id" element={<ProductPage setErrorMessage={setErrorMessage} user={user} cartProducts={cartProducts} setCartProducts={setCartProducts} />} />
            <Route path="/login" element={<AuthPage setErrorMessage={setErrorMessage} setUser={setUser} isLoginPage={true} />} />
            <Route path="/register" element={<AuthPage setErrorMessage={setErrorMessage} setUser={setUser} isLoginPage={false} />} />
            <Route path="/search" element={<SearchResultsPage setErrorMessage={setErrorMessage} cartProducts={cartProducts} setCartProducts={setCartProducts} />} />
            <Route path="/cart" element={<CartPage cartProducts={cartProducts} setCartProducts={setCartProducts} />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<PageNotFoundPage />} />
            
            {/* protected */}
            <Route path="/update/:id" element={
                <ProtectedRoute user={user}>
                <EditProductPage setErrorMessage={setErrorMessage} />
                </ProtectedRoute>
            } />
            
            <Route path="/add_product" element={
                <ProtectedRoute user={user}>
                <EditProductPage setErrorMessage={setErrorMessage} />
                </ProtectedRoute>
            } />
            </Routes>
        </div>
    </div>
  )
}
