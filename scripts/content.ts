let contactDetails = {
    email: '',
    firstName: '',
    lastName: '',
    btNumber: "BT000001",
};

function fetchContactDetails() {
    const maxAttempts = 10;
    const attemptInterval = 500; // 500 milliseconds
    let attempts = 0;

    const findContactDetails = () => {
        const contentSection = document.getElementById('CONTACT_INFORMATION_0');
        if (contentSection) {
            contactDetails = {
                email: (contentSection.querySelector('[data-id="emailaddress1.fieldControl-mail-text-input"]') as HTMLInputElement)?.value,
                firstName: (contentSection.querySelector('[data-id="firstname.fieldControl-text-box-text"]') as HTMLInputElement)?.value,
                lastName: (contentSection.querySelector('[data-id="lastname.fieldControl-text-box-text"]') as HTMLInputElement)?.value,
                btNumber: "BT000001",
            };

            if (contactDetails.email && contactDetails.firstName /* && other fields if needed */) {
                console.log(contactDetails);
                return;
            }
        }

        if (attempts < maxAttempts) {
            attempts++;
            setTimeout(findContactDetails, attemptInterval);
        } else {
            console.log("INCOMPLETE CONTACT DETAILS", contactDetails);
        }
    };

    findContactDetails();
}

function observeDOMChanges() {
    const observer = new MutationObserver(mutations => {
        if (document.getElementById('CONTACT_INFORMATION_0')) {
            fetchContactDetails(); // Call your function if CONTACT_INFORMATION_0 is found
            observer.disconnect(); // Optional: disconnect the observer since we found our target element
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Start observing DOM changes
observeDOMChanges();

chrome.runtime.onMessage.addListener(
    (request: any, sender: chrome.runtime.MessageSender, sendResponse: any) => {
        if (request.message === "getContactDetails") {
            // Asynchronously send the contactDetails
            Promise.resolve({ ...contactDetails }).then(response => {
                sendResponse(response);
            });
            return true; // Indicate an asynchronous response
        }
        return false; // No response needed
    }
);
