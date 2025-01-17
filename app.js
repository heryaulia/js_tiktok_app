async function scrapeKompas() {
    const response = await fetch('https://pemilu.kompas.com/news');
    const text = await response.text();

    // Extract titles or other elements using regular expressions or DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    // Assuming you're scraping titles of the articles
    const titles = Array.from(doc.querySelectorAll('.article__title')).map(title => title.textContent);

    return titles;
}

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
            console.error("Failed to send message");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function startScraping() {
    const news = await scrapeKompas();
    if (news.length > 0) {
        const message = "Latest news:\n" + news.join("\n");
        sendToTelegram(message);
    } else {
        alert("No news found.");
    }
}
