const Decredex = artifacts.require("./Decredex.sol");

// Use these values for seeding the contract
const institution = "0x916B6ec3a7a9D926374dE1206bfca14BDD59F1A1"
const student1 = "0x88316dF325044cfc226C369b6b32275E3cA782E5"
const student2 = "0xf867b117470b6Be8F6Fe6d1e34CaA35e61EDDe85"
const student3 = "0xEbe6719b26ebf13EC28AEC3Df236C5a89CD86C26"

module.exports = function (deployer) {

  deployer.deploy(Decredex, institution, student1, student2, student3);
};
