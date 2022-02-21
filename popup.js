// let optionsForm = document.forms.optionsForm;
let envName = document.getElementById("envName");
let httpsCheckbox = document.getElementById("httpsCheckbox");
let localeId = document.getElementById("localeId");
let incognito = document.getElementById("incognito");
let sendButton = document.getElementById("sendButton");

let options = {};
let envFromPage = '';

syncStorage();

// async function getFromPage() {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   let [{result}] = await chrome.tab.executeScript({
//     target: {tabId: tab.id},
//     function: () => getSelection().toString(),
//   });
//   envFromPage = result;
//   debugEl.textContent += envFromPage;
// }

function syncStorage() {
  chrome.storage.sync.get('options', (data) => {
    Object.assign(options, data.options);

    envName.value = options.envName || '';
    httpsCheckbox.checked = options.httpsCheckbox || false;
    localeId.value = options.locale || 'us';
    incognito.checked = options.incognito || false;
  });
}


envName.addEventListener("keyup", async (keyEvent) => {
  if (keyEvent.key === 'Enter') {
    navigateToEnv();
  }
});

sendButton.addEventListener('click', () => navigateToEnv());

function navigateToEnv() {
  const protocol = httpsCheckbox.checked
      ? 'https'
      : 'http';
  const locale = localeId.value;
  const url = `${protocol}://edge.${envName.value}.backbase.eu/business-${locale}/`;

  chrome.storage.sync.set({ options: {
      envName: envName.value,
      httpsCheckbox: httpsCheckbox.checked,
      locale,
      incognito: incognito.checked,
    }});

  if (incognito.checked) {
    chrome.windows.create({ url, incognito: incognito.checked });
  } else {
    chrome.tabs.create({ url });
  }
}

// optionsForm.debug.addEventListener('change', (event) => {
//   options.debug = event.target.checked;
//   chrome.storage.sync.set({options});
// });

///////
// // Initialize butotn with users's prefered color
// let changeColor = document.getElementById("changeColor");
//
// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });
//
// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });
//
// // The body of this function will be execuetd as a content script inside the
// // current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }
