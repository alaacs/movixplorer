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
$scope.loadMovies = function(){
  var url= "";
  if($scope.isSearchEnabled)
    url = $scope.constructUrl($scope.selectedListType, $scope.searchWord);
  else url = $scope.constructUrl($scope.selectedListType);
  $.get(url).done(function(response) {
    console.log(response);
    var promises  = [];
    for (var i = 0; i < response.results.length; i++) {
      var mov = response.results[i]
      promises.push($scope.getMovieDetails(mov.id));
    }
    Promise.all(promises).then(function(moviesWithDetails){
      console.log(moviesWithDetails);
      $scope.movies = moviesWithDetails;
      $scope.$apply();
    })
  })
}
  $(document).on("click", "#refresh", function() {
    //Prevent default behaviour
    event.preventDefault();
    $scope.loadMovies();
  });
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
  });
  $scope.listType_change = function(){
    if($scope.selectedListType!== "search")
      {
          $scope.loadMovies();
          $scope.isSearchEnabled = false;
      }
      else $scope.isSearchEnabled = true;
  }
  $scope.searchWord_change = function(){
    if($scope.searchWord.length >= 3)
    {
      $scope.loadMovies();
    }
  }
  $(document).on('pagebeforeshow', '#home', function() {
    $(document).on('click', '#to_details', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      //Store the Station ID
      currentStation = stations[e.target.children[0].id];
      //console.log(e);
      //Change to Details Page
      $.mobile.changePage("#details");
    })
  });

  //Update Details Page
  $(document).on('pagebeforeshow', '#details', function(e) {
    e.preventDefault();
    $('#stationName').text(currentStation.name);
    $('#stationDescription').text(currentStation.weather[0].description);
    $('#stationTemp').text('Temprature: ' + currentStation.main.temp + '°C');
    $('#stationHumidity').text('Humidity: ' + currentStation.main.humidity + '%');
    $('#stationPressure').text('Pressure: ' + currentStation.main.pressure + ' hpa');
    $('#stationIcon').attr('src', 'http://openweathermap.org/img/w/' + currentStation.weather[0].icon + '.png')
    // console.log(currentStation);

  });

}]);
