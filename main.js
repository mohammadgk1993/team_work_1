$(document).ready(function() {
    let countries = []

    getCountries(countries)

    for (let i = 0 ; i < countries.length ; i++) {
        $('select').append(`<option>${countries[i].name}</option>`)
    }

    function getCountries(countriesArr) {
        $.ajax({
            type: 'get',
            url: 'https://restcountries.com/v2/all',
            dataType: 'json',
            async:false,
            success: function (responseCountry) {
                for (let i = 0 ; i < responseCountry.length ; i++) {
                    if (responseCountry[i].capital == undefined) {
                        continue
                    } else {
                        countriesArr.push({
                            'name':responseCountry[i].name,
                            'capital':responseCountry[i].capital,
                            'callingCode':responseCountry[i].callingCodes[0],
                            'flag':responseCountry[i].flag,
                            'population':responseCountry[i].population,
                            'timesZone':responseCountry[i].timezones[0],
                            'languages':responseCountry[i].languages.map(a => a.nativeName).join(' , '),
                            'nativeName':responseCountry[i].nativeName,
                            'region':responseCountry[i].region + ', ' + responseCountry[i].subregion,
                        })
                    }
                }
                countriesArr.sort((a, b) => (a.name > b.name) ? 1 : -1)
            }
        })
    }

    function getWeather(capital) {
        let weather = {}
        $.ajax({
            type: 'get',
            url: `http://api.weatherapi.com/v1/current.json?key=
            7f2465febfaf4cf5884193545232301&q=${capital}&aqi=no`,
            dataType: 'json',
            async:false,
            success: function (responseWeather) {
                weather = {
                    'icon':`https:${responseWeather.current.condition.icon}`,
                    'description':responseWeather.current.condition.text,
                    'windSpeed':`${(responseWeather.current.wind_kph/3.6).toFixed(2)} M/S`,
                    'humidity':`${responseWeather.current.humidity}%`,
                    'visibility':`${responseWeather.current.vis_km*1000} m`,
                    'temperature':`${responseWeather.current.temp_f} F`
                }
            }
        })
        return weather
    }

    $('select').change(function() {
        for (let i = 0 ; i < $('.main').children().length ; i++) {
            $('.main').children().eq(i).removeClass('d-none')
        }

        let selectedCountry = countries.find((item) => 
        item.name == $('option:selected').text())

        let selectedCapital = getWeather(selectedCountry.capital)
        console.log(selectedCapital)

        $('img').attr('src',selectedCountry.flag)
        $('iframe').attr('src',`https://maps.google.com/maps?q=${selectedCountry.capital}&t=&z=5&ie=UTF8&iwloc=&output=embed`)
        
        $('.country-specs').html(
            `<h3 class="bg-dark text-light text-center p-2 rounded-5">${selectedCountry.name}</h3>
            <p><span class="text-dark">Native Name:</span> ${selectedCountry.nativeName}</p>
            <p><span class="text-dark">Capital:</span> ${selectedCountry.capital}</p>
            <p><span class="text-dark">Region:</span> ${selectedCountry.region}</p>
            <p><span class="text-dark">Population:</span> ${selectedCountry.population}</p>
            <p><span class="text-dark">Languages:</span> ${selectedCountry.languages}</p>
            <p><span class="text-dark">Time Zone:</span> ${selectedCountry.timesZone}</p>`
        )

        $('.weather-specs').html(
            `<h3 class="bg-dark text-light text-center p-2 rounded-5">Capital Weather Report</h3>
            <div class="d-flex flex-column align-items-center">
                <img class="weather-icon" src="${selectedCapital.icon}">
                <p>${selectedCapital.description}</p>
            </div>
            <p><span class="text-dark">Wind Speed:</span> ${selectedCapital.windSpeed}</p>
            <p><span class="text-dark">Temperature:</span> ${selectedCapital.temperature}</p>
            <p><span class="text-dark">Humidty:</span> ${selectedCapital.humidity}</p>
            <p><span class="text-dark">Visibility:</span> ${selectedCapital.visibility}</p>`
        )

        $('.code').html(
            `<h3 class="bg-dark text-light text-center p-2 rounded-5">Calling Code</h3>
            <h1 class="calling-code d-flex justify-content-center">${selectedCountry.callingCode}
            </h1>`
        )
    })
})