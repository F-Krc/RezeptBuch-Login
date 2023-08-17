import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const backendUrl = 'https://rezeptbuchlogin-api.onrender.com';

  useEffect(() => {
    const storedUserToken = localStorage.getItem('userToken');
    const storedLoggedInUser = localStorage.getItem('loggedInUser');

    if (storedUserToken) {
      setUserToken(storedUserToken);
      setIsLoggedIn(true);
      axios.defaults.headers.common['Authorization'] = storedUserToken;
    }

    if (storedLoggedInUser) {
      setLoggedInUser(JSON.parse(storedLoggedInUser));
    }
  }, []);

  const createUser = async (formData) => {
    try {
      const response = await axios.post(`${backendUrl}/users/register`, formData);
      //console.log('res', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${backendUrl}/users/login`, formData);
      const userToken = response.data.token;
      localStorage.setItem('userToken', userToken);
      setUserToken(userToken);

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
    localStorage.removeItem('userToken');
    localStorage.removeItem('loggedInUser');
  };

  return (
    <UserContext.Provider
      value={{
        createUser,
        loginUser,
        isLoggedIn,
        setIsLoggedIn,
        userToken,
        logoutUser,
        loggedInUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
