# Land Use Intensity of Software (LUIS)

`LUIS` estimates the Land Use Intensity of your software.

Energy technologies, for example, solar photovoltaics, coal power, and hydropower, can use huge amounts of land throughout their lifecycle.

Based on the energy used to operate your software, and the mix of energy sources in the grid, this plugin estimates the area of land that needs to be used for a year to produce the energy needed by your software (m2/y).

## Parameters

### Plugin global config

Optional fields:

- `input-parameters`: A list of parameters containing kWh values to compute total land usage.
 By default `'energy'` parameter is used.
- `energy-sources`: Takes a list of kWh or percentage values describing the energy grid mix. See example manifest below. The following are accepted sources:
  - gas
  - coal
  - nuclear
  - hydro
  - solar
  - wind
  - other*
- `use-electicity-maps`: Uses Electricity Maps API as data source for grid mix. Valid values include `latest`. See [Electricity Maps API docs](https://static.electricitymaps.com/api/docs/index.html).
- `electicity-maps-zone`: If using Electricity Maps, zones can be specified. See [Electricity Map API zone docs](https://static.electricitymaps.com/api/docs/index.html#zones).

\* Note that all sources that are not named will be included in other, which uses the average land use intensity score of the other sources for it's calculations. This will have greater impact on estimation of grid mixes using highter amounts of 'other' energy sources.

### Inputs

The energy used to operate your software in kWh.

## Returns

Estimated Land Use Intensity of your software in m<sup>2</sup>/y.

## Calculation
```pseudocode
Energy used for the operating of Software x Land Use Intensity of Energy (LUIE) = Land Use Intensity of Software (LUIS)
```

Land Use Intensity of Energy (LUIE) is the area of land that needs to be used for a year to produce 1kWh of energy (m2/kWh/y). To calculate LUIE we consider the Land Use Intensity of different energy sources (e.g. coal power, solar photovoltaics, etc.) and the mix of these energy sources in the grid. 

### Land use intensity of energy sources

| Energy Source | LUI      |
|---------------|----------|
| Gas           | 0.001    |
| Coal          | 0.015    |
| Nuclear       | 0.0003   |
| Hydro         | 0.0235   |
| Solar         | 0.012    |
| Wind          | 0.0013   |

Sources: 
- [UNECE (2022). Integrated Life-cycle Assessment
of Electricity Sources.](https://unece.org/sites/default/files/2022-04/LCA_3_FINAL%20March%202022.pdf)
- [Jessica Lovering, Marian Swain, Linus Blomqvist,Rebecca R. Hernandez (2022). Land-use intensity of electricity production and tomorrow’s energy landscape](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0270155#sec004)

### Global Energy Mix
If you do not specify a custom energy mix, or use electricity maps, by default, we use the global energy mix.

| Energy Source | Percentage of global energy |
|---------------|-----------------------------|
| Gas           | 22.45                       |
| Coal          | 35.63                       |
| Nuclear       | 9.18                        |
| Hydro         | 14.96                       |
| Solar         | 4.57                        |
| Wind          | 7.32                        |
| Other         | 3.49                        |

Source:
- [Energy Institute- Statistical Review of World Energy (2023)](https://www.energyinst.org/statistical-review)


## Implementation

To run the plugin, you must first create an instance of `LandUsage` and call its `execute()` function to return `land-usage`

```typescript
import {LandUsage} from './land-usage';

const landUsage = LandUsage();
const result = await landUsage.execute([
  {
    'energy': 0.024343,
  },
]);
```

## Example manifest

IF users will typically call the plugin as part of a pipeline defined in a `manifest`
file. In this case, instantiating the plugin is handled by
`ie` and does not have to be done explicitly by the user.
The following is an example `manifest` that calls 'land-usage'`:

```yaml
name: land-usage-demo
description: example calculating LUI
tags:
initialize:
  plugins:
    land-usage:
      path: 'land-usage'
      method: LandUsage
      global-config:
        input-parameters: ['energy']
        energy-sources:
          solar: 50
          wind: 20
          gas: 30
tree:
  children:
    child:
        - land-usage
      inputs:
        - timestamp: 2023-07-06T00:00
          energy: 3.5
        - timestamp: 2023-07-06T00:10
          energy: 2.9
```

You can run this example `manifest` by saving it as `./examples/manifests/test/land-usage.yml` and executing the following command from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-plugins

git clone https://github.com/corscada/land-usage
cd land-usage
npm link
cd ..
npm link land-usage

ie --manifest ./examples/manifests/test/csv-export.yml.yml --output ./examples/outputs/csv-export.yml.yml
```

The results will be saved into the `output-path`.
