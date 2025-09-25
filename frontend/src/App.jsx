import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.jsx'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {
  const {isLoading,authUser}=useAuthUser()
  const {theme}=useThemeStore()

  const isAuthenticated=Boolean(authUser)
  const isOnboarded=authUser?.isOnboarded

  console.log(isAuthenticated);

  if(isLoading) return (
    <PageLoader></PageLoader>
  )

  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path='/' element={isAuthenticated && isOnboarded ? 
          (<Layout showSidebar={true}>
            <HomePage/>
          </Layout>
          ) : 
          (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)
        }/>
        <Route path='/signup' element={!isAuthenticated ? <SignupPage></SignupPage> : <Navigate to="/"/>}/>
        <Route path='/login' element={!isAuthenticated ? <LoginPage></LoginPage> : 
          (isOnboarded ? <Navigate to="/"/> : 
          <Navigate to="/onboarding"/>)
        }/>
        <Route path='/notifications' element={isAuthenticated && isOnboarded ? 
          (<Layout showSidebar={true}>
            <NotificationsPage/>
          </Layout>
          ) : 
          (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)
        }/>
        <Route path='/call/:id' element={isAuthenticated && isOnboarded ? 
          (<Layout showSidebar={false}>
            <CallPage/>
          </Layout>
          ) : 
          (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)
        }/>
        <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? 
          (<Layout showSidebar={false}>
            <ChatPage/>
          </Layout>
          ) : 
          (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)
        }/>
        <Route path='/onboarding' element={isAuthenticated ? (
          !isOnboarded ? (
            <OnboardingPage></OnboardingPage>
          ):(
            <Navigate to='/'></Navigate>
          )
        ) : <Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App