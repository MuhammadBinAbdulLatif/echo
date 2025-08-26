import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
      {children}
    </div>
  )
}

export default layout   