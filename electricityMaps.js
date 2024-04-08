const latest = async (zone) => {
  const url = `https://api.electricitymap.org/v3/power-breakdown/latest?${zone}`;

  try {
    const response = await fetch(url, {headers: {"auth-token": process.env.ELECTRICITY_MAPS_TOKEN}});
    const data = await response.json();

    return data.powerConsumptionBreakdown;
  } catch (e) {
    throw new Error(`Failed to fetch electricity maps data: ${e}`)
  }
};

module.exports = { latest };
