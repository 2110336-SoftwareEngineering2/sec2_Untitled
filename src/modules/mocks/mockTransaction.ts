export let mockTransaction = {
    entityList: [
        { id: 1, performerId: 1000001, receiverId: 2000001, createDatetime: new Date("2021/4/28 16:00:00"), description: "Pabhanuwat requested your service" },
        { id: 2, performerId: 1000001, receiverId: 2000001, createDatetime: new Date("2021/4/28 14:00:00"), description: "Pabhanuwat sent you a message" },
        { id: 3, performerId: 2000001, receiverId: 1000001, createDatetime: new Date("2021/4/27"), description: "Suchada sent you a message" },
        { id: 3, performerId: 2000001, receiverId: 1000001, createDatetime: new Date("2021/1/1"), description: "Suchada sent you a message" },
        { id: 4, performerId: 2000001, receiverId: 1000001, createDatetime: new Date("2019/1/1"), description: "Suchada sent you a message" }
    ],
    save,
    find
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
