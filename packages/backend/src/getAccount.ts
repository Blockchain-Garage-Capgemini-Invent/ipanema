import Web3 from "web3";
const fs = require("fs");
const path = require("path");
var web3 = new Web3("https://alfajores-forno.celo-testnet.org");

const filePath = path.join(__dirname, "./.secret");

function getAccount() {
  return new Promise(resolve => {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, { encoding: "utf-8" }, (err: any, data: string) => {
        resolve(web3.eth.accounts.privateKeyToAccount(data));
      });
    } else {
      let randomAccount = web3.eth.accounts.create();

      fs.writeFile(filePath, randomAccount.privateKey, (err: any) => {
        if (err) {
          return console.log(err);
        }
      });

      resolve(randomAccount);
    }
  });
}

module.exports = {
  getAccount,
};
