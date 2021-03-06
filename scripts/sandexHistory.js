const fetch = require('node-fetch');

getHistory();

function getHistory() {

  var date = new Date(2019,4,1)
  var days = []
  
  for ( i = 0; i <= 0; i++ ) {
    const hours = fetchHours(date);
    var day = {
      theDate: date.toDateString(),
      isSandex: doesDayContainSandex(hours)
    }
    days = days.concat(day);
    date.setDate(date.getDate() + 1);
  }
  //console.table(days);
}

async function fetchHours(date) {
    try {
      // West Chester, PA is lat 39.9444, lon -75.1638
      const darkSkyApiKey = process.env.DARK_SKY_API_KEY;
      const apiLat = '39.9444';
      const apiLon = '-75.1638';
      var unixDate = date.getTime() / 1000;
      var apiUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${apiLat},${apiLon},${unixDate}?exclude=flags,minutely,daily,alerts`;
  
      const response = await fetch(apiUrl)
      const json = await response.json()
      const hours = json.hourly.data;

      console.table(hours)

      for ( var i = 0; i <= hours.length; i++ ) {
        if ( isSandex(hours[i].temperature, hours[i].humidity ) ) {
          return true;
        }
      }
      return false



      
    } catch (error) {
      console.log(error.response.body);
    }
}

function isSandex(temperature, humidity) {
  if ( ( +humidity >= 0.3) && 
    ( +humidity <= 0.6 ) && 
    ( temperature >= temperatureLowerBound(humidity) ) &&
    ( temperature <= temperatureUpperBound(humidity ) )
  ) {
      return true;
    }
  return false;
}
  
function temperatureLowerBound ( humidity ) { return (-3.3333333 * +humidity) + 70; } 
function temperatureUpperBound ( humidity ) { return (-13.3333333 * +humidity) + 86; }
  
