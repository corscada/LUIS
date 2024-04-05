const latest = async (zone) => {
  const url = `https://api.electricitymap.org/v3/power-breakdown/latest?${zone}`;

  const response = await fetch(url, {headers: {"auth-token": process.env.ELECTRICITY_MAP_TOKEN}});
  const data = await response.json();

  return data.powerConsumptionBreakdown;
};

module.exports = { latest };
