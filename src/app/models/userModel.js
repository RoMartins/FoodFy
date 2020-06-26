const db = require ("../../config/db")
const {hash} = require('bcryptjs');


module.exports = {

        async FindOne(fields) {
            let query = `SELECT * FROM users`
    
            Object.keys(fields).map(key =>{
                query = `${query} 
                ${key}
                `
                Object.keys(fields[key]).map(field => {
                    query = `${query} ${field} = '${fields[key][field]}'`
                })
            })
    
           const results = await db.query(query)
           return results.rows[0]

    },

    async create(data, password){
        const query = `INSERT INTO users (
            name,
            email,
            password,
            is_adm
            ) VALUES ($1,$2,$3,$4) 
            RETURNING id
            `
            const password_hash = await hash(password, 8)


            const values = [
                data.name,
                data.email,
                password_hash,
                data.adm || false
            ]
        return db.query(query, values)

    },

    AllUsers(){
        return db.query(`SELECT * FROM users`)
    },

    Find(id){
        return db.query(`SELECT * FROM users WHERE id = $1`, [id])
    },

    update(data){
        const query = `
        UPDATE users SET
        name=($1),
        email=($2),
        is_adm=($3)
        WHERE id = $4
    `
    const values = [
        data.name,
        data.email,
        data.adm || false,
        data.id
    ]

    return db.query(query, values)
    },

    delete(id){
       return db.query(`DELETE FROM users WHERE id=$1`, [id])
    },

    async updateUser(id, fields){
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array)=>{
            if(index + 1 < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            }else{
                query = `${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
            `
            }

        })
        await db.query(query)
    },
}