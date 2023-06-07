const express = require('express')
const { getAllRecipes, getIdRecipe, createRecipe, updateRecipe, deleteRecipes, ownerRecipes, recipeIdLog, verifyRecipeOwnership } = require('../database/recipes')
const z = require('zod')
const auth = require('../middleware/auth')
const router = express.Router()

const RecipeSchema = z.object({
    nome: z.string(),
    descricao: z.string().min(10, "Descrição mais de 10 palavras"),
    tempo: z.string()
})

router.get("/recipes", async (req, res) => {
    const getAll = await getAllRecipes();
    res.json({
        Recipes: getAll
    })
})

router.get("/recipes/:id", async (req, res) => {
    const id = Number(req.params.id)
    const recipe = await getIdRecipe(id)
    if (!recipe) return res.status(401).json({ message: "Receita não encontrda" })
    res.json({
        recipe
    })
})

router.post("/recipes", auth, async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(401).send()
        const recipe = RecipeSchema.parse(req.body)
        const create = await createRecipe(recipe, user.userId)
        res.status(201).json({
            Recipe: create
        })
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao criar a receita",
            error: error.message
        });
    }
})

router.put("/recipes/:id", auth, async (req, res) => {
    try {
        const id = Number(req.params.id)
        const user = req.user
        const recipe = RecipeSchema.parse(req.body)

        const recipeId = await verifyRecipeOwnership(user.userId, id);

        if (!recipeId) {
            return res.status(401).json({ message: "A receita não pertence ao usuário" });
        }


        await updateRecipe(id, recipe)
        return res.json({
            message: "Updated"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar a receita",
            error: error.message
        });
    }
})
router.delete("/recipes/:id", auth, async (req, res) => {
    const user = req.user;
    const id = Number(req.params.id);

    try {
        const recipe = await verifyRecipeOwnership(user.userId, id);

        if (!recipe) {
            return res.status(401).json({ message: "A receita não pertence ao usuário" });
        }

        await deleteRecipes(id)
        res.json({ message: "Receita excluída com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao excluir a receita", error: error.message });
    }
});

module.exports = router;










module.exports = {
    router
}