const SHA256 = require('crypto-js/sha256');
const level = require('./level');
const Block = require('./block')

class Blockchain{
    constructor(){
      this.getBlockHeight().then((height) => {
        if (height === -1){
          this.addBlock(new Block("First block in the chain - Genesis block"))
        }
      })
    }
  
    // Add new block
    async addBlock(newBlock){
      // Block height
      const height = parseInt(await this.getBlockHeight())
      newBlock.height = height+1
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      // previous block hash
      if(newBlock.height>0){
        const previousBlockHeight = newBlock.height - 1 
        const previousBlock = JSON.parse(await this.getBlock(previousBlockHeight))
        newBlock.previousBlockHash = previousBlock.hash 
      }
      // Block hash with SHA256 using newBlock and converting to a string
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
      // Adding block object to chain
      await level.addBlockToDB(newBlock.height, JSON.stringify(newBlock));
    }
  
    // Get block height
    async getBlockHeight(){
      return await level.getBlockHeightFromDB().catch(e=>console.log("error",e))
    }
  
    // get block
    async getBlock(blockHeight){
      // return object as a single string
      return await level.getBlockFromDB(blockHeight);
    }
  
    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = JSON.parse(await (this.getBlock(blockHeight)))
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          console.log('Block is valid!')
          return true;
  
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }
  
    // Validate blockchain
    async validateChain(){
      let errorLog = [];
      for (var i = 0; i < await this.getBlockHeight-1; i++) {
        // validate block
        if (await !this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = JSON.parse(await this.getBlock(i)).hash;
        let previousHash = JSON.parse(await this.getBlock(i+1)).previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
        return false;
      } else {
        console.log('No errors detected');
        return true;
      }
    }
  }

  module.exports = new Blockchain();