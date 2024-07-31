chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "extract") {
        const data = extractData();
        sendResponse({success: true, data: data});
    }
    return true;
});

function extractData() {
    let websites = [];

    try {
        // Assuming all website links have the same selector (adjust as needed)
        const websiteLinks = document.querySelectorAll('a[data-value="Website"]');
        websites = Array.from(websiteLinks).map(link => link.href);
    } catch (error) {
        console.error('Error extracting websites:', error);
    }
        const filteredWebsites = filterUrls(websites)
    return { 
        websites:filteredWebsites
    };
}
function filterUrls(urls) {
    const urlSet = new Set();
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/;

    urls.forEach(url => {
        const match = url.match(urlPattern);
        if (match) {
            const baseUrl = `https://${match[2] || ''}${match[3]}`;
            urlSet.add(baseUrl);
        }
    });

    return Array.from(urlSet);
}