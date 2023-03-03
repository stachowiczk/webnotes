import { useContext}from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/UserContext'

function Menu() {
    const { state, dispatch } = useContext(AuthContext);
  return (
    <div className="user-button" style={{position: 'absolute', top: '1%', border: 'none', background: 'none'}}>
        <div style={{position: 'absolute', left: '-200%', top: '150%'}}>
            <>
                {state.isAuthenticated ? null : <Link to="/login">Login </Link>}
            </>
            <Link to="/home">Home </Link>
            <Link to="/logout">Logout </Link>
        </div>
    </div>
  )
}

export default Menu