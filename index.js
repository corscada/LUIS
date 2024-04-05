const electricityMaps = require('./electricityMaps');

const LandUsage = async (globalConfig) => {

  const metadata = {
    kind: 'execute',
  };


  const landUseIntensityBySource = {
    gas: 0.001,
    coal: 0.015,
    nuclear: 0.0003,
    hydro: 0.0235,
    solar: 0.012,
    wind: 0.0013,
    other: 0.00885 // no data: average of above
  }

  /**
   * Calculates the average LUI in m2 per kWh based on energy mix as % or kWh.
   */
  const calculateLandUseIntensity = (energySources) => {
    if (!energySources) return 0;
    let sourcesMap = new Map(Object.entries(energySources));

    // get total energy
    const totalEnergyMix = Array.from(sourcesMap.values()).reduce((a, b) => a + b);
    let totalLandUseIntensity = 0;

    sourcesMap.forEach((value, key) => {
      // get energy mix as percentage
      const percentage = value / totalEnergyMix;

      // get the land use intensity
      const landUseIntensityModifier = !!landUseIntensityBySource[key] ? landUseIntensityBySource[key] : landUseIntensityBySource['other'];
      totalLandUseIntensity += percentage * landUseIntensityModifier;
    });

    // return average land use intensity per kWh
    return totalLandUseIntensity / sourcesMap.size;
  };

  // global settings
  let globalInputParameters = ['energy'];
  let landUseIntensity = 0.01036; // defualt global average

  if (globalConfig) {
    globalInputParameters = globalConfig['input-parameters'] ? globalConfig['input-parameters'] : globalInputParameters;
    if (!globalConfig['use-electicity-maps']) {
      landUseIntensity = globalConfig['energy-sources'] ? calculateLandUseIntensity(globalConfig['energy-sources']) : landUseIntensity;
    } else {
      const liveGridMix = await electricityMap.latest(globalConfig['electicity-maps-zone']);
      landUseIntensity = calculateLandUseIntensity(liveGridMix);
    }
  }

  const execute = async (inputs, config) => {
    // override global settings
    let inputParameters = globalInputParameters;
    if (config) {
      inputParameters = config['input-parameters'] ? config['input-parameters'] : inputParameters;
      landUseIntensity = config['energy-sources'] ? calculateLandUseIntensity(config['energy-sources']) : landUseIntensity;
    }

    return inputs.map(input => {
      // sum of each input parameter in kWh
      const totalEnergy = inputParameters.reduce((a, b) => a + input[b], 0);
      // kWh * m2 per kWh == land usage intensity over a year
      const outputValue = totalEnergy * landUseIntensity;

      return {
        ...input,
        'land-usage': outputValue,
      };
    });
  };

  return {
    metadata,
    execute,
  };
};
exports.LandUsage = LandUsage;
