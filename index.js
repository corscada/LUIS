const electricityMaps = require('./electricityMaps');

const LandUsage = async (globalConfig) => {

  const metadata = {
    kind: 'execute',
  };

  // data from https://unece.org/sites/default/files/2022-04/LCA_3_FINAL March 2022.pdf
  const landUseIntensityBySource = {
    gas: 0.001,
    coal: 0.015,
    nuclear: 0.0003,
    hydro: 0.0235,
    solar: 0.012,
    wind: 0.0013,
    other: 0.00885 // no data: average of above
  }

  // global settings
  let inputParameters = ['energy'];
  let landUseIntensityModifier = 0.01036; // default global average

  /**
   * Calculates the average LUI in m2 per kWh based on energy mix as % or kWh.
   */
  const calculateLandUseIntensity = (energySources) => {
    if (!energySources) return landUseIntensityModifier;
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

  if (globalConfig) {
    // override default global settings
    if (globalConfig['input-parameters']){
      inputParameters = globalConfig['input-parameters'];
    }

    if (globalConfig['use-electicity-maps']) {
      const liveGridMix = await electricityMaps.latest(globalConfig['electicity-maps-zone']);
      landUseIntensityModifier = calculateLandUseIntensity(liveGridMix);
    } else {
      landUseIntensityModifier = calculateLandUseIntensity(globalConfig['energy-sources']);
    }
  }

  const execute = async (inputs, config) => {
    // override global settings
    if (config) {
      inputParameters = !!config['input-parameters'] ? config['input-parameters'] : inputParameters;
      landUseIntensityModifier = calculateLandUseIntensity(config['energy-sources']);
    }

    return inputs.map(input => {
      // sum of each input parameter in kWh
      const totalEnergy = inputParameters.reduce((a, b) => a + input[b], 0);
      // kWh * m2 per kWh/y == land usage intensity over a year
      const outputValue = totalEnergy * landUseIntensityModifier;

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
