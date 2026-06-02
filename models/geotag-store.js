// File origin: VS1LAB A3

const GeoTag = require('./geotag.js');

class GeoTagStore{
    // Privater GeoTag Supermarkt
    #geoTagArray = [];

    #EARTH_RADIUS = 6371;

    // Komm Junge! Füll das Regal auf!
    addGeoTag(gt) {
        if (!(gt instanceof GeoTag)) {
            throw new Error('GeoTag Object bitttäää');
        }
        
        this.#geoTagArray.push(gt);
    }

    // Heute geh ich einkaufen
    // Und kaufe das erste produkt was mir passt
    removeGeoTag(name) {
        const index = this.#geoTagArray.findIndex(gt => gt.name === name);
        if (index !== -1) this.#geoTagArray.splice(index, 1);
    }

    // Inventur
    count() {
        return this.#geoTagArray.length;
    }

    // Damit kannst du GeoTags mit einem keyword (Suchbegriff) durchsuchen
    // Du kannst sogar den Suchbereich festlegen (geoTags), musst du aber nicht
    // keyword darf '' sein, dann wird das gesamte geoTagArray wider ausgegeben
    searchGeoTags(keyword, geoTags = this.#geoTagArray) {
        const _keyword = String(keyword).trim();
        if(_keyword === '') return [...this.#geoTagArray];

        return geoTags.filter(gt => {
            const nameMatch = gt.name && gt.name.toLowerCase().includes(_keyword);
            const hashMatch = gt.hash && gt.hash !== "#n/a" && gt.hash.toLowerCase().includes(_keyword);
            return nameMatch || hashMatch;
        })
    }
    
    // helperr
    #toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // helperr
    #calcDistBetwLocs(lat0, lon0, lat1, lon1) {
        const dLat = this.#toRadians(lat1 - lat0);
        const dLon = this.#toRadians(lon1 - lon0);
        const a = Math.sin(dLat / 2) *
                  Math.sin(dLat / 2) +
                  Math.cos(this.#toRadians(lat0)) *
                  Math.cos(this.#toRadians(lat1)) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.#EARTH_RADIUS * c;
    }

    // Damit bekommst du alle geoTags die in einem bestimmten radius um einen GeoTag drum herum sind.
    // Radius in km
    getNearbyGeoTagsByTag(gt0, radius = this.#EARTH_RADIUS) {
        if(!(gt0 instanceof GeoTag)) {
            throw new Error('GeoTag Objectttttt, määäääänsch');
        }

        return this.#geoTagArray.filter(gt1 => {
            return this.#calcDistBetwLocs(gt0.lat, gt0.lon, gt1.lat, gt1.lon) <= radius;
        });
    }

    // Das ist die selbe Funktion wie die obere, nur dreht es sich hier um coordinaten
    // Praktisch, wenn das Zentrum des Gebiets kein GeoTag hat oder du kein Objekt erstellen willst.
    // Radius in km
    getNearbyGeoTagsByCoords(lat, lon, radius = this.#EARTH_RADIUS) {
        const _lat = Number(lat);
        const _lon = Number(lon);

        if (isNaN(_lat) || isNaN(_lon)) {
            throw new Error(`Lon and lat must be a number, got ${typeof lon} and ${typeof lat}`);
        }

        return this.#geoTagArray.filter(gt => this.#calcDistBetwLocs(_lat, _lon, gt.lat, gt.lon) <= radius);
    }

    // Hier ist die suche mit Suchbegriff und die Bereicheingrenzung kombiniert worden °o°
    // Hier einmal mit geoTag-Objekt als Zentrum wieder.
    // keyword darf '' sein
    // Radius in km
    searchNearbyGeoTagsByTag(gt, keyword, radius = this.#EARTH_RADIUS) {
        if(!(gt instanceof GeoTag)) {
            throw new Error("Komm on gibt mir doch einfach n geoTag Objekt oder nutze searchNearbyGeoTagsByCoords");
        }

        if (typeof keyword !== 'string') {
            throw new TypeError(`Keyword must be a string, got ${typeof keyword}`);
        }

        const nearbyTags = this.getNearbyGeoTagsByTag(gt, radius);

        if(keyword.trim() === '') {
            return [...this.#geoTagArray];
        }

        return this.searchGeoTags(keyword, nearbyTags);
    }

    // Und mit coordinaten als Zentrum wieder.
    // keyword darf '' sein
    // Radius in km
    searchNearbyGeoTagsByCoords(lat, lon, keyword, radius = this.#EARTH_RADIUS) {
        if (typeof keyword !== 'string') {
            throw new TypeError(`Keyword must be a string, got ${typeof keyword}`);
        }
        
        const _lat = Number(lat);
        const _lon = Number(lon);

        if (isNaN(_lat) || isNaN(_lon)) {
            throw new Error(`Lon and lat must be a number, got ${typeof lon} and ${typeof lat}`);
        }
        
        const nearbyTags = this.getNearbyGeoTagsByCoords(_lat, _lon, radius);

        if(keyword.trim() === '') {
            return [...this.#geoTagArray];
        }

        return this.searchGeoTags(keyword, nearbyTags);
    }
}

module.exports = GeoTagStore
