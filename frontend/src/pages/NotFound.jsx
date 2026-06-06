 import React from 'react'
 import notfound from '../assets/notfound.png';
 const NotFound = () => {
   return (
     <div className='flex justify-center items-center bg-gray-300'>
        <img src= {notfound} alt="" height={'800px'} width={'800px'} />
     </div>
   )
 }
 
 export default NotFound