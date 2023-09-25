'use strict';

const settingsDefault = {
  defaultSavePath: '',
  minSize: 256,
  exclusions: '.de-video-thumb, .de-ytube, .de-file-img, .html5-main-video, [alt="Subreddit Icon"], [src^="https://www.google.com/recaptcha/"]',
  icon: `url("${chrome.runtime.getURL('img/bestgirl-96.png')}")`,
  originalNameByDefault: false,
  hideButton: false,
  isCute: true,
  position: 'top-left',
  folders: [],
  placeUnderCursor: false, // TODO: change behavior, show button in the corner closest to the cursor
  saveOnHover: false,
  showSaveDialog: false,
  forbidDuplicateFiles: false,
  saveFullSized: true,
  domainExclusions: '',
  styleForSaveMark: '',
  classesForSaveMark: '',
  additionalCss: '',
  checkByRealImageSize: true,
  verticalOffset: 6,
  horizontalOffset: 6,
  btnSize: 64,
  saveHotkey: {
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    key: ' '
  },
  enableSaveHotkey: true
};