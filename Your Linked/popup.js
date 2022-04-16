const notelist = [];
const RENDER_EVENT = "render-notelist";
const STORAGE_KEY = 'notelist_storage';

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert('Mohon maaf, Browser Anda tidak support local storage');
        return false;
    }

    return true;
}

function generateId() {
    return +new Date();
}

function generateNoteObject(id, title, textNote, timestamp) {
    return {
        id,
        title,
        textNote,
        timestamp
    }
}

function findNoteItem(itemId) {
    for(let noteItem of notelist) {
        if(noteItem.id === itemId) {
            return noteItem;
        }
    }
}
function findNoteItemIndex(itemId) {
    for(index in notelist){
        if(notelist[index].id === itemId){
            return index
        }
    }
    return -1
}

function makeNotelist(noteObject) {

    const {id, title, textNote, timestamp} = noteObject;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;
    textContainer.append(textTitle);

    if(textNote != '') {
        const textNoted = document.createElement("a");
        textNoted.href = textNote;
        textNoted.target = "_blank";

        const linkbutton = document.createElement("button");
        linkbutton.innerText = "Kunjungi";
        linkbutton.classList.add('btn-small');

        textNoted.append(linkbutton);

        textContainer.append(textNoted);
    }

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
    container.setAttribute("id", `notelist-${id}`);
    
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
        removeNoteItem(id);
    });

    container.append(trashButton);

    return container;
}

function addNoteList() {
    const title = document.getElementById("title").value;
    const textNote = document.getElementById("textNote").value;
    const timestamp = new Date();

    const generatedID = generateId();
    const noteObject = generateNoteObject(generatedID, title, textNote, timestamp)
    notelist.push(noteObject)
    
    document.dispatchEvent(new Event(RENDER_EVENT))

    var showFormButton = document.querySelector('.show-input-form');
    var inputFormContainer = document.getElementById('add-note');
    
    showFormButton.hidden = false;
    inputFormContainer.hidden = true;

    saveData();
}


function removeNoteItem(noteItemId) {
    const noteItemTarget = findNoteItemIndex(noteItemId);
    if(noteItemTarget === -1) return;
    notelist.splice(noteItemTarget, 1);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if(isStorageExist()) {
        const notelist_data = JSON.stringify(notelist);
        localStorage.setItem(STORAGE_KEY, notelist_data);
    }
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null) {
        for(noteItem of data){
            notelist.push(noteItem);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Event Listener
document.addEventListener("DOMContentLoaded", function () {

    const submitForm  = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addNoteList();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const notedList = document.getElementById("note-list");

    notedList.innerHTML = ""

    for(noteItem of notelist){
        const notelistElement = makeNotelist(noteItem);
        notedList.append(notelistElement);
    }
})

document.querySelector('.show-input-form').addEventListener('click', function(){
    var showFormButton = document.querySelector('.show-input-form');
    var inputFormContainer = document.getElementById('add-note');
    
    showFormButton.hidden = true;
    inputFormContainer.hidden = false;
});

document.getElementById('cancel-input').addEventListener('click', function(){
    var showFormButton = document.querySelector('.show-input-form');
    var inputFormContainer = document.getElementById('add-note');
    
    showFormButton.hidden = false;
    inputFormContainer.hidden = true;
});