/* ============= Persist data with LevelDB =============
|  Learn more: level - https://github.com/Level/level  |
===================================================== */

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add block to levelDB with key/value pair
function addBlockToDB(key,value){
    return new Promise((resolve, reject) => {
        db.put(key, value, (error) =>  {
        if (error){
            reject(error) }
        console.log(`addBlockToDB: Block added ${key}`)
        resolve(`Block added ${key}`)
        });
    })
}

// Get block from levelDB with key
function getBlockFromDB(key){
    return new Promise((resolve, reject) => {
        db.get(key,(error, value) => {
        if (error){
            reject(error)
        }
        console.log(`getBlockFromDB: Block requested ${value}`)
        resolve(value)
        });
    })
}

// Get block height
function getBlockHeightFromDB() {
    return new Promise((resolve, reject) => {
        let height = -1

        db.createReadStream().on('data', (data) => {
            height++
        }).on('error', (error) => {
            reject(error)
        }).on('close', () => {
            console.log(`getBlockHeightFromDB: Block Height ${height}`)
            resolve(height)
        })
    })
}

module.exports.getBlockFromDB = getBlockFromDB;
module.exports.addBlockToDB = addBlockToDB;
module.exports.getBlockHeightFromDB = getBlockHeightFromDB;
