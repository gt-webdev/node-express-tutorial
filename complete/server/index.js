const express = require('express');
const fs = require('fs');
const data = require('./database.json');
const PORT = 3000;

// Create the express app
const app = express();
app.use(express.json());

// Get a random recipe
app.get('/api/random-recipe', (req, res) => {
    let recipes = data.recipes;
    // This generates a random index between 0 and recipes.length-1
    let randInd = Math.floor(Math.random() * recipes.length);
    let recipe = recipes[randInd];
    return res.status(200).send({
        "result": "success",
        "recipe": recipe
    });
});

// Get the recipe with the ID of "id"
app.get('/api/recipes/:id', (req, res) => {
    let recipes = data.recipes;
    let id = req.params.id;
    // Find the recipe with the given ID
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id == id) {
            // We have found the recipe and want to return it
            return res.status(200).send({
                "result": "success",
                "recipe": recipes[i]
            });
        }
    }
    // If we've reached here, the ID given was invalid
    // 404 code = not found
    return res.status(404).send({
        "result": "failure",
        "description": `Recipe with id '${id}' not found`
    });
});

// A POST request to create a recipe
app.post('/api/create-recipe', (req, res) => {
    let recipes = data.recipes;
    let body = req.body;
    // If the body isn't structured as it needs to, return a 400 error (invalid request)
    if (!body || !body.id || !body.title || !body.steps || !body.ingredients) {
        return res.status(400).send({
            "result": "failure",
            "description": "Must include all proper fields"
        });
    }
    // Add the new recipe to the recipes list
    recipes.push(body);
    // Rewrite the data in database.json (our fake database)
    let newData = JSON.stringify(data, null, 4);
    fs.writeFileSync('database.json', newData);
    // Respond with success message
    res.status(200).send({
        "result": "added",
        "recipeId": body.id
    });
});

// A DELETE request to delete the recipe at a given ID
app.delete('/api/delete-recipe/:id', (req, res) => {
    let recipes = data.recipes;
    let id = req.params.id;
    // Find the recipe with the given ID
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id == id) {
            const oldRecipe = recipes[i];
            // Remove the recipe from the running list
            recipes.splice(i, 1);
            // Rewrite the data in database.json
            let newData = JSON.stringify(data, null, 4);
            fs.writeFileSync('database.json', newData);
            // Respond with success message
            return res.status(200).send({
                "result": "deleted",
                "recipe": oldRecipe
            });
        }
    }
    return res.status(404).send({
        "result": "failure",
        "description": `Recipe with id '${id}' not found`
    });
});

// CHALLENGE - left for you to complete
app.put('/api/update-recipe/:id', (req, res) => {
    /*
    This handles a PUT request (which updates data) with a given id.
    Write code that updates the recipe at the specified ID with a new value/s for the title, steps, and/or ingredients.
    The implementation is open-ended, but here are some things to think about:
        - How do you find the recipe at a given ID? How would you change the recipe?
        - How would you rewrite changes into the fake database back into database.json?
        - What should you return when the update has been successful?
        - When should you return a response code corresponding to an error?
          What could possibly go wrong and when in the request?
    */
});

// Create the server on the local port specified (3000 in this case)
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});