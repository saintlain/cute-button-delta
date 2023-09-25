'use strict';
/* Listens for messages from content script */
chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab.id;
  switch(message.type) {
    case 'download': { download(tabId, message); break; }
    case 'button_style': { addButtonStyles(tabId); break; }
    case 'button_size': { injectSizeCss(tabId, message.val, message.prev); break; }
    case 'page_style': { switchPageStyles(tabId, message.style, message.turnOn); break; }
  }
});

function btnStyle(size) {
  return `html de_cbutton#de-cute-id {
    background-size: ${size - 6}px ${size - 6}px!important;
    min-height: ${size}px!important;
    min-width: ${size}px!important;
    height: ${size}px!important;
    width: ${size}px!important;
  }`;
}

/* To override "user" originated css rules form other extensions */
function addButtonStyles(tabId) {
  chrome.tabs.insertCSS(tabId, {
    allFrames: true,
    cssOrigin: 'user',
    runAt: 'document_start',
    file: 'css/button.css',
  }, () => {
    if(chrome.runtime.lastError)
      return;
    chrome.tabs.sendMessage(tabId, 'css_injected');
  });
}

function switchPageStyles(tabId, style, turnOn) {
  const action = turnOn ? 'insertCSS' : 'removeCSS';
  chrome.tabs[action](tabId, {
    allFrames: true,
    cssOrigin: 'user',
    code: style,
  });
}

/* For options initialization after installation */
chrome.runtime.onInstalled.addListener(initSettings);

function initSettings(details) {
  chrome.runtime.onInstalled.removeListener(initSettings);
  chrome.storage.local.get(null, currentSettings => {
    const actualSettingsNames = Object.keys(settingsDefault),
      currentSettingsNames = Object.keys(currentSettings),
      newSettings = {},
      newSettingsList = arrayDiff(actualSettingsNames, currentSettingsNames),
      obsoleteSettingsList = arrayDiff(currentSettingsNames, actualSettingsNames);

    function arrayDiff(arr1, arr2) {
      return arr1.filter(x => arr2.indexOf(x) === -1);
    }

    newSettingsList.forEach(
      settingName => newSettings[settingName] = settingsDefault[settingName]
    );

    chrome.storage.local.set(newSettings);
    chrome.storage.local.remove(obsoleteSettingsList);
  });
}

function injectSizeCss(tabId, val, prev) {
  browser.tabs.removeCSS(tabId, {
      allFrames: true,
      cssOrigin: 'user',
      code: btnStyle(prev)
    })
    .then(() =>
      browser.tabs.insertCSS(tabId, {
        allFrames: true,
        cssOrigin: 'user',
        runAt: 'document_start',
        code: btnStyle(val)
      })
    );
}

/* Turns on/off content script across all tabs */
function setCuteState(state) {
  const stateProps = state ? {
    text: 'on',
    color: '#6D6'
  } : {
    text: 'off',
    color: '#D66'
  };

  chrome.browserAction.setBadgeText({
    text: stateProps.text
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: stateProps.color
  });
}

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.get('isCute', items => chrome.storage.local.set({
    'isCute': !items.isCute
  }));
});

chrome.storage.onChanged.addListener(changes => {
  if(typeof changes.isCute === 'undefined')
    return;
  setCuteState(changes.isCute.newValue);
});
chrome.storage.local.get('isCute', items => setCuteState(items.isCute));