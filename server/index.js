import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import DonationRequest from "./models/request.models.js";
import Connection from "./db.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
Connection()

const app = express();

app.use(express.json());
app.use(cors());
// Define routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/allocate-minimum-resources", (req, res) => {
  const { totalResources, magnitude, population } = req.body;

  // Check if totalResources, magnitude, and population are provided
  if (!totalResources || !magnitude || !population) {
    return res
      .status(400)
      .json({
        error:
          "Total resources, magnitude, and population are required parameters.",
      });
  }

  // Define resource requirements based on magnitude of the disaster
  let requiredResources = {};
  switch (parseInt(magnitude)) {
    case 0:
      requiredResources = {
        medicalPersonnel: Math.ceil(population * 0.01), // 1% of population
        foodSupplies: population * 3, // 3 meals per person
        constructionWorkers: Math.ceil(population * 0.005), // 0.5% of population
        financialResources: population * 1000, // Placeholder formula for financial resources (example)
      };
      break;
    case 1:
      requiredResources = {
        medicalPersonnel: Math.ceil(population * 0.02), // 2% of population
        foodSupplies: population * 5, // 5 meals per person
        constructionWorkers: Math.ceil(population * 0.01), // 1% of population
        financialResources: population * 2000, // Placeholder formula for financial resources (example)
      };
      break;
    case 2:
      requiredResources = {
        medicalPersonnel: Math.ceil(population * 0.03), // 3% of population
        foodSupplies: population * 7, // 7 meals per person
        constructionWorkers: Math.ceil(population * 0.015), // 1.5% of population
        financialResources: population * 3000, // Placeholder formula for financial resources (example)
      };
      break;
    case 3:
      requiredResources = {
        medicalPersonnel: Math.ceil(population * 0.05), // 5% of population
        foodSupplies: population * 10, // 10 meals per person
        constructionWorkers: Math.ceil(population * 0.02), // 2% of population
        financialResources: population * 5000, // Placeholder formula for financial resources (example)
      };
      break;
    default:
      console.log(
        chalk.red(
          "Invalid magnitude input. Please enter a value between 0 and 3."
        )
      );
      return res
        .status(400)
        .json({
          error:
            "Invalid magnitude input. Please enter a value between 0 and 3.",
        });
  }

  // Allocate the minimum of required and available resources
  const allocatedResources = {};
  for (const resourceType in requiredResources) {
    if (totalResources[resourceType] >= requiredResources[resourceType]) {
      allocatedResources[resourceType] = requiredResources[resourceType];
    } else {
      allocatedResources[resourceType] = totalResources[resourceType];
    }
  }

  // Return the allocated resources as response
  res.json(allocatedResources);
});

const puppet = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.livemint.com/latest-news");

  const titles = await page.evaluate(() => {
    const titleElements = document.querySelectorAll(".headline");
    const linkElements = document.querySelectorAll(".headline a");
    const link = [];
    const titles = [];
    linkElements.forEach((element) => {
      link.push(element.getAttribute("href"));
    });
    titleElements.forEach((element) => {
      titles.push(element.innerText);
    });
    return { titles, links: link };
  });

  console.log(titles, titles.titles.length);

  // I want to check if the titles.title contains words such as [covid, coronavirus, pandemic]
  const filteredTitles = titles.titles.filter((title) => {
    const keywords = [
      "earthquake",
      "tsunami",
      "disaster",
      "tragedy",
      "panchayat",
      "nasa",
    ];
    return keywords.some((keyword) => title.toLowerCase().includes(keyword));
  });

  console.log(filteredTitles);

  await browser.close();
};

// puppet()

// a request which would create a new request for donation
app.post("/donate", async (req, res) => {
  const { name, email, amount, type } = req.body;

  // Check if required parameters are provided
  if (!name || !email || !amount || !type) {
    return res
      .status(400)
      .json({
        error:
          "Name, email, amount, and resource type are required parameters.",
      });
  }
  // Create a new donation request
  const donation = new DonationRequest({
    name,
    email,
    amount,
    type,
    status: "pending",
  });
  try {
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    console.error("Error creating a donation request" ,err?.message);
    res.status(500).json({ error: "Error creating donation request." });
  }
});


// Fetch all the donations from the database 
app.get("/donations", async (req, res) => {
  try {
    const donations = await DonationRequest.find();
    if (!donations) {
      return res.status(404).json({ error: "No donations found." });
    }
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations", err?.message);
    res.status(500).json({ error: "Error fetching donations." });
  }
});

// Update the amount of required in a donation request , we will get amount in the req , we should subtract the amount from the req from the total amount .
app.patch("/donations/:id", async (req, res) => {
  const { id } = req.params;
  const { amount } =  req.body;
  try {
    const donation = await DonationRequest.findById(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation request not found." });
    }
    const updatedAmount = donation.amount - amount;
    if (updatedAmount < 0) {
      return res.status(400).json({ error: "Requested amount exceeds the remaining donation." });
    }
    donation.amount = updatedAmount;
    await donation.save();
    res.json(donation);
    } catch (err) {
      console.error("Error updating donation request", err?.message);
      res.status(500).json({ error: "Error updating donation request." });
    }
    });
    

