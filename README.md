# movixplorer
---
## Website Url: http://movixplorer.co.nf
### The application is browsing movie in three ways.
  * Now playing
  It's showing a list of recent movies showing in the cinemas
  * Top rated
  It's showing a list of the movies with the best rates
  * search
  User can type in search query to search within a huge movies database from all over the world

### User can show the search movies lists or search results on a map showing where movies have been produced

### results map shows movies clustered on a map with the capability of seeing a marker with a link to the movie on IMDB website

### User can choose a movie to show a detailed information about the movie including posters, links and star rating

## The website is powered by The Movie DB API (https://www.themoviedb.org) and google maps API for geocoding

## Used Technologies and Libraries: JQuery, JQuery Mobile, Bootstrap, AngularJS

## Problems faced:
  1. The API doesn't return production company in the search results by default, it can only be retrieved by the details API method which gets one movie at a time. Therefore I used promises to get the details for all my movies' results to get the countries.
  2. After getting the country leaflet markers and marker cluster needs coordinates so I used google maps API to retrieve coordinates in trade with country names.
  3. Navigation with JQuery mobile wasn't working because I missed a closing tag for <a> ... it was <a> instead of </a> !!! :( :( .. it took me around 3-4 hours to figure it out.
  4. I hosted my application on git tried hosting on Horuko  at the beginning but it was complicated so I turned to Biz.NF and it worked well.
  5. I used JQuery and Bootstrap classes and tags to make sure the the application will work smoothly on mobile phone and tablets and tested the application on my phone and it works well.
