import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { RecipeContext } from '../context/RecipeContext';

const initialForm = { email: '', password: '' };

function Login() {
  const { loginUser, logoutUser, isLoggedIn, setIsLoggedIn, loggedInUser } = useContext(UserContext);
  const { setSelectedSectionRecipe } = useContext(RecipeContext);
  const [formData, setFormData] = useState(initialForm);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogout = () => {
    logoutUser();
    setFormData(initialForm);
    setLoginSuccess(false);
    setSelectedSectionRecipe(null);
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData);
      setLoginSuccess(true);
      setLoginError('');
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      setLoginSuccess(false);
      setLoginError('Invalid email or password');
    }
    setFormData(initialForm);
  };

  return (
    <div className="login-container">
      <h2> {isLoggedIn ? 'Logout' : 'Login'}</h2>
      {isLoggedIn ? (
        <div>
          <p>Login successful! Welcome {loggedInUser}</p>
          <br />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <br />
          <button type="submit">Send</button>
          {loginError && <p className="error-message">{loginError}</p>}
        </form>
      )}
    </div>
  );
}

export default Login;
