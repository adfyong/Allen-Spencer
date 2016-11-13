var request = require('request-promise-native');

var accesstoken = process.env.JOBBER_ACCESS_TOKEN;
var googlekey = process.env.GOOGLE_KEY;




getProperties = function() {
    return request({
        method: 'GET',
        url: 'https://api.getjobber.com/api/properties',
        headers: {
            'X-API-VERSION': '2.2.0',
            'X-API-SIDE-LOADING': 'true',
            'X-API-ACCESS-TOKEN': accesstoken
        }
    }).then(function(response) {
        return response;
    });
};

module.exports.createProperty = function(coords) {
    return request({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        qs: {latlng: coords.lat + ',' + coords.long, key: googlekey}
    }).then(function(response) {
        var bigAddr = JSON.parse(response).results[0].address_components;
        var address = bigAddr[1].short_name + ' ' + bigAddr[2].short_name;
        var city = bigAddr[4].short_name;
        var province = bigAddr[6].short_name;
        var pc = bigAddr[7].short_name;
        var property = { property: {
            street1: address,
            city: city,
            province: province,
            pc: pc,
            latitude: coords.lat,
            longitude: coords.long,
            client: 10883960
        }};

        return getProperties().then(function(response) {
            return JSON.parse(response).properties;
        }).then(function(properties) {
            for (var prop of properties) {
                if (prop.street1 === address && prop.city === city) {
                    console.log("Already exists");
                    console.log(prop);
                    return prop;
                }

            }
            return request({
                method: 'POST',
                url: 'https://api.getjobber.com/api/properties',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-VERSION': '2.2.0',
                    'X-API-SIDE-LOADING': 'true',
                    'X-API-ACCESS-TOKEN': accesstoken
                },
                body: JSON.stringify(property)
            }).then(function(response) {
                console.log(response.property);
                return response.property;
            });
        });

    });
};