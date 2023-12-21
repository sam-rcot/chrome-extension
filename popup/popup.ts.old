chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "getContactDetails" }, undefined).then((response: any) => {
            const contactDetails = response as { [key: string]: string };
            if (contactDetails) {
                const ul = document.querySelector('ul');
                if (ul) {
                    for (const key in contactDetails) {
                        if (contactDetails.hasOwnProperty(key)) {
                            const li = document.createElement('li');
                            li.textContent = `${key}: ${contactDetails[key]}`;
                            ul.appendChild(li);
                        }
                    }
                }
            } else {
                console.log("No contact details received.");
            }
        }).catch((error) => {
            console.error("Error: ", error);
        });
    }
});
