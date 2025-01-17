// Function to scrape Kompas news using XPath
async function scrapeKompas() {
    try {
        const response = await fetch('https://pemilu.kompas.com/news');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();

        // Parse the HTML response using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // XPath expression you provided
        const xpathExpression = "/html/body/div[2]/div[1]/div[3]/div[3]/div[1]/div/div[2]/div[1]/a/div/div[2]/h2";
        
        // Execute the XPath query to select the title elements
        const result = document.evaluate(xpathExpression, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        
        // Array to store the extracted titles
        const titles = [];

        // Loop through the result and extract text content
        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i);
            titles.push(node.textContent.trim()); // Add the title to the array
        }

        if (titles.length === 0) {
            throw new Error('No titles found.');
        }

        return titles;
    } catch (error) {
        console.error('Error during scraping:', error);
        return [];
    }
}

// Function to send message to Telegram
async function sendToTelegram(message) {
    const telegramApiUrl = `https://api.telegram.org/bot7711846074:AAGj4_dXCmhOmfGFB3lBRI2c7KgkaigyGQw/sendMessage`;
    const chatId = '4668192302';
    
    const url = `${telegramApiUrl}?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            console.log("Message sent successfully!");
        } else {
            console.error("Failed to send message:", result);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Start scraping and send the news
async function startScraping() {
    const news = await scrapeKompas();
    
    if (news.length > 0) {
        const message = `Latest news:\n${news.join('\n')}`;
        await sendToTelegram(message);
    } else {
        console.log("No news found.");
    }
}

// Call the function to start the scraping and sending process
startScraping();
