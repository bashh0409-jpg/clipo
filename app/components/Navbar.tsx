import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="w-full hidde absolute flex justify-between capitalize z-100  text-white p-4">
      <Link href="/"><img
       
        src="https://clipo.one/uploads/loading/see.svg?v=20260901-3"
        alt=""
        loading="lazy"
              decoding="async"
              className=" h-[30px]"
          /></Link>
          <div className="fle hidden gap-4">
              <button className='uppercase font-bold tracking-tight'>About us</button>
              <button className='uppercase bg-[#F5D76A] text-black px-4 font-bold tracking-tight'>Join</button>

          </div>
      
    </div>
  );
}

export default Navbar