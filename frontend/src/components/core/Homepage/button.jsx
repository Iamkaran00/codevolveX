import React from 'react'
import { NavLink } from 'react-router-dom'
import "./button.css"
export const CTAbutton = ({children, active, linkto}) => {
  return (
     <NavLink to = {linkto}>
  <button  className ={active?'active':'unactive'}>{children}</button>
     </NavLink>
  )
}
