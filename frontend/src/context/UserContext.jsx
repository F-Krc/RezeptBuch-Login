import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const backendUrl = 'https://rezeptbuchlogin-api.onrender.com';

  useEffect(() => {
    const storedLoggedInUser = localStorage.getItem('loggedInUser');

    if (storedLoggedInUser) {
      setLoggedInUser(JSON.parse(storedLoggedInUser));
    }
  }, []);

  const createUser = async (formData) => {
    try {
      const response = await axios.post(`${backendUrl}/users/register`, formData, { withCredentials: true });
      //console.log('res', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${backendUrl}/users/login`, formData, { withCredentials: true });
  
      const userData = response.data._doc.name;
      localStorage.setItem('loggedInUser', JSON.stringify(userData));

      setLoggedInUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const logoutUser = () => {
    setUserToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <UserContext.Provider
      value={{
        createUser,
        loginUser,
        isLoggedIn,
        setIsLoggedIn,
        logoutUser,
        loggedInUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
