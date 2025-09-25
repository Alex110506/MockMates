import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({children,showSidebar}) => {
  return (
    <div className='min-h-screen'>
        <div className='flex'>
            
            <div className='flex-1 flex flex-col'>
                <Navbar showSidebar={showSidebar}/>
                <main className='flex-1 overflow-y-auto'>
                    {children}
                </main>
            </div>
        </div>
    </div>
  )
}

export default Layout