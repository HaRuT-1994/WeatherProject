export interface WeekWeather{
  hourly: [{
    dt: number,
    temp: number
  }],
  daily: [{
    dt: number,
    temp: {day: number},
    weather: [{icon: string}]
  }]
};
