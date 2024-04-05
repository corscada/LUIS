const LandUsage = (globalConfig) => {

  const metadata = {
    kind: 'execute',
  };

  const landUseMultiplier = 0.01036; // defualt global average

  const execute = async (inputs, config) => {

    let inputParamaters = ['cpu/energy'];
    if (config) {
      inputParamaters = config['input-paramaters'] | inputParamaters;
    }

    return inputs.map(input => {
      const energy = inputParamaters.reduce((a, b) => a + input[b], 0);
      const outputValue = energy * landUseMultiplier;

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
