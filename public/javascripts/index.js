const loginPopup = document.querySelector('.login-popup')
const loginButtons = document.querySelectorAll('.login-button')
const registerPopup = document.querySelector('.register-popup')
const registerButtons = document.querySelectorAll('.register-button')
const homeLink = document.querySelector('.home-link')
const text = document.querySelector('.text')

console.dir(registerButtons)

function displayElem(elem) {
    elem.classList.add('d-block');
    elem.classList.remove('d-none')
}

function hideElem(elem) {
    elem.classList.add('d-none');
    elem.classList.remove('d-block')
}

function displayLoginPopup() {
    console.log('click')
    displayElem(loginPopup)
    hideElem(registerPopup)
    hideElem(text)
}

function displayRegisterPopup() {
    displayElem(registerPopup)
    hideElem(loginPopup)
    hideElem(text)
}

function displayText() {
    displayElem(text)
    hideElem(registerPopup)
    hideElem(loginPopup)
}

loginButtons.forEach((btn) => {
    console.log("add login click")
    btn.addEventListener('click', displayLoginPopup)
})

registerButtons.forEach((btn) => {
    console.log("add login click")
    btn.addEventListener('click', displayRegisterPopup)
})

homeLink.addEventListener('click', displayText)