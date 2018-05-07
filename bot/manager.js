
// hashmap = {userId: talk}
const managerAnswers = {};

function getTalk(userId) {
  return managerAnswers[userId];
}
function registerTalk(userId, Talk){
  managerAnswers[userId] = Talk;
  return Talk;
}

module.exports = {

  getTalk,
  registerTalk
  
}