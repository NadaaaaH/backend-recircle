import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Sleek loading fallback matching ReCircle's modern aesthetic
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
    <div className="relative flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
      <div className="animate-pulse text-sm font-medium tracking-widest text-emerald-400">LOADING RECIRCLE...</div>
    </div>
  </div>
)

// Lazy load all pages for optimal performance and decoupled routing
const Home = React.lazy(() => import('@/Pages/Home'))
const Dashboard = React.lazy(() => import('@/Pages/Dashboard'))
const Checkout = React.lazy(() => import('@/Pages/Checkout'))

// Cart
const CartIndex = React.lazy(() => import('@/Pages/Cart/Index'))

// Chat
const ChatIndex = React.lazy(() => import('@/Pages/Chat/Index'))

// Wishlist
const WishlistIndex = React.lazy(() => import('@/Pages/Wishlist/Index'))

// Offers
const OffersIndex = React.lazy(() => import('@/Pages/Offers/Index'))

// Auth Pages
const Login = React.lazy(() => import('@/Pages/Auth/Login'))
const Register = React.lazy(() => import('@/Pages/Auth/Register'))
const ForgotPassword = React.lazy(() => import('@/Pages/Auth/ForgotPassword'))
const ResetPassword = React.lazy(() => import('@/Pages/Auth/ResetPassword'))
const ConfirmPassword = React.lazy(() => import('@/Pages/Auth/ConfirmPassword'))
const VerifyEmail = React.lazy(() => import('@/Pages/Auth/VerifyEmail'))

// Product Pages
const ProductIndex = React.lazy(() => import('@/Pages/Product/Index'))
const ProductShow = React.lazy(() => import('@/Pages/Product/Show'))
const ProductCreate = React.lazy(() => import('@/Pages/Product/Create'))

// Profile Pages
const ProfileEdit = React.lazy(() => import('@/Pages/Profile/Edit'))

// Orders Pages
const OrdersIndex = React.lazy(() => import('@/Pages/Orders/Index'))
const OrdersShow = React.lazy(() => import('@/Pages/Orders/Show'))

// Seller Dashboard Pages
const SellerDashboard = React.lazy(() => import('@/Pages/Seller/Dashboard'))
const SellerProducts = React.lazy(() => import('@/Pages/Seller/Products'))
const SellerEditProduct = React.lazy(() => import('@/Pages/Seller/EditProduct'))
const SellerOrders = React.lazy(() => import('@/Pages/Seller/Orders'))
const SellerOffers = React.lazy(() => import('@/Pages/Seller/Offers'))
const SellerFinance = React.lazy(() => import('@/Pages/Seller/Finance'))
const SellerBalance = React.lazy(() => import('@/Pages/Seller/Balance'))
const SellerActivities = React.lazy(() => import('@/Pages/Seller/Activities'))
const SellerSettings = React.lazy(() => import('@/Pages/Seller/Settings'))
const SellerRegister = React.lazy(() => import('@/Pages/Seller/Register'))
const SellerVerification = React.lazy(() => import('@/Pages/Seller/Verification'))

// Admin Dashboard Pages
const AdminDashboard = React.lazy(() => import('@/Pages/Admin/Dashboard'))
const AdminUsers = React.lazy(() => import('@/Pages/Admin/Users'))
const AdminProducts = React.lazy(() => import('@/Pages/Admin/Products'))
const AdminTransactions = React.lazy(() => import('@/Pages/Admin/Transactions'))
const AdminOffers = React.lazy(() => import('@/Pages/Admin/Offers'))
const AdminVerifications = React.lazy(() => import('@/Pages/Admin/Verifications'))
const AdminActivities = React.lazy(() => import('@/Pages/Admin/Activities'))

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Core & Public Routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<CartIndex />} />
        <Route path="/chat" element={<ChatIndex />} />
        <Route path="/wishlist" element={<WishlistIndex />} />
        <Route path="/offers" element={<OffersIndex />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Products Routes */}
        <Route path="/products" element={<ProductIndex />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/:id" element={<ProductShow />} />

        {/* Profile Routes */}
        <Route path="/profile" element={<ProfileEdit />} />

        {/* Orders Routes */}
        <Route path="/orders" element={<OrdersIndex />} />
        <Route path="/orders/:id" element={<OrdersShow />} />

        {/* Seller Area Routes */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/verification" element={<SellerVerification />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/products/:id/edit" element={<SellerEditProduct />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/offers" element={<SellerOffers />} />
        <Route path="/seller/finance" element={<SellerFinance />} />
        <Route path="/seller/balance" element={<SellerBalance />} />
        <Route path="/seller/activities" element={<SellerActivities />} />
        <Route path="/seller/settings" element={<SellerSettings />} />

        {/* Admin Area Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
        <Route path="/admin/verifications" element={<AdminVerifications />} />
        <Route path="/admin/activities" element={<AdminActivities />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
