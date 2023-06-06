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

const createRecipe = (recipeData, userId) => {
  const { nome, descricao, tempo } = recipeData;
    return prisma.recipe.create({
      data: {
        nome,
        descricao,
        tempo,
        BookBy: {
          create: {
            user: { 
              connect: { 
                id: userId ,
              } 
            },
          },
        },
      },
      include: {
        BookBy: false,
      },
    });
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
    updateRecipe,
    deleteRecipes,
    verifyRecipeOwnership
}