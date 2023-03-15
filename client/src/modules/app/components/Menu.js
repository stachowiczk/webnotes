import { useContext}from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../auth/context/UserContext'

function Menu() {
    //eslint-disable-next-line
    const { state, dispatch } = useContext(AuthContext);
  return (
    <div className="user-button" style={{position: 'absolute', top: '1%', border: 'none'}}>
        <div className="menu-button" style={{position: 'absolute', left: '0', top: '170%'}}>
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