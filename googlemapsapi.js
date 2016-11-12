// use to show tee off and green

var map;
function initMap() {
    var teeOffLat = 40.4287968880878;
    var teeOffLng = -111.907022595406;

    var flagLat = 40.4289071414682;
    var flagLng = -111.903374791145;

    var mapLat = (teeOffLat + flagLat) / 2;
    var mapLng = (teeOffLng + flagLng) / 2;

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: mapLat, lng: mapLng},
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    var teeOffImage = '';
    var teeOffMarker = new google.maps.Marker({
        position: {lat: teeOffLat, lng: teeOffLng},
        map: map,
        icon: teeOffImage
    });
    var teeOffInfowindow = new google.maps.InfoWindow({
        content: `
        <div>
            <h2>Hole 18</h2>
            <h3>Yardage: 337</h3>
        </div> 
        `
    });
    teeOffMarker.addListener('click', function() {
        teeOffInfowindow.open(map, teeOffMarker);
    });
    var flagImage = '';
    var flagMarker = new google.maps.Marker({
        position: {lat: flagLat, lng: flagLng},
        map: map,
        icon: flagImage
    });
}