//require() loads the UI module
var UI = require('ui');
var ajax = require('ajax');
var settings = require('settings');
//Create a new card from the UI "class"

// global variables
var mainCard = null;
var hash = null;
var reservedName = 'Open Settings!';
var rollingCache = null;
var today = null;
var week = null;
var month = null;
var all = null;

// CONSTANTS
var TIME_KEYS = [ 'Rolling 300', 'Today', 'Week', 'Month', 'All' ];
var STAT_KEYS_HR = [ 'Captures', 'Drops', 'Grabs', 'Hold Time', 'Pops', 'Power-Ups', 'Prevent', 'Returns', 'Save Attempts', 'Games Saved', 'Support',
					'Tags'];
			//HR stands for Human-Readable

settings.config(
	{ url: 'http://tagpro-stats-pebble.42pag.es/' },
	function(e) {
		console.log('closed configurable');

		// Show the parsed response
		var jsonObj = JSON.parse(JSON.stringify(e.options));
		settings.data('hash', jsonObj.name );
		console.log('hash is: ' + settings.data('hash'));
		hash = settings.data('hash');
		
		console.log('Refreshing stats');
		refreshStats();
		mainCard.body('\nLoaded Profile is:\n' + reservedName);
		mainCard.show();
		// Show the raw response if parsing failed
		if (e.failed) {
			console.log(e.response);
		}
	}
);

function refreshStats(){
	ajax (
		{
			url: 'http://tagpro-radius.koalabeast.com/profiles/' + hash,
			method: 'GET', 
			type: 'json',
			async: false
		},
		function( data, status, request )
		{
			reservedName = data[0].reservedName;
			rollingCache = [
				data[0].stats.rollingCache.bestWinRate,
				data[0].stats.rollingCache.games,
				data[0].stats.rollingCache.winRate
			];
			today = [
				data[0].stats.today.captures,
				data[0].stats.today.drops,
				data[0].stats.today.grabs,
				data[0].stats.today.hold,
				data[0].stats.today.pops,
				data[0].stats.today.powerups,
				data[0].stats.today.prevent,
				data[0].stats.today.returns,
				data[0].stats.today.saveAttempts,
				data[0].stats.today.saved,
				data[0].stats.today.support,
				data[0].stats.today.tags
			];
			week = [
				data[0].stats.week.captures,
				data[0].stats.week.drops,
				data[0].stats.week.grabs,
				data[0].stats.week.hold,
				data[0].stats.week.pops,
				data[0].stats.week.powerups,
				data[0].stats.week.prevent,
				data[0].stats.week.returns,
				data[0].stats.week.saveAttempts,
				data[0].stats.week.saved,
				data[0].stats.week.support,
				data[0].stats.week.tags
			];
			month = [
				data[0].stats.month.captures,
				data[0].stats.month.drops,
				data[0].stats.month.grabs,
				data[0].stats.month.hold,
				data[0].stats.month.pops,
				data[0].stats.month.powerups,
				data[0].stats.month.prevent,
				data[0].stats.month.returns,
				data[0].stats.month.saveAttempts,
				data[0].stats.month.saved,
				data[0].stats.month.support,
				data[0].stats.month.tags
			];
			all = [
				data[0].stats.all.captures,
				data[0].stats.all.drops,
				data[0].stats.all.grabs,
				data[0].stats.all.hold,
				data[0].stats.all.pops,
				data[0].stats.all.powerups,
				data[0].stats.all.prevent,
				data[0].stats.all.returns,
				data[0].stats.all.saveAttempts,
				data[0].stats.all.saved,
				data[0].stats.all.support,
				data[0].stats.all.tags
			];
		},
		function( error, status, request )
		{
			console.log('The ajax request failed: ' + error);
		}
	);
}

function formatSeconds( secs ) {
	var hours = parseInt( secs / 3600 ) % 24;
	var minutes = parseInt( secs / 60 ) % 60;
	var seconds = secs % 60;

	return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
}

function makeRollingCard() {
	return new UI.Card({
		title: 'Rolling 300',
		body: 'Best Win Rate: \n' + Math.round(rollingCache[0]*10000)/100.0 + '%\n' +
				'Games Played: \n' + rollingCache[1] + '\n' +
				'Current Win Rate: \n' + Math.round(rollingCache[2]*10000)/100.0 + '%'
	});
}

