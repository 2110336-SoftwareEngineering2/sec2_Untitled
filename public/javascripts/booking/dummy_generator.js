let axios = require('axios');
const { profile } = require('console');
let faker = require('faker')

// How many dummy would be generated
// SHOULD NOT BE OVER 200 !!!
const PET_SITTER_TIMES = 0;
const PET_OWNER_TIMES = 0;
const PET_TIMES = 0;
const PET_SITTER_REVIEW_TIMES = 0;
const PET_OWNER_REVIEW_TIMES = 0;
const PET_SITTER_ANIMAL_TIMES = 100;

const PET_OWNER_COUNT = 11; // Set this if gernerating [pet, reviews]
const PET_SITTER_COUNT = 29; // set this if generating [reviews, sitter_animal]

const SEX = ["M", "F"]
const BANKS = ["bbl", "kbank", "ktb", "tmb", "scb", "bay", "kkp", "tbank"]
const PET_TYPES = ["dog", "cat", "rabbit", "fish", "guinea pig", "bird", "reptile", "lizard", "horse", "small mammal", "farm animal", "exotic pet"]
const MAX_PRICE_RATE = 99999
const SERVICES = ["dog walking", "pet feeding", "pet sitting", "pet grooming", "boarding", "overnight care", "training", "behavioral training"]

const PET_SITTER = "petsitter"
const PET_OWNER = "petowner"
const PET = "pet"
const PET_SITTER_REVIEW = "petsitter_review"
const PET_OWNER_REVIEW = "petowner_review"
const SITTER_ANIMAL = "sitter_animal"

const PET_OWNER_START_ID = 1000001
const PET_SITTER_START_ID = 2000001

const BASE_URL = "https://se2-ypebr.run.goorm.io/dummy/"

function send_req(type, data){
    axios({
        url: BASE_URL + type,
        method: "POST",
        data: data
    })
        // .then(res => console.log(res.data))
        .catch(err => console.log(err.response.statusText))
}

async function random_cat_image(){
    return axios({
        url: "https://aws.random.cat/meow",
        method: "GET"
    })
}

async function random_profile(){
    return axios({
        url: "https://randomuser.me/api/",
        method: "GET"
    })
}

function random_services(){
    let temp = [...SERVICES] // clone an array
    let services = ""
    let times = faker.random.number({max: SERVICES.length, min: 1})
    for(let i=0; i<times; i++){
        let index = faker.random.number({max: temp.length-1, min: 0})
        services += temp[index] + ", "
        temp.splice(index, 1)
    }
    return services
}

async function pet_sitter_dummy_gen(times){
    for(let i=0; i<times; i++){
        let profile = (await random_profile()).data.results[0]
        let data = {
            id: 2000001 + i,
            username: profile.login.username.substr(0, 20),
            password: faker.internet.password(),
            fname: profile.name.first,
            lname: profile.name.last,
            signUpDate: profile.registered.date,
            rating: faker.random.number({max: 5, min:0, precision: 0.1}),
            gender: profile.gender == "male" ? "M" : "F",
            priceRate: faker.random.number({ max: MAX_PRICE_RATE, min: 1, precision: 0.01}),
            location: faker.address.streetAddress() + ' '
                + faker.address.secondaryAddress() + ' '
                + faker.address.state() + ' '
                + faker.address.country() + ' '
                + faker.address.zipCode(),
            bank: faker.random.arrayElements(BANKS, 1)[0],
            bankAccount: faker.finance.account(10),
            locationName: faker.company.companyName(),
            picUrl: profile.picture.large,
            reviewerAmount: 0,
            description: faker.lorem.paragraph().substr(0, 200),
            services: random_services()
        }
        send_req(PET_SITTER, data)
    }
}

async function pet_owner_dummy_gen(times){
    for(let i=0; i<times; i++){
        let profile = (await random_profile()).data.results[0]
        let data = {
            id: 1000001 + i,
            username: profile.login.username.substr(0, 20),
            password: faker.internet.password(),
            fname: profile.name.first,
            lname: profile.name.last,
            signUpDate: profile.registered.date,
            rating: faker.random.number({max: 5, min:0, precision: 0.1}),
            gender: profile.gender == "male" ? "M" : "F",
            picUrl: profile.picture.large,
            reviewerAmount: 0,
        }
        send_req(PET_OWNER, data)
    }
}

async function pet_dummy_gen(times){
    for(let i=0; i<times; i++){
        let catImg = await random_cat_image()
        let data = {
            type: faker.random.arrayElements(PET_TYPES, 1)[0],
            name: faker.name.firstName(),
            gender: faker.random.arrayElements(SEX, 1)[0],
            yearOfBirth: faker.random.number({max: 2021, min: 2010}),
            appearance: faker.lorem.sentence(),
            // owner: PET_OWNER_START_ID + PET_OWNER_COUNT - faker.random.number({
            //     max: PET_OWNER_COUNT,
            //     min: 1
            // }),
            owner: 1000012,
            picUrl: catImg.data.file
        }
        send_req(PET, data)
    }
}

function pet_sitter_review_gen(times){
    for(let i=0; i<times; i++){
        let data = {
            rating: faker.random.number({max: 5, min:0, precision: 0.1}),
            description: faker.random.words(faker.random.number({max: 7, min: 1})),
            owner: PET_OWNER_START_ID + PET_OWNER_COUNT - faker.random.number({
                max: PET_OWNER_COUNT,
                min: 1
            }),
            sitter: PET_SITTER_START_ID + PET_SITTER_COUNT - faker.random.number({
                max: PET_SITTER_COUNT,
                min: 1
            })
        }
        send_req(PET_SITTER_REVIEW, data)
    }
}

function pet_owner_review_gen(times){
    for(let i=0; i<times; i++){
        let data = {
            rating: faker.random.number({max: 5, min:0, precision: 0.1}),
            description: faker.random.words(faker.random.number({max: 7, min: 1})),
            owner: PET_OWNER_START_ID + PET_OWNER_COUNT - faker.random.number({
                max: PET_OWNER_COUNT,
                min: 1
            }),
            sitter: PET_SITTER_START_ID + PET_SITTER_COUNT - faker.random.number({
                max: PET_SITTER_COUNT,
                min: 1
            })
        }
        send_req(PET_OWNER_REVIEW, data)
    }
}

function sitter_animal_gen(times){
    for(let i=0; i<times; i++){
        let data = {
            type: faker.random.arrayElements(PET_TYPES, 1)[0],
            sitterId: PET_SITTER_START_ID + PET_SITTER_COUNT - faker.random.number({
                max: PET_SITTER_COUNT,
                min: 1
            })
            
        }
        send_req(SITTER_ANIMAL, data)
    }
}

function getRandomDate(){
    let d = faker.random.number({max: 31, min: 1})
    let M = faker.random.number({max: 12, min: 1})
    let y = faker.random.number({max: 2021, min: 2018})
    let h = faker.random.number({max: 23, min: 0})
    let m = faker.random.number({max: 59, min: 0})
    let s = faker.random.number({max: 59, min: 0})

    return new Date(y, M, d, h, m, s).toISOString();
}

pet_sitter_dummy_gen(PET_SITTER_TIMES);
pet_owner_dummy_gen(PET_OWNER_TIMES);
pet_dummy_gen(PET_TIMES);
pet_sitter_review_gen(PET_SITTER_REVIEW_TIMES)
pet_owner_review_gen(PET_OWNER_REVIEW_TIMES);
sitter_animal_gen(PET_SITTER_ANIMAL_TIMES)