const prisma = require('./prisma')

const getAllRecipes = () => {
    return prisma.recipe.findMany();
}

const getIdRecipe = (id) => {
    return prisma.recipe.findUnique({
        where: {
            id
        }
    })
}

const createRecipe = (data) => {
    return prisma.recipe.create({
        data: data
    })
}

const ownerRecipes = (userId, recipeId) => {
    return prisma.book.create({
        data: {
            recipe: {
                connect: {
                    id: recipeId
                }
            },
            user: {
                connect: {
                    id: userId
                }
            }
        },

    })
}

const updateRecipe = (id, data) => {
    return prisma.recipe.update({
        where: {
            id: id
        },
        data: data
    })
}

const deleteRecipes = async (id) => {
      await prisma.book.deleteMany({
        where: {
          recipeId: id,
        }
      });
  
      await prisma.recipe.delete({
        where: {
          id: id
        }
      });
  };

  const verifyRecipeOwnership = async (userId, recipeId) => {
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        BookBy: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
  
    return recipe;
  };
  
  
  
  


module.exports = {
    getAllRecipes,
    getIdRecipe,
    createRecipe,
    ownerRecipes,
    updateRecipe,
    deleteRecipes,
    verifyRecipeOwnership
}