export const mockEmployee = {
    entityList:[
        {id: 1, username: 'admin1', fname: 'Pabhanuwat', lname: 'Pongsawad', signUpDate: new Date('2021-02-22'), rating: 5, gender: 'M'},
        {id: 2, username: 'arm', fname: 'Ong-art', lname: 'Pisansathienwong', signUpDate: new Date('2021-02-14'), rating: 4, gender: 'M'},
        {id: 3, username: 'fokenama', fname: 'Suchon', lname: 'Chatavaraha', signUpDate: new Date('2021-11-12'), rating: 0, gender: 'F'},
        {id: 4, username: 'golf', fname: 'Patipan', lname: 'Buranangura', signUpDate: new Date('2021-01-01'), rating: 1, gender: 'M'}
    ],
    findOne
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