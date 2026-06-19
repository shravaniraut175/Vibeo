import { Link } from 'react-router'
import '../styles/form.scss'


const Login = () => {
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form>
          <input type="text" placeholder='Enter username' />
          <input type="password" placeholder='Enter password' />

          <button type='submit'>Log in</button>
        </form>

        <p>Don't have an account? <Link className='toggleInForm' to="/register">Register</Link></p>
      </div>
    </main>
  )
}

export default Login
