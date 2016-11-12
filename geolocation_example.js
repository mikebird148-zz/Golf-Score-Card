// example to use with weather api: openweathermap.org/current

    // function getGeolocation() {
    //     return new Promise(function (resolve, reject) {
    //         var options = {
    //             enableHighAccuracy: true;
    //         };
    //         function success(pos) {
    //             var coordinates = pos.coords;
    //
    //             console.log('Your current position is: ');
    //             console.log('Latitude: ' + coordinates.latitude);
    //             console.log('Longitude: ' + coordinates.longitude);
    //             console.log('More or less ' + coordinates.accuracy + 'meters.');
    //
    //             resolve(coordinates);
    //         }
    //         function error(error) {
    //             console.warn('Error(' + error.code + '): ' + error.message);
    //             reject(error);
    //         }
    //         navigator.geolocation.getCurrentPosition(success, error, options);
    //     })
    // }

    var options = {
        enableHighAccuracy: false
    };


    navigator.geolocation.getCurrentPosition(success, error, options);

    function success (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + position.latitude + '&lon=' + position.longitude + '&appid=5cbe8cf6e27eebce320c6337b703373e';
        $.getJSON(weatherUrl, jsonSuccess);
    }

    function error(error) {

    }

    function jsonSuccess(data) {
        $("#weather").text(data.weather[0]);
    }