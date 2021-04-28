import { PetOwner } from "src/entities"

export const mockRepo = {
    async findOne() {
        return "yay"
    },
    attr: "idk"
}

export const mockPetOwner = {
    entityList:[
        {id: 1000001, username: 'gark', fname: 'Pabhanuwat', lname: 'Pongsawad', signUpDate: new Date('2021-02-22'), rating: 5, gender: 'M'},
        {id: 1000002, username: 'arm', fname: 'Ong-art', lname: 'Pisansathienwong', signUpDate: new Date('2021-02-14'), rating: 4, gender: 'M', picUrl: "ong-art_pic"},
        {id: 1000003, username: 'fokenama', fname: 'Suchon', lname: 'Chatavaraha', signUpDate: new Date('2021-11-12'), rating: 0, gender: 'F', picUrl: "suchon_pic"},
        {id: 1000004, username: 'golf', fname: 'Patipan', lname: 'Buranangura', signUpDate: new Date('2021-01-01'), rating: 1, gender: 'M', picUrl: "patipan_pic"},
    ],
    save,
    findOne
}

export const mockPetSitter = {
    entityList:[
        {   id: 2000001, username: 'suchi', fname: 'Suchada', lname: 'Hnoonpakdee', signUpDate: new Date('2021-02-22'), rating: 5, gender: 'M',
            priceRate: 10, location: "a", bank: "Kasikorn", bankAccount: "1234567890", locationName:"Suchi Pet Shop", picUrl: "suchada_pic",
            reviewerAmount: 0, description:"idk", services:"dog", balance:100
        },
        {   id: 2000002, username: 'far', fname: 'Amnard', lname: 'Lungsun', signUpDate: new Date('2021-02-14'), rating: 4, gender: 'M',
            priceRate: 200, location: "b", bank: "SCB", bankAccount: "1111111111", locationName:"Far From Home", picUrl: "amnard_pic",
            reviewerAmount: 3, description:"idk", services:"dragon", balance:5
        },
    ],
    save,
    findOne
}

export const mockPet = {
    entityList: [
        {id: 3000001, type: "dog", name:"far-dog", gender:"M", yearOfBirth:2000, appearance: "black", picUrl: "farphoto.com", owner: 1000001},
        {id: 3000002, type: "cat", name:"far-cat", gender:"M", yearOfBirth:2001, appearance: "red", picUrl: "farphoto.com", owner: 1000001},
        {id: 3000003, type: "lizard", name:"far-lizard", gender:"F", yearOfBirth:2002, appearance: "white", picUrl: "farphoto.com", owner: 1000001},
        {id: 3000004, type: "turtle", name:"far-turtle", gender:"F", yearOfBirth:2003, appearance: "purple", picUrl: "farphoto.com", owner: 1000002},
    ],
    save,
    findOne,
    find
}

async function findOne(query) {
    if (isNaN(query)){
        return this.entityList.filter(entity => {
            let isValid = true
            for (const key in query) {
                if (entity[key] !== query[key]) {
                    isValid = false
                    break
                }
            }
            return isValid
        })[0]
    } else return this.entityList.filter(entity => entity.id === query)[0]
}

async function find(query) {
    if (isNaN(query)){
        return this.entityList.filter(entity => {
            let isValid = true
            for (const key in query) {
                if (entity[key] !== query[key]) {
                    isValid = false
                    break
                }
            }
            return isValid
        })
    } else return this.entityList.filter(entity => entity.id === query)
}

async function save(object) {
    let entity
    if (!object.id){
        let nextId = this.entityList[this.entityList.length - 1].id + 1
        entity = { ...object, id: nextId } // assign id
        this.entityList.push(entity)
    }
    else {
        entity = this.entityList.filter(entity => entity.id === object.id)[0]
        if (entity) entity = {...entity, ...object}
        else {
            entity = object
            this.entityList.push(entity)
        }
    }
    return entity
}