var TrafficRecord= artifacts.require("./TrafficRecord.sol");

module.exports = function(deployer) {
  deployer.deploy(TrafficRecord);
};