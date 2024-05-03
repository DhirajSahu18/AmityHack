import puppeteer from "puppeteer";
import nodemailer from "nodemailer";

// Function to scrape news titles containing specific keywords and send alerts via email
const scrapeAndSendAlerts = async () => {
  // Step 1: Scrape News Titles
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.ndtv.com/latest", { waitUntil: 'networkidle0' });

  // Step 2: Filter Titles by Keywords
  const keywords = ['earthquake', 'tsunami', 'disaster', 'tragedy', 'panchayat'];
  const newsData = await page.evaluate((keywords) => {
    const newsElements = document.querySelectorAll(".newsHdng");
    const newsLinks = document.querySelectorAll(".newsHdng a");

    const newsTitles = [];
    const newsLinkUrls = [];

    newsElements.forEach((element, index) => {
      const title = element.innerText.toLowerCase();
      if (keywords.some(keyword => title.includes(keyword))) {
        newsTitles.push(element.innerText);
        newsLinkUrls.push(newsLinks[index].getAttribute("href"));
      }
    });

    return {
      newsTitles,
      newsLinkUrls
    };
  }, keywords);

  await browser.close();

  // Step 3: Send Alerts via Email
  if (newsData.newsTitles.length > 0) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'dhirajksahu01@gmail.com',
          pass: 'brqa xvnw zxaa nmbp', // Use App Password or your actual password
        },
      });

    const mailOptions = {
      from: 'dhirajksahu01@gmail.com',
      subject: `<b>Be alert from "${newsData.newsTitles[0]}"</b>`,
      text: `Please be alert! Check out the news article: ${newsData.newsLinkUrls[0]}`
    };

    // Send email to all users in your database
    // Replace emailAddresses with an array of user email addresses
    const emailAddresses = ['dhirajksahu01@gmail.com'];
    emailAddresses.forEach(email => {
      mailOptions.to = email;
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    });
  }
};

scrapeAndSendAlerts();
