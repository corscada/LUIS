const LandUsage = (globalConfig) => {

  const metadata = {
    kind: 'execute',
  };

  const landUse = 0.0000018330936073059; //global average defualt

  const execute = async (inputs, config) => {

    return inputs.map(input => {
      const energy = input['cpu/energy'];
      const outputValue = energy * landUse;

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
