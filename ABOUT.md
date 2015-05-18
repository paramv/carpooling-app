# Trippie - Carpooling Simplified for the Office Goer

* Trippie is a web app that lets people share rides to work. The app provides a platform where users can sign up to offer/avail rides. 
* Primary target is people working in IT parks, SEZs and similar establishments. Why? 
	1. Safety - almost all employers issue some form of identification which will allow users to verify who their co-passengers are. 
	2. Office goers have a fixed location and standard timings (well,mostly). This means the initial list of locations will be limited. 
* How is it different?
	* The initial list of drop off points is limited to popular IT/industrial parks, SEZs etc. 
	* Due to the specific nature of the pick up and drop points, searching is easier. Since users would have their residential address and office address saved while registering with the app, in most cases there is no need to key in search terms to lookup rides. The only reason to do this would be if a user's pick up /drop off location has changed temporarily. Who knows, your next ride could result in the creation of a "Trippie Buddies" group in your messenger of choice
	* Encouraging people at the same workplace to interact. With the diverse nature of industrial parks, users need not even be in the same office to share a ride. At the same time, they need not spend their ride with the fear of travelling with complete strangers
	* Customize your ride preferences, for ex., "only ride with people who know Pink Floyd is a band,not a person"
	* Gives the user cool metrics on their rides - money saved, buddies made etc. Gives users bragging rights for doing their part in reducing carbon footprint, traffic congestion and road rage.
* How does it work?
	* Sign up with your details - work location, work timings, residential address, name, email address, vehicle information (if you have one) and most importantly phone number. 
	* The app requires a working mobile which needs to be verified at the time of signing up.
	* And you're ready to go, select whether you wish to offer or avail a ride and the app looks up available vehicles for your pick up location, work location and work timings.
	* The app will use a bunch of heuristics, to get the best matches for the users location and preferences
	* The search settings can be tweaked at anytime for ex., if a user is unhappy with their search results, they can  search from a map for other locations that are nearby
* How will it be implemented?
	* On the server - powered by NodeJS. Built using the Express framework and other open source tools and plugins for the bells and whistles
	* On the client - HTML5/CSS3/JavaScript. Responsive Web Design to support a mobile version of the interface. Will not support ancient browsers
	* APIs - Google Maps API, Twilio and others as required
* Why is this a web app and not a mobile app? For an MVP (Minimum Viable Product), a web version would be the fastest to build without compromising on the features. RWD allows the a web app to be optimised (atleast visually) for multiple devices. OS interoperability is an added bonus (works on iOS, Android and Windows Mobile devices as long as they have a supported browser)
