document.addEventListener('DOMContentLoaded', function() {
    const extractBtn = document.getElementById('extractBtn');
    const loadingContainer = document.getElementById('loading-container');
    const resultContainer = document.getElementById('result-container');
    

    extractBtn.addEventListener('click', function() {
        loadingContainer.style.display = 'block';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "extract"}, function(response) {
                loadingContainer.style.display = 'none';
                if (response && response.success) {
                    displayResults(response.data);
                } else {
                    alert('No data found or extraction failed.');
                }
            });
        });
    });


    function displayResults(data) {
        // Check if data is an array of website objects
        console.log('websites ', data)
        if (Array.isArray(data.websites)) {
          const resultListContainer = document.getElementById('result-container');
          resultListContainer.innerHTML = ''; // Clear previous results
      
          // Loop through each website data object
          data.websites.forEach(websiteData => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item'); // Add a class for styling
       
      
            const websiteElement = document.createElement('p');
            websiteElement.textContent = `${websiteData || 'N/A'}`;

            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.onclick = () => {
                console.log(" copy for ", websiteData)

                navigator.clipboard.writeText(websiteData);
                copyButton.textContent = 'Copied !';
                setTimeout(() => {
                copyButton.textContent = 'Copy';
                }, 2000); // Change back to 'Copy' after 2 seconds
            };
            resultItem.appendChild(websiteElement);
            resultItem.appendChild(copyButton);
       
            resultListContainer.appendChild(resultItem);
          });
        // Create and append "Copy All" button
        const copyAllButton = document.createElement('button');
        copyAllButton.textContent = 'Copy All';
        copyAllButton.onclick = () => {
            const allUrls = data.websites.join('\n');
            navigator.clipboard.writeText(allUrls).then(() => {
                copyAllButton.textContent = 'All Copied !';
                setTimeout(() => {
                    copyAllButton.textContent = 'Copy All';
                }, 2000); // Change back to 'Copy All' after 2 seconds
            });
        };
        resultListContainer.appendChild(copyAllButton);

        // Create and append "Export CSV" button
        const exportCsvButton = document.createElement('button');
        exportCsvButton.textContent = 'Export CSV';
        exportCsvButton.onclick = () => {
            const csvContent = 'data:text/csv;charset=utf-8,' + data.websites.map(e => e).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'websites.csv');
            document.body.appendChild(link); // Required for FF
            link.click();
            document.body.removeChild(link); // Cleanup
        };
        resultListContainer.appendChild(exportCsvButton);

        resultListContainer.style.display = 'block'; // Show results container
    } else {
        document.getElementById('website').textContent = data.website || '';
    }
    }  
});