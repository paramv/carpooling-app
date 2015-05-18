## The Box algorithm

The algorithm defines a technique that tries to return the best match for sharing rides.
This is based on characteristics like starting point, destination, pick up points given by the user (places where the user is interested in stopping - this is optional), radius around which the users would want to pick up, start time and return time. Then there are auxilliary preferences which can be used for more advanced searches


### Work Location Based
* First filter is by work location


### Distance Based
This section tries to outline how to get the best match based only on distance

Information available
Driver
* Starting point A
* Destination point B
* Pick up points - optional - A1,A2,A3
* Radius within which they will accept ride requests. These could either be around the start point or pick up points in between
* Route from A to B based on google maps

Passenger
* Starting point P
* Radius of search

Steps Involved:
Search initiated by driver
* Use a radial search from point A - this is the first preference
* Click on a pick up point in between (A1,A2,A3). Zoom in there and do a radial search
* Show all possible users on the map within the bounding box
* Rank them according to other values

Search initiated by passenger
* Use a radial search from point P - this is the first preference
* This is the biggest challenge - how do we figure out if a given point(s) are in any of the paths? Don't do this for now!
* Alternative - list all the drivers in a 100 KM radius from P. Selecting on each driver reveals their route.
