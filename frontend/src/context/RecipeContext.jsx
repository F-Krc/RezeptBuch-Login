import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const RecipeContext = createContext();

const RecipeProvider = ({ children }) => {
  const userContext = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSectionRecipe, setSelectedSectionRecipe] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const backendUrl = 'https://rezeptbuchlogin-api.onrender.com';

  useEffect(() => {
    fetchRecipes();
  }, [recipes]);

  useEffect(() => {
    if (userContext.userToken) {
      axios.defaults.headers.common['Authorization'] = userContext.userToken;
    }
  }, [userContext.userToken]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.log('Error fetching recipes:', error);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      const response = await axios.post(`${backendUrl}/recipes`, recipeData, {
        headers: {
          Authorization: userContext.userToken,
        },
      });
      setRecipes((prevRecipes) => [...prevRecipes, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`${backendUrl}/recipes/${recipeId}`, {
        headers: {
          Authorization: userContext.userToken,
        },
      });
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (error) {
      console.log(error);
    }
  };

  const updateRecipe = async (recipeData) => {
    try {
      await axios.put(`${backendUrl}/recipes/${selectedRecipe._id}`, recipeData, {
        headers: {
          Authorization: userContext.userToken,
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
    <RecipeContext.Provider
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
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
