'use strict';

const elem = {};

/*
-------------------- Generic functions --------------------
*/
function loadOptions(){
    browser.storage.local.get(settingsDefault).then(function(result){
        Object.keys(settingsDefault).forEach(function(key){
            elem[key][elem[key].de_val] = result[key];
        });
        refreshIcon();
        saveOptions();
    });
}

function saveOptions(){
    let settings = {};
    Object.keys(settingsDefault).forEach(function(key){
        settings[key] = elem[key][elem[key].de_val];
    });
    browser.storage.local.set(settings);
    disableSave();
}

function resetOptions(){
    Object.keys(settingsDefault).forEach(function(key){
        elem[key][elem[key].de_val] = settingsDefault[key];
    });
    refreshIcon();
    enableSave();
}

function disableSave(){
    elem.save.disabled = true;
}

function enableSave(){
    elem.save.disabled = false;
}

/*
-------------------- Icon --------------------
*/
function refreshIcon(){
    elem.iconDisplay.style.backgroundImage = elem.icon.value;
}

function fileInputListener(){
    let reader = new FileReader();
    reader.readAsDataURL(elem.fileInput.files[0]);
    reader.onload = function(){
        if (reader.result.length > 2097152) {
            console.log(reader.result.length); //TODO add proper error message
            return;
        }
        elem.icon.value = 'url("' + reader.result + '")';
        refreshIcon();
    };
}

/*
-------------------- Custom Directories --------------------
*/
function refreshFolders(){
    elem.folders.forEach(function(folder){

    });
}

function listenFolderKey(event){
    event.target.parentNode.querySelector('.keyCode').value = event.keyCode;
}

function addNewFolder(folderSettings = null){
    let newFolder = elem.container.querySelector('tr[data-num="0"]').cloneNode(true); //TODO put hidden blank template elsewhere
    let folders = document.querySelectorAll('.folder');
    let newFolderNum = Number(folders[folders.length - 1].dataset.num) + 1;


    newFolder.dataset.num = newFolderNum;
    let deleteBtn = newFolder.querySelector('.deleteFolder');
    deleteBtn.dataset.num = newFolderNum;
    deleteBtn.addEventListener('click', deleteFolder);
    newFolder.querySelector('span').innerHTML = '';
    if (folderSettings) {
    	fillFolder(newFolder, folderSettings);
    }
    elem.container.insertBefore(newFolder, elem.addFolderContainer);
}

function fillFolder(folderElem, folderSettings){
    folderElem.querySelector('.key').value      = folderSettings.key;
    folderElem.querySelector('.keyCode').value  = folderSettings.keyCode;
    folderElem.querySelector('.modifier').value = folderSettings.modifier;
    folderElem.querySelector('.path').value     = folderSettings.path;
}

function deleteFolder(event){
    document.querySelector('tr[data-num="' + event.target.dataset.num + '"]').remove();
}
function buildFolderSettings(folderElem){
    return {
        key     : folderElem.querySelector('.key'),
        keyCode : folderElem.querySelector('.keyCode'),
        modifier: folderElem.querySelector('.modifier'),
        path    : folderElem.querySelector('.path')
    };
}

/*
-------------------- Initialization --------------------
*/
function initSelectors(){
    let settingsElems = Object.keys(settingsDefault),
        otherElems = ['container', 'addFolder', 'addFolderContainer', 'save', 'reset', 'iconDisplay', 'fileInput'];

    settingsElems.forEach(function(name){
        elem[name] = document.querySelector('#' + name);
        elem[name].de_val = elem[name].type === 'checkbox' ? 'checked' : 'value';
    });
    otherElems.forEach(function(name){
        elem[name] = document.querySelector('#' + name);
    });

    elem.foldersList = [];
}

function init(){
    initSelectors();

    elem.fileInput.addEventListener('change', fileInputListener);
    elem.save.addEventListener('click', saveOptions);
    elem.reset.addEventListener('click', resetOptions);
    elem.addFolder.addEventListener('click', addNewFolder);
    document.querySelectorAll('select, input').forEach(function(elem){
        elem.addEventListener('input', enableSave);
    });

    disableSave();
    loadOptions();
}

document.addEventListener('DOMContentLoaded', init);
