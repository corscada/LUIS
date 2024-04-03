const LandUsage = (globalConfig) => {
  console.log(globalConfig)

  const metadata = {
    kind: 'execute',
  };

  const execute = async (inputs, config) => {

    return inputs.map(input => {
      const energy = input['cpu/energy'];
      const outputValue = energy * 10;

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
