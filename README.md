# land-usage

Want to discover the land use intensity (LUI) of your software?

This plugin for the GSF Impact Framework takes kWh values and translates them to m2 land used based on the grid energy mix.

# Parameters

## Plugin config

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
- `electicity-maps-zone`: If using Electricity Map, zones can be specified. See [Electricity Map API zone docs](https://static.electricitymaps.com/api/docs/index.html#zones).

* Note that all sources that are not named will be included in other, which uses the average land use intensity score of the other sources for it's calculations. This will have greater impact on estimation of grid mixes using highter amounts of 'other' energy sources.

## Inputs

Any numerical value representing kWh.

## Outputs

An estimated LUI in m<sup>2</sup>.

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
