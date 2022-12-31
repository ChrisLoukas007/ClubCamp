mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/dark-v10", // stylesheet location
	center: club.geometry.coordinates, // starting position [lng, lat]
	zoom: 10, // starting zoom
});
//we wrote that becasue thanks to that we can rotate and control the map
map.addControl(new mapboxgl.NavigationControl());

//here we create the marker in order to point the location of club on map and also "setPoppup" is used in order to display on point the name and the location of club
new mapboxgl.Marker()
	.setLngLat(club.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h3>${club.title}</h3><p>${club.location}</p>`
		)
	)
	.addTo(map);
