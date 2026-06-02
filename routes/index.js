const express = require('express');
const router = express.Router();
const GeoTag = require('../models/geotag');
const getStore = (req) => req.app.locals.geoTagStore;
const SEARCH_RADIUS = 10;

router.get('/', (req, res) => {
	const store = getStore(req);
  	res.render('index', {
  	  	taglist: store.searchGeoTags(''),
  	  	latitude: '0',
  	  	longitude: '0'
  	});
});

router.post('/tagging', (req, res) => {
	const store = getStore(req);
  	const latitude = parseFloat(req.body.latitude);
  	const longitude = parseFloat(req.body.longitude);
  	const name = req.body.name;
  	const hashtag = req.body.hashtag;

	if (isNaN(latitude) || isNaN(longitude)) {
    	return res.status(400).send('Invalid coordinates');
	}

	if (!name || name.trim() === '') {
    	return res.status(400).send('Name is required');
	}

  	const newTag = new GeoTag(latitude, longitude, name, hashtag);
	
	try{
		store.addGeoTag(newTag);

  		const taglist = store.getNearbyGeoTagsByTag(newTag, SEARCH_RADIUS);
		
  		res.render('index', {
  		  	taglist: taglist,
  		  	latitude: latitude,
  		  	longitude: longitude
  		});
	} catch(e) {
        console.error(e);
	
  		const taglist = store.getNearbyGeoTagsByCoords(latitude, longitude, SEARCH_RADIUS);
		
  		res.render('index', {
  		  	taglist: taglist,
  		  	latitude: latitude,
  		  	longitude: longitude
  		});
	}
});

router.post('/discovery', (req, res) => {
	const store = getStore(req);
  	const latitude = parseFloat(req.body.latitude);
  	const longitude = parseFloat(req.body.longitude);
  	const search = req.body.search;

	if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).send('Invalid coordinates');
	}

  	let taglist;

  	if (search && search.trim() !== '') {
  	  	taglist = store.searchNearbyGeoTagsByCoords(latitude, longitude, search, SEARCH_RADIUS);
  	} else {
  	  	taglist = store.getNearbyGeoTagsByCoords(latitude, longitude, SEARCH_RADIUS);
  	}

  	res.render('index', {
  	  	taglist: taglist,
  	  	latitude: latitude,
  	  	longitude: longitude
  	});
});

module.exports = router;