// Import required modules
import inquirer from "inquirer";
import chalk from "chalk";

// Define a function to calculate resource requirements
const calculateResourceRequirements = (factors) => {
    const { magnitude, population } = factors;

    // Define resource requirements based on magnitude of the disaster and population size
    let medicalPersonnel = 0;
    let foodSupplies = 0;
    let constructionWorkers = 0;

    // Calculate resource requirements based on magnitude of the disaster
    switch (parseInt(magnitude)) {
        case 0:
            medicalPersonnel = Math.ceil(population * 0.01); // 1% of population
            foodSupplies = population * 3; // 3 meals per person
            constructionWorkers = Math.ceil(population * 0.005); // 0.5% of population
            break;
        case 1:
            medicalPersonnel = Math.ceil(population * 0.02); // 2% of population
            foodSupplies = population * 5; // 5 meals per person
            constructionWorkers = Math.ceil(population * 0.01); // 1% of population
            break;
        case 2:
            medicalPersonnel = Math.ceil(population * 0.03); // 3% of population
            foodSupplies = population * 7; // 7 meals per person
            constructionWorkers = Math.ceil(population * 0.015); // 1.5% of population
            break;
        case 3:
            medicalPersonnel = Math.ceil(population * 0.05); // 5% of population
            foodSupplies = population * 10; // 10 meals per person
            constructionWorkers = Math.ceil(population * 0.02); // 2% of population
            break;
        default:
            console.log("Invalid magnitude input. Please enter a value between 0 and 3.");
            break;
    }

    // Return the calculated resource requirements
    return {
        medicalPersonnel,
        foodSupplies,
        constructionWorkers
    };
};


// Define questions for user input
const questions = [
    {
        type: 'input',
        name: 'magnitude',
        message: 'Enter the magnitude of the disaster:',
        validate: (value) => !isNaN(value) && parseFloat(value) >= 0,
    },
    {
        type: 'input',
        name: 'population',
        message: 'Enter the population size of the affected area:',
        validate: (value) => !isNaN(value) && parseInt(value) >= 0,
    },
    // Add more questions for other factors influencing resource allocation
];

// Main function to run the application
const run = async () => {
    console.log(chalk.bold.blue('Disaster Recovery Resource Allocation System'));
    console.log(chalk.bold.blue('-------------------------------------------'));

    // Prompt user for input
    const answers = await inquirer.prompt(questions);

    // Calculate resource requirements based on input factors
    const resourceRequirements = calculateResourceRequirements(answers);

    // Display the calculated resource requirements
    console.log(chalk.bold.green('Resource Requirements:'));
    console.log(resourceRequirements);
};

// Execute the main function
run();
