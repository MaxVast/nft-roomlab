# RoomLab Project
## Back/Smart Contract
The list of the stack used for the Smart Contract :
- Hardhat
- ERC721
- OpenZeppelin library

```shell
npx hardhat coverage
REPORT_GAS=true npx hardhat test

npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```
### Coverage smart contract :
24 tests.
24 passing (5s)

File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
 contracts/   |    96.67 |    92.86 |    93.33 |     97.5 |                |
  Roomlab.sol |    96.67 |    92.86 |    93.33 |     97.5 |            174 |
--------------|----------|----------|----------|----------|----------------|
All files     |    96.67 |    92.86 |    93.33 |     97.5 |                |
--------------|----------|----------|----------|----------|----------------|

Uncovered line 174 is a mandatory implementation function (_increaseBalance()) for the smart contract, but it is not modified or used.
