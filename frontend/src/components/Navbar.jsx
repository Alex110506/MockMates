import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Bell, LogOut } from 'lucide-react'
import ThemeSelector from './ThemeSelector'
import useLogout from '../hooks/useLogout'

const Navbar = () => {
  const {authUser}=useAuthUser()
  const location=useLocation()
  const isChatPage=location.pathname?.startsWith("/chat")

  const {logoutMutation}=useLogout()

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-end w-full'>
          {/* logo only in chat page */}
          {isChatPage && (
            <div className='pl-5'>
              <Link to="/" className='flex items-center gap-2.5'>
                <BrainCircuit className='size-9 text-primary'></BrainCircuit>
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                    MockMates
                </span>
              </Link>
            </div>
          )}

          <div className='flex items-center gap-3 sm:gap-4'>
            <Link to="/notifications">
              <button className='btn btn-ghost btn-circle'>
                <Bell className='h-6 w-6 text-base-content opacity-70'></Bell>
              </button>
            </Link>
          </div>

          <ThemeSelector/>

          <div className='avatar'>
            <div className='w-9 rounded-full'>
              <img src={authUser?.profilePic} alt="User Avatar" rel='noreferrer'/>
            </div>
          </div>

          <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
            <LogOut className='h-6 w-5 text-base-content opacity-70'/>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar