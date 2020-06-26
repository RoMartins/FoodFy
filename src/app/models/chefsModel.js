const db = require ("../../config/db")
const { date } = require("../../lib/functions")
module.exports = {

allChefs(){
   return db.query(`SELECT chefs.*, files.path,count(receitas) as totalrec
   FROM chefs
   LEFT JOIN receitas ON (receitas.chef_id = chefs.id )
   LEFT JOIN files on ( chefs.file_id = files.id)
   GROUP BY chefs.id, files.path`)
},

all() {
   return db.query(`SELECT chefs.*,files.name, files.path
   FROM chefs
   left join files on ( chefs.file_id = files.id)`)
},

create(data, fileId){
    const query =`
    INSERT INTO chefs (
        nome_chef,
        file_id,
        created_at
    ) VALUES ($1, $2, $3)
    RETURNING id
`
const values = [
    data.nome,
    fileId,
date(Date.now()).iso

]

return db.query(query, values)

},
findRec(id){
     return db.query(`SELECT receitas_files.*,receitas.nome,receitas.chef_id, files.path
     FROM receitas_files
     left join receitas on ( receitas.id = receitas_files.receita_id)
     inner join files on ( files.id = receitas_files.file_id)
     where receitas.chef_id = $1`, [id])

},
find(id){
    return db.query(`SELECT chefs.*, count(receitas) AS total_rec
    FROM chefs
    LEFT JOIN receitas ON ( receitas.chef_id = chefs.id)
    WHERE chefs.id = $1
    GROUP BY chefs.id`, [id])   

},
update(data) {
    const query = `
        UPDATE chefs SET
        nome_chef=($1)
        WHERE id = $2
    `
    const values = [
        data.nome,
        data.id
    ]

    return db.query(query, values)
},

delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
},
FindFile(id){
   return db.query(`
Select files.name,files.path,files.id
from chefs
left join files on (chefs.file_id = files.id)
where chefs.id = $1
`,[id])
},
updateFileId(data, id){
    const query = `
    UPDATE chefs SET
    file_id = ($1)
    WHERE id = $2
    `
    const values = [
        id,
        data.id
    ]

    return db.query(query, values)
}
}