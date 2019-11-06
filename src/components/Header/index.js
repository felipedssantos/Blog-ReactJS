import React from 'react'
import {Link} from 'react-router-dom'

// Estilo
import './header.css'

function Header() {
  return(
    <header id="main-header">
      <div className="header-content">
        <Link to="/">
          Blog ReactJs
        </Link>

        <Link to="/login">
          Entrar
        </Link>
      </div>
    </header>
  )
}

export default Header