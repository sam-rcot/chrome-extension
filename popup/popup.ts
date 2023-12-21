const chromeStorage = chrome.storage.local;

document.addEventListener('DOMContentLoaded', function () {
    const loadContentButton = document.getElementById('loadContentButton') as HTMLButtonElement;
    const saveContentButton = document.getElementById('saveContentButton') as HTMLButtonElement;
    const loadLocalContentButton = document.getElementById('loadLocalContentButton') as HTMLButtonElement;
    loadLocalContent();
    loadContentButton.addEventListener('click', function () {
        appendContactDetails();
    });

    saveContentButton.addEventListener('click', function () {
        // Call saveContent with currently displayed contact details
        const email = document.querySelector('.contactDetails .email')?.textContent;
        const firstName = document.querySelector('.contactDetails .firstName')?.textContent;
        const lastName = document.querySelector('.contactDetails .lastName')?.textContent;

        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            const fullUrl = tabs[0].url;
            const urlId = extractIdFromUrl(fullUrl); // Extract part after the last 'id=' using regex

            if (email && firstName && lastName && urlId) {
                saveContent({ email, firstName, lastName, urlId });
                loadLocalContent()
            }
        });
    });

    loadLocalContentButton.addEventListener('click', function () {
        loadLocalContent();
    });
});

function appendContactDetails() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab?.id !== undefined) {
            chrome.tabs.sendMessage(activeTab.id, { message: "getContactDetails" }, (response: any) => {
                if (chrome.runtime.lastError) {
                    console.error('Error in message passing:', chrome.runtime.lastError.message);
                    return;
                }
                if (response?.contactDetails) {
                    const { email, firstName, lastName } = response.contactDetails;
                    const fullUrl = activeTab.url;
                    const urlId = extractIdFromUrl(fullUrl); // Extract part after the last 'id=' using regex
                    updateContactDetailsUI(email, firstName, lastName, urlId);
                }
            });
        }
    });
}

function updateContactDetailsUI(email: string, firstName: string, lastName: string, urlId: string) {
    const ul = document.querySelector('.contactDetails') as HTMLUListElement;
    const listHTML = `<li class="email">${email}</li>
                      <li class="firstName">${firstName}</li>
                      <li class="lastName">${lastName}</li>
                      <li class="url">${urlId}</li>`;
    ul.insertAdjacentHTML("beforeend", listHTML);
}

function saveContent(data: { email: string; firstName: string; lastName: string; urlId: string; }) {
    chromeStorage.set({ contactDetails: data }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error saving data to Chrome Storage:', chrome.runtime.lastError);
        } else {
            console.log('Data saved to Chrome Storage:', data);
        }
    });
}

function loadLocalContent() {
    chromeStorage.get('contactDetails', function (result) {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving data:', chrome.runtime.lastError);
        } else {
            const data = result.contactDetails;
            displayData(data);
        }
    });
}

function displayData(data: { [key: string]: string; }) {
    let displayArea = document.getElementById('displayArea');

    if (!displayArea) {
        displayArea = document.createElement('div');
        displayArea.id = 'displayArea';
        document.body.appendChild(displayArea);
    }

    displayArea.innerHTML = '';

    const ul = document.createElement('ul');

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const li = document.createElement('li');
            li.innerHTML = `${capitalizeFirstLetter(key)}: <span>${data[key]}</span>`;
            ul.appendChild(li);
        }
    }

    displayArea.appendChild(ul);
}

function extractIdFromUrl(url: string): string {
    const match = url.match(/(?:&|[\?&])id=([^&]*)/); // Adjusted regex
    return match ? match[1] : '';
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
