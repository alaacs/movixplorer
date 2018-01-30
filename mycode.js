var app = angular.module("app", []);

app.controller("MovieExplorerController", ["$scope", function($scope) { //Global Variables

  $scope.Google_key = "AIzaSyDBRx0crV33B-rLPoQr7SkYl4_ZrUOZzig";
  $scope.OWP_key = "8c8a482f0c519bcc56bf79715ea71154";
  $scope.The_moviedb_key = "8fda7e69773f31a9895946fa43028f9b";
  $scope.langId = "en-US";
  $scope.langParam = "language";
  $scope.apiKeyParam = "api_key";
  $scope.base_url = "https://api.themoviedb.org/3/";
  $scope.image_base_url = "https://image.tmdb.org/t/p/w500/";
  $scope.imdb_base_url = "http://www.imdb.com/title/";
  $scope.nowPlaying_urlPart = "movie/now_playing";
  $scope.topRated_urlPart = "movie/top_rated";
  $scope.search_urlPart = "search/movie";
  $scope.movieDetail_urlPart = "movie/";
  $scope.searcQueryParam = "query";
  $scope.default_search_url_params = "page=1&include_adult=false";
  $scope.currentStation;
  $scope.stations;

  //option "top" => for getting top rated movies
  //option "now" => for getting now playing movies
  //option "search" => for searching for a movie
  //option "mov" => for getting movie details
  $scope.constructUrl = function(option, searchQuery = null, movieId = null) {
    var url = $scope.base_url;
    switch (option) {
      case "top":
        url += $scope.topRated_urlPart;
        break;
      case "now":
        url += $scope.nowPlaying_urlPart;
        break;
      case "search":
        url += $scope.search_urlPart;
        break;
      case "mov":
        url += $scope.movieDetail_urlPart;
        break;
      default:
        break;
    }
    if (option == "mov")
      url += movieId;
    url += "?" + $scope.langParam + "=" + $scope.langId + "&" + $scope.apiKeyParam + "=" + $scope.The_moviedb_key;
    if (option == "search")
      url += url + "&" + $scope.searcQueryParam + "=" + searchQuery;

    return url;
  }
  // Refresh Button
  $scope.loadMovies = function() {
    $scope.movies = [];
    var url = "";
    if ($scope.isSearchEnabled)
      url = $scope.constructUrl($scope.selectedListType, $scope.searchWord);
    else url = $scope.constructUrl($scope.selectedListType);
    $.get(url).done(function(response) {
      console.log(response);
      var promises = [];
      for (var i = 0; i < response.results.length; i++) {
        var mov = response.results[i]
        promises.push($scope.getMovieDetails(mov.id));
      }
      Promise.all(promises).then(function(moviesWithDetails) {
        console.log(moviesWithDetails);
        $scope.movies = moviesWithDetails;
        var uniqueCountries = [...new Set(moviesWithDetails.map(item => (item && item.production_countries && item.production_countries[0]) ? item.production_countries[0].name : null))];
        console.log(uniqueCountries);
        var addressSearchPromises = [];

        var provider = new window.GeoSearch.GoogleProvider({
          params: {
            key: 'AIzaSyBSYJineItD-3w2sILaHt6gMMn_Ypl2iE8',
          },
        });

        uniqueCountries.map(function(country) {
          if (country)
            addressSearchPromises.push(provider.search({
              query: country
            }));
        });
        if (addressSearchPromises)
          Promise.all(addressSearchPromises).then(function(res) {
            console.log(res);
            for (var i = 0; i < $scope.movies.length; i++) {

              var mov = $scope.movies[i];
              if (mov.production_countries && mov.production_countries.length > 0) {
                var movAddress = $scope.getCountryCoordinatesByName(res, mov.production_countries[0]);
                mov.location = {
                  x: movAddress.x,
                  y: movAddress.y,
                  label: movAddress.label
                };
              }
            }
          });
        $scope.$apply();
      })
    })
  }
  $scope.getCountryCoordinatesByName = function(addressList, country) {
    for (var i = 0; i < addressList.length; i++) {
      var add = addressList[i][0].label;
      if (add.toLowerCase().indexOf(country.name.toLowerCase()) > -1 || country.name.toLowerCase().indexOf(add.toLowerCase()) > -1)
        return addressList[i][0];
    }
    return null;
  }
  $scope.getMovieDetails = function(movieId) {
    var url = $scope.constructUrl("mov", null, movieId);
    return new Promise(function(resolve, reject) {
      $.get(url).done(function(response) {
        if (response)
          resolve(response);
        else resolve();
      }).fail(function(err) {
        resolve();
      });
    });

  }
  $(document).ready(function() {
    $scope.selectedListType = "now";
    $scope.isSearchEnabled = false;
    $scope.loadMovies();
    $(document).on("click", "#btnMap", function(e) {
      $.mobile.changePage("#mapPage");
      $scope.loadMap();
    });
    $(document).on("click", "#to_details", function(e) {
      if(e.target && angular.element(e.target) && angular.element(e.target).scope())
        $scope.currentMovie = angular.element(e.target).scope().movie;
        $scope.loadMovieDetails();
    });
  });
  $scope.loadMovieDetails = function(){
    $('#movieName').text($scope.currentMovie.title);
    $('#movieTagline').text('Tagline: ' + $scope.currentMovie.tagline);
    $('#movieRating').text($scope.currentMovie.vote_average);
    $('#movieStarRating').css("width", $scope.currentMovie.vote_average / 10 * 100 + "%");
    $('#movieStarRating').attr("title", $scope.currentMovie.vote_average)
    $('#movieCountry').text('Country: ' + $scope.currentMovie.location.label);
    $('#movieReleaseDate').text('ReleaseDate: ' + $scope.currentMovie.release_date);
    $('#movieRevenue').text('Revenue: ' + $scope.currentMovie.revenue + ' USD');
    $('#movieOverview').text('Overview: ' + $scope.currentMovie.overview);
    $('#movieIcon').attr('src', $scope.image_base_url + $scope.currentMovie.poster_path);
    $('#movieGenre').text('Genres: ' + $scope.currentMovie.genres.map(g=>g.name).join(', '));
    $('#website').attr('href', $scope.currentMovie.homepage);
    $('#website').text( $scope.currentMovie.homepage);
    $('#imdb').attr('href', $scope.imdb_base_url + $scope.currentMovie.imdb_id);
    $('#spokenLanguage').text('Spoken Languages: ' + $scope.currentMovie.spoken_languages.map(g=>g.name).join(', '));
    $('#productionCompany').text('Production Company: ' + $scope.currentMovie.production_companies.map(g=>g.name).join(', '));
    console.log($scope.currentMovie);
  }
  $scope.loadMap = function() {
    if (!$scope.map)
      $scope.map = L.map('map');
    $scope.map.setView([37.09024, -95.712891], 2);
    var CartoDB_DarkMatter = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo($scope.map);

    if ($scope.markers)
      $scope.markers.clearLayers();
    $scope.markers = new L.MarkerClusterGroup();

    var markerList = [];
    var bounds = [];
    for (var i = 0; i < $scope.movies.length; i++) {
      var mov = $scope.movies[i];
      if (mov.location) {
        var marker = L.marker(L.latLng(mov.location.y, mov.location.x));
        marker.bindPopup("<a target='_blank' href= '" + $scope.imdb_base_url + mov.imdb_id + "'><b>" + mov.title + "</b></a><br>Rating:" + mov.vote_average + "<br>Produced in: " + mov.location.label +
          "");
        if (!bounds.some(item => item[1] == mov.location.x && item[0] == mov.location.y))
          bounds.push([mov.location.y, mov.location.x]);
        markerList.push(marker);
      }
    }
    setTimeout(function() {
      $scope.map.invalidateSize();
      // $scope.map.setView([5, -20], 3);
      $scope.map.fitBounds(bounds, {
        padding: [20, 20]
      });
      if (bounds.length == 1)
        $scope.map.setZoom(3);
    }, 1000)

    $scope.markers.addLayers(markerList);
    $scope.map.addLayer($scope.markers);
  }
  $scope.listType_change = function() {
    if ($scope.selectedListType !== "search") {
      $scope.loadMovies();
      $scope.isSearchEnabled = false;
    } else $scope.isSearchEnabled = true;
    $scope.searchWord_change = function() {
      if ($scope.searchWord.length >= 3) {
        $scope.loadMovies();
      }
    }
  }

}]);
