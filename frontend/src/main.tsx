import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import { ThemeProvider } from './lib/theme.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { useLenis } from './hooks'

// Lazy load all page components for code splitting
const App = lazy(() => import('./App.tsx'))
const LandingPage = lazy(() => import('./components/landing/LandingPage.tsx'))
const FeaturesPage = lazy(() => import('./components/features/FeaturesPage.tsx'))
const PricingPage = lazy(() => import('./components/pricing/PricingPage.tsx'))
const AboutPage = lazy(() => import('./components/about/AboutPage.tsx'))
const LoginPage = lazy(() => import('./components/auth/LoginPage.tsx'))
const RegisterPage = lazy(() => import('./components/auth/RegisterPage.tsx'))
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute.tsx'))

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-600 border-t-transparent" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation();
  
  // Enable smooth scroll behavior
  useLenis();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/app/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
