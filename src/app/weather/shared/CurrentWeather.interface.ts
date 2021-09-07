export interface CurrentWeather {
  coord: {
    lon: number,
    lat: number
  },
  weather: [{description: string, icon: string}],
  main: {temp: number},
  name: string
}
