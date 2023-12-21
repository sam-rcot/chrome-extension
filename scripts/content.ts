chrome.runtime.onMessage.addListener(
    function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
        if (request.message === "getContactDetails") {
            const contactDetails = {
                email: (document.querySelector('[data-id="emailaddress1.fieldControl-mail-text-input"]') as HTMLInputElement)?.value,
                firstName: (document.querySelector('[data-id="firstname.fieldControl-text-box-text"]') as HTMLInputElement)?.value,
                lastName: (document.querySelector('[data-id="lastname.fieldControl-text-box-text"]') as HTMLInputElement)?.value,
            }
            //var emailInput = document.querySelector('[data-id="emailaddress1.fieldControl-mail-text-input"]');
            sendResponse({ contactDetails });
            return true;
        }
    }
);
