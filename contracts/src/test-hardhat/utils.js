const revert = (messages) =>
  `VM Exception while processing transaction: reverted with reason string '${messages[0]}'`;

module.exports = {
  revert,
};
