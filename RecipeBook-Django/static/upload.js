// Image Upload Preview
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");

// // Display uploaded image as a preview
imageUpload.addEventListener("change", function () {
    const file = imageUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            imagePreview.src = reader.result;
            imagePreview.style.display = "block"; // Show the image preview
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = "none"; // Hide the image preview if no file is selected
    }
});

// Ingredient management
const ingredientList = document.getElementById("ingredientList");
const newIngredientInput = document.getElementById("newIngredient");
const addIngredientButton = document.getElementById("addIngredientButton");

// Add new ingredient to the list
addIngredientButton.addEventListener("click", function () {
    const ingredient = newIngredientInput.value.trim();

    if (ingredient) {
        const listItem = document.createElement("li");
        listItem.textContent = ingredient;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
            ingredientList.removeChild(listItem);
        });

        listItem.appendChild(removeButton);
        ingredientList.appendChild(listItem);

        newIngredientInput.value = "";
    } else {
        alert("Please enter a valid ingredient.");
    }


});

// Instruction management
const instructionList = document.getElementById("instructionList");
const newInstructionInput = document.getElementById("newInstruction");
const addInstructionButton = document.getElementById("addInstructionButton");

// Add new instruction to the list
addInstructionButton.addEventListener("click", function () {
    const instruction = newInstructionInput.value.trim();

    if (instruction) {
        const listItem = document.createElement("li");
        listItem.textContent = instruction;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
            instructionList.removeChild(listItem);
        });

        listItem.appendChild(removeButton);
        instructionList.appendChild(listItem);

        newInstructionInput.value = "";
    } else {
        alert("Please enter a valid instruction.");
    }
});

const final=document.getElementById("final");
final.addEventListener("click", function () {
// Handle form submission
// document.getElementById("uploadForm").addEventListener("submit", function (event) {
//     event.preventDefault();

    const recipeName = document.getElementById("recipeName").value.trim();
    const ingredients = Array.from(ingredientList.children).map((li) =>
        li.firstChild.textContent
    );
    const instructions = Array.from(instructionList.children).map((li) =>
        li.firstChild.textContent
    );
    const dishType = document.getElementById("dishType").value;
    const minutes = document.getElementById("minutes").value.trim();

    const hing = document.getElementById("ingredientsField");
    const hins = document.getElementById("instructionsField");

    hing.value=ingredients;
    hins.value=instructions;


    // Validate all fields
    if (minutes && recipeName && ingredients.length > 0 && instructions.length > 0 && dishType) {
        let totalTime = `${minutes} minutes`;

        alert(`Recipe "${recipeName}" uploaded successfully!\nTime Required: ${totalTime}\nDish Type: ${dishType}\ningreed: ${ingredients}\ninstruc: ${instructions}`);
    } else {
        alert("Please fill out all fields correctly.");
    }
});
