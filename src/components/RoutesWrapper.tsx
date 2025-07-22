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
import * as prodApi from '../api/products';
import CartPage from './pages/CartPage'
import type { OrderItem } from '../types/OrderItem'
import type { OrderItemDto } from '../types/dtos/OrderItemDto'
import Footer from './pages/Footer'
import TermsOfServicePage from './pages/TermsOfServicePage'
import AboutPage from './pages/AboutPage'
import Sidebar from './pages/Sidebar'

export default function RoutesWrapper() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [user, setUser] = useState<User | undefined>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isFooterPage, setIsFooterPage] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
      tryAutologin();
      tryLoadOrderItems();
  }, []);
  
  useEffect(() => {
    const orderItemDtos = [];
    
    for (const item of orderItems) {
        if (!item.product.id) {
            continue;
        }
        
        const orderItemDto: OrderItemDto = {
            productId: item.product.id,
            quantity: item.quantity
        }
        
        orderItemDtos.push(orderItemDto);
    }
    
    localStorage.setItem(LOCAL_STORAGE_CART_ITEMS, JSON.stringify(orderItemDtos));
  }, [orderItems]);
  
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
  
  async function tryLoadOrderItems() {
    const orderItemDtosString = localStorage.getItem(LOCAL_STORAGE_CART_ITEMS);
      
    const orderItemDtos: OrderItemDto[] = orderItemDtosString ? JSON.parse(orderItemDtosString) : [];
      
    const ordItems: OrderItem[] = [];
    
    for (const orderItemDto of orderItemDtos) {
        const product = await prodApi.getProductById(orderItemDto.productId.toString());
        ordItems.push({
            product,
            quantity: orderItemDto.quantity
        });
    }
    
    setOrderItems(ordItems);
  }
  
  return (
    <div className={s.component}>
        <RedirectListener setErrorMessage={setErrorMessage} setSearchValue={setSearchValue} setIsFooterPage={setIsFooterPage} />
        <Navbar setErrorMessage={setErrorMessage} searchValue={searchValue} setSearchValue={setSearchValue} user={user} setIsSidebarVisible={setIsSidebarVisible} />
        
        {errorMessage &&
            <ErrorBar errorMessage={errorMessage} />
        }
        
        {isSidebarVisible &&
            <Sidebar setIsSidebarVisible={setIsSidebarVisible} user={user} />
        }
        
        <div className={s.page}>
            <Routes>
                {/* public */}
                <Route path="/" element={<HomePage setErrorMessage={setErrorMessage} orderItems={orderItems} setOrderItems={setOrderItems} />} />
                <Route path="/product/:id" element={<ProductPage setErrorMessage={setErrorMessage} user={user} orderItems={orderItems} setOrderItems={setOrderItems} />} />
                <Route path="/login" element={<AuthPage setErrorMessage={setErrorMessage} setUser={setUser} isLoginPage={true} />} />
                <Route path="/register" element={<AuthPage setErrorMessage={setErrorMessage} setUser={setUser} isLoginPage={false} />} />
                <Route path="/search" element={<SearchResultsPage setErrorMessage={setErrorMessage} orderItems={orderItems} setOrderItems={setOrderItems} />} />
                <Route path="/cart" element={<CartPage orderItems={orderItems} setOrderItems={setOrderItems} user={user} setUser={setUser} setErrorMessage={setErrorMessage} />} />
                <Route path="/tos" element={<TermsOfServicePage />} />
                <Route path="/about" element={<AboutPage />} />
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
            
            {isFooterPage &&
                <Footer />
            }
        </div>        
    </div>
  )
}
