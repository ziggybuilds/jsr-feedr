"use strict";

/*
  Please add all Javascript code to this file.
*/
$(document).ready(function () {
	/*
 Make sure you have the JSON View Chrome extension from earlier
 console.log the feeds to see the data
 Map out all of the needed fields/properties from each respective feed
 Add all the DOM functionality first
 Think about ways to best standardize all of your incoming data.
 Test small pieces of functionality frequently, to make sure everything is working.
 */

	// gaurdian news service
	// endpoint http://content.guardianapis.com/search?q=news&api-key=033c2552-8fec-438f-8ad2-578ffbb6ccce
	// key 033c2552-8fec-438f-8ad2-578ffbb6ccce

	// News API
	// KEY c3576288372c48428c6943b7382400c6
	// Endpoint BBC https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=c3576288372c48428c6943b7382400c6
	// WAPO https://newsapi.org/v1/articles?source=the-washington-post&sortBy=top&apiKey=c3576288372c48428c6943b7382400c6
	var BBCendpoint = "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=c3576288372c48428c6943b7382400c6";
	var WAPOendpoint = "https://newsapi.org/v1/articles?source=the-washington-post&sortBy=top&apiKey=c3576288372c48428c6943b7382400c6";
	var GAURDendpoint = "http://content.guardianapis.com/search?q=news&api-key=033c2552-8fec-438f-8ad2-578ffbb6ccce";

	function callAPI(endpoint) {
		var $loader = $("#articleLoader");
		$loader.show();
		$.ajax({
			url: endpoint,
			type: "GET",
			dataType: "JSON"
		}).success(function (response) {
			if (endpoint === GAURDendpoint) {
				handleGaurdian(response);
			} else {
				handleNewsApi(response);
			}
			$loader.hide();
			popUp();
		}).error(function (error) {
			console.log(error);
		});
	}

	// Global section variable
	var $newsFeed = $("#main");

	function handleGaurdian(response) {
		var newsArray = response.response.results;
		var logo = "./images/guardian-logo.png";
		var articles = newsArray.map(function (item) {
			return "<article class=\"article\"><section class=\"featuredImage\"><img src=\"" + logo + "\" alt=\"Gaurdian Logo\" /></section><section class=\"articleContent\">\n<a href=\"" + item.webUrl + "\" target=\"_blank\"><h3>" + item.webTitle + "</h3></a><h6>" + item.sectionName + "</h6></section>\n<section class=\"impressions\"></section><div class=\"clearfix\"></div><p class=\"hidden\">Please view article for more information.</p></article>";
		});
		$newsFeed.html(articles);
	}

	function handleNewsApi(data) {
		var newsArray = data.articles;
		var logo = "./images/guardian-logo.png";
		var articles = newsArray.map(function (item) {
			return "<article class=\"article\"><section class=\"featuredImage\"><img src=\"" + item.urlToImage + "\" alt=\"Gaurdian Logo\" /></section><section class=\"articleContent\">\n<a href=\"" + item.url + "\" target=\"_blank\"><h3>" + item.title + "</h3></a><h6>" + item.author + "</h6></section>\n<section class=\"impressions\"></section><div class=\"clearfix\"></div><p class=\"hidden\">" + item.description + "</p></article>";
		});
		$newsFeed.html(articles);
	}

	// create event handlers for the sources
	$("#BBC").on("click", function (e) {
		e.preventDefault();
		callAPI(BBCendpoint);
	});

	$("#GAURD").on("click", function (e) {
		e.preventDefault();
		callAPI(GAURDendpoint);
	});

	function createEventHandler(id, cb, endpoint) {
		$(id).on("click", function (e) {
			var source = $(id).html();
			e.preventDefault();
			cb(endpoint);
			$("#sourceDisplay").html(source);
		});
	}

	createEventHandler("#WAPO", callAPI, WAPOendpoint);
	createEventHandler("#BBC", callAPI, BBCendpoint);
	createEventHandler("#GAURD", callAPI, GAURDendpoint);

	// Default API load
	callAPI(WAPOendpoint);

	// Search Functionality
	$("#search > a").on("click", function () {
		$("#search").toggleClass("active");
	});

	$("#search > input").on("input", function (e) {
		e.preventDefault();
		// get value and set to lowercase
		var $inputVal = $(this).val().toLowerCase();
		// get the news content
		var $content = $("#main").children();
		// loop through the content, perform search of inner text
		for (var i = 0; i < $content.length; i += 1) {
			// set to lowercase to match input value
			var test = $content[i].innerText.toLowerCase();
			if (test.indexOf($inputVal) > -1) {
				$($content[i]).show("fast");
			} else {
				$($content[i]).hide("fast");
			}
		}
	});

	function popUp() {
		var $popUpCont = $("#popUp");
		var $popArticles = $("#main").children();
		for (var i = 0; i < $popArticles.length; i += 1) {
			$($popArticles[i]).on("click", function (e) {
				e.preventDefault();

				var title = $(this).find("h3").text();
				var link = $(this).find("a").attr("href");
				var desc = $(this).find("p.hidden").text();

				$popUpCont.find("h1").text(title);
				$popUpCont.find("p").text(desc);
				$popUpCont.find(".popUpAction").attr("href", link);

				$popUpCont.removeClass('hidden');
				$popUpCont.removeClass('loader');
				$popUpCont.find('.container').fadeIn("fast");

				closePopUp($popUpCont);
			});
		}
	}

	function closePopUp(popUp) {
		$(popUp).find(".closePopUp").on('click', function (e) {
			e.preventDefault();

			$(popUp).addClass('hidden');
			$(popUp).addClass('loader');
			$(popUp).find('.container').fadeOut("fast");
		});
	}
});