function makeMenu( title ) {
	var titles = [,,,,,,,,,,,];
	var subtitles = [,,,,,,,,,,,];
	//we need to catch 3's and 6's and format those to hours:minutes:seconds
	if( title === TIME_KEYS[1] ) {
		for( var i = 0; i < today.length; i++ ) {
			titles[i] = STAT_KEYS_HR[i];
			subtitles[i] = today[i];
		}
	}
	if( title === TIME_KEYS[2] ) {
		//because
		for( var j = 0; j < week.length; j++ ) {
			titles[j] = STAT_KEYS_HR[j];
			/*if( j != 3 || j != 6 ) {
				subtitles[j] = today[j];
			}
			else {
				subtitles[j] = formatSeconds( today[j] );
			}*/
			subtitles[j] = week[j];
			//console.log(week[j]);
		}
	}
	if( title === TIME_KEYS[3] ) {
		//
		for( var k = 0; k < month.length; k++ ) {
			titles[k] = STAT_KEYS_HR[k];
			subtitles[k] = month[k];
			//console.log(month[k]);
		}
	}
	if( title === TIME_KEYS[4] ) {
		//javascript
		for( var l = 0; l < all.length; l++ ) {
			titles[l] = STAT_KEYS_HR[l];
			subtitles[l] = all[l];
			//console.log(all[l]);
		}
	}
	return new UI.Menu({
		sections: [{
			items: [{
				//captures
					title: titles[0],
					subtitle: subtitles[0]
				}, {
				//drops
					title: titles[1],
					subtitle: subtitles[1]
				}, {
				//grabs
					title: titles[2],
					subtitle: subtitles[2]
				}, {
				//holdtime THIS NEEDS TO BE FORMATTED
					title: titles[3],
					subtitle: formatSeconds( subtitles[3] )
				}, {
				//pops
					title: titles[4],
					subtitle: subtitles[4]
				}, {
				//powerups
					title: titles[5],
					subtitle: subtitles[5]
				}, {
				//prevent THIS NEEDS TO BE FORMATTED
					title: titles[6],
					subtitle: formatSeconds( subtitles[6] )
				}, {
				//returns
					title: titles[7],
					subtitle: subtitles[7]
				}, {
				//saveAttempts
					title: titles[8],
					subtitle: subtitles[8]
				}, {
				//saved
					title: titles[9],
					subtitle: subtitles[9]
				}, {
				//support
					title: titles[10],
					subtitle: subtitles[10]
				}, {
				//tags
					title: titles[11],
					subtitle: subtitles[11]
			}]
		}]
	});
}

// Main code - DO NOT DECLARE ANY MORE FUNCTIONS BELOW
refreshStats();
mainCard = new UI.Card({
	title: 'Tagpro Stats',
	scrollable: false
});
mainCard.body('\nLoaded Profile is:\n' + reservedName);
mainCard.show();

mainCard.on('click', 'select', function(e) {
  var menu = new UI.Menu({
	sections: [{
		items: [{
			title: 'Rolling 300',
			subtitle: 'Click for Stats'
			}, {
			title: 'Today',
			subtitle: 'Click for Stats'
			}, {
			title: 'Week',
			subtitle: 'Click for Stats'
			}, {
			title: 'Month',
			subtitle: 'Click for Stats'
			}, {
			title: 'All',
			subtitle: 'Click for Stats'
		}]
	}]
  });
  menu.on('select', function(e) {
	if( e.itemIndex === 0 ) {
		makeRollingCard().show();
	}
	else if( e.itemIndex === 1 ) {
		makeMenu('Today').show();
	}
	else if( e.itemIndex === 2 ) {
		makeMenu('Week').show();
	}
	else if( e.itemIndex === 3 ) {
		makeMenu('Month').show();
	}
	else if( e.itemIndex === 4 ) {
		makeMenu('All').show();
	}
  });

  mainCard.on('click', 'up', function(e) {
	console.log(hash);
  });
  menu.show();
}); // close mainCard.on(event, desc, callback)
