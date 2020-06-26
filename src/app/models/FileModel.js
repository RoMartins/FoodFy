const db = require ("../../config/db")
const fs = require('fs')

module.exports = {

    create({filename, path} ){
    const query =`
    INSERT INTO files (
        name,
        path
        ) VALUES ($1, $2)
    RETURNING id
    
`
const values = [
filename,
path
]

return db.query(query, values)

},

    receitas_files(id, receitaId){
    const query =`
    INSERT INTO receitas_files (
        file_id,
        receita_id
    ) VALUES ($1, $2)
    RETURNING id
    
`
const values = [
id,
receitaId
]

return db.query(query, values)

},
FindFile(id){
    return db.query(`SELECT *
    FROM files 
    left join receitas_files on ( receitas_files.file_id = files.id )
    where receita_id = $1 `, [id])
},
async delete(id) {
    try{
        const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
        const file = result.rows[0]
        fs.unlinkSync(file.path)
    }catch(err){
        console.log(err)
    }
   
    return db.query(`DELETE FROM files WHERE id = $1`, [id])
},

}