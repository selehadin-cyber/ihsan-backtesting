import React from 'react'

export const Navbar = () => {
  return (
    <>
        <ul className='flex gap-4 justify-between w-full px-5 mb-5'>
            <div>
                <p>IhsanBacktesting</p>
            </div>
            <div className='flex gap-4 justify-between w-1/2'>
                <li>Home</li>
                <li>About</li>
            </div>
        </ul>
    </>
  )
}
