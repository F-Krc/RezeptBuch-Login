import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSectionRecipe, setSelectedSectionRecipe] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const backendUrl = 'http://localhost:4000';

  // user erstellen
  const createUser = async (formData) => {
    try {
      const response = await axios.post(`${backendUrl}/users/register`, formData);
      //console.log('res', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // user login
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

  // Rezepte abrufen
  useEffect(() => {
    fetchRecipes();
  }, [recipes]);

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


  // Rezepte abrufen
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.log('Error fetching recipes:', error);
    }
  };

  // Rezept erstellen
  const createRecipe = async (recipeData) => {
    try {
      const response = await axios.post(`${backendUrl}/recipes`, recipeData, {
        headers: {
          Authorization: userToken,
        },
      });
      setRecipes((prevRecipes) => [...prevRecipes, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  // Rezept löschen
  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`${backendUrl}/recipes/${recipeId}`, {
        headers: {
          Authorization: userToken,
        },
      });
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (error) {
      console.log(error);
    }
  };

  // Rezept Update
  const updateRecipe = async (recipeData) => {
    try {
      await axios.put(`${backendUrl}/recipes/${selectedRecipe._id}`, recipeData, {
        headers: {
          Authorization: userToken,
        },
      });
      setRecipes((prevRecipes) => {
        return prevRecipes.map((recipe) => {
          if (recipe._id === selectedRecipe._id) {
            return { ...recipe, ...recipeData };
          }
          return recipe;
        });
      });
      setSelectedRecipe(null);
    } catch (error) {
      console.log(error);
    }
  };

 const searchRecipes = async (searchTerm) => {
   try {
     if (searchTerm.trim() === '') {
       fetchRecipes();
       setFilteredRecipes([]);
     } else {
       const response = await axios.get(`${backendUrl}/recipes/${searchTerm}`);
       await setFilteredRecipes(response.data);
     }
   } catch (error) {
     console.log(error);
   }
 };


  return (
    <AppContext.Provider
      value={{
        filteredRecipes,
        setFilteredRecipes,
        recipes,
        selectedRecipe,
        setSelectedRecipe,
        selectedSectionRecipe,
        setSelectedSectionRecipe,
        backendUrl,
        createRecipe,
        deleteRecipe,
        updateRecipe,
        searchRecipes,
        createUser,
        loginUser,
        isLoggedIn,
        setIsLoggedIn,
        userToken,
        logoutUser,
        loggedInUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
