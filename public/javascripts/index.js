const loginPopup = document.querySelector('.login-popup')
const loginButtons = document.querySelectorAll('.login-button')
const registerPopup = document.querySelector('.register-popup')
const registerButtons = document.querySelectorAll('.register-button')
const homeLink = document.querySelector('.home-link')
const text = document.querySelector('.text')
const petsitterLoginPopup = document.querySelector('.petsitter-login')
const petownerLoginPopup = document.querySelector('.petowner-login')
const petsitterLoginButton = document.getElementById("petsitter-login-btn")
const petownerLoginButton = document.getElementById("petowner-login-btn")
const petsitterRegisterPopup = document.querySelector('.petsitter-register')
const petownerRegisterPopup = document.querySelector('.petowner-register')
const petsitterRegisterButton = document.getElementById("petsitter-register-btn")
const petownerRegisterButton = document.getElementById("petowner-register-btn")
const test = "jsut for test"
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

function displayPetOwnerLoginPopup(){
    console.log('owner')
    displayElem(petownerLoginPopup)
    hideElem(petsitterLoginPopup)
    petownerLoginButton.classList.remove('deactived');
    petownerLoginButton.classList.add('actived');
    petsitterLoginButton.classList.remove('actived');
    petsitterLoginButton.classList.add('deactived');
}

function displayPetSitterLoginPopup(){
    console.log('sitter')
    displayElem(petsitterLoginPopup)
    hideElem(petownerLoginPopup)
    petsitterLoginButton.classList.remove('deactived');
    petsitterLoginButton.classList.add('actived');
    petownerLoginButton.classList.remove('actived');
    petownerLoginButton.classList.add('deactived');
}

function displayPetOwnerRegisterPopup(){
    console.log('owner')
    displayElem(petownerRegisterPopup)
    hideElem(petsitterRegisterPopup)
    petownerRegisterButton.classList.remove('deactived');
    petownerRegisterButton.classList.add('actived');
    petsitterRegisterButton.classList.remove('actived');
    petsitterRegisterButton.classList.add('deactived');
}

function displayPetSitterRegisterPopup(){
    console.log('sitter')
    displayElem(petsitterRegisterPopup)
    hideElem(petownerRegisterPopup)
    petsitterRegisterButton.classList.remove('deactived');
    petsitterRegisterButton.classList.add('actived');
    petownerRegisterButton.classList.remove('actived');
    petownerRegisterButton.classList.add('deactived');
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