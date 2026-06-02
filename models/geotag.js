// File origin: VS1LAB A3
// höhöhööö
// Ah ja GeoTag Klasse

class GeoTag {
    constructor(lat, lon, name, hash = "#n/a") {
        // Validate latitude
        if (typeof lat !== 'number' || isNaN(lat)) {
            throw new TypeError(`Latitude must be a number, got ${typeof lat}`);
        }
        if (lat < -90 || lat > 90) {
            throw new TypeError(`Latitude must be between -90 and 90, got ${lat}`);
        }
        this._lat = lat;

        // Validate longitude
        if (typeof lon !== 'number' || isNaN(lon)) {
            throw new TypeError(`Longitude must be a number, got ${typeof lon}`);
        }
        if (lon < -180 || lon > 180) {
            throw new TypeError(`Longitude must be between -180 and 180, got ${lon}`);
        }
        this._lon = lon;

        if (typeof name !== 'string') {
            throw new TypeError(`Name must be a string, got ${typeof name}`);
        }

        if (name.trim() === '') {
            throw new TypeError('Name cannot be empty');
        }

        this._name = name;

        const hashStr = (hash !== undefined && hash !== null) ? String(hash) : "#n/a";
        this._hash = hashStr.trim() === '' ? "#n/a" : hashStr;
    }

    get lat() {
        return this._lat;
    }
    
    get lon() {
        return this._lon;
    }
    
    get name() {
        return this._name;
    }
    
    get hash() {
        return this._hash;
    }
}

module.exports = GeoTag;
