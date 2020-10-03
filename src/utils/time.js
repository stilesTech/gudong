function getCurrentTimestamp()
{
  return Date.parse(new Date()) / 1000;
}

module.exports = {
  getCurrentTimestamp: getCurrentTimestamp,
}