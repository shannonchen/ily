
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var appstate = {
	dimensions: {
		height: 0,
		width: 0
	},
	acct: {
		name: 'Susie',
		activeFamilyMember: 'dad',
		members: {
			dad: {
				name: 'Dad',
				img: 'dadpic.png',
				gamesInProgress: {},
				numAudioMsgs: 1,
				audioMessages: {}
			},
			mom: {
				name: 'Mom',
				img: 'mompic.png',
				gamesInProgress: {},
				numAudioMsgs: 3,
				audioMessages: {}
			},
			sis: {
				name: 'Sis',
				img: 'sispic.png',
				gamesInProgress: {},
				numAudioMsgs: 1,
				audioMessages: {}
			}
		}
	}, 
	activePage: 'mainmenu',
	activeActivity: null,
	initialize: function() {
		this.resize();

		$('#header').fadeOut(0);
		$('#footer').fadeOut(0);
		$('.contentpage').fadeOut(0);
		$('.overlaypage').fadeOut(0);

		this.activePage = 'login'
		$('#login').fadeIn('fast').addClass('active');

		//$('#content').css('height', this.dimensions.height - 80);
	},
	resize: function() {
		this.dimensions.height = $(window).height();
		this.dimensions.width = $(window).width();
	},
	/* Handle family member selections */
	selectFamilyMember: function(memberID) {
		//console.log("SelectNewFamMember: " + memberID);
		this.acct.activeFamilyMember = memberID;

		$('.family-member-button.active').removeClass('active');
		$('#' + memberID + '.family-member-button').addClass('active');

		this.updatePage();
		//console.log(appstate);
	},

	/* Handle page transitions */
	goToPage: function(targetPage) {
		//console.log("Transition to page " + targetPage);
		this.activePage = targetPage;

		$('.contentpage.active').fadeOut('slow').removeClass('active');
		$('#' + targetPage).fadeIn('slow').addClass('active');

		// TODO: Can I pass the page id into here to speed things up?
		this.updatePage();
		//console.log(appstate);
	},

	/* Handle page updates? */
	// TODO: Cut down on these calls?
	updatePage: function() {
		//console.log("Updating Page");
		switch (this.activePage) {
			case "mainmenu":
				$('#title').html('<img src="Ily-Logo-White.gif" height="90%"></img>')
				$('#helpmsg').text('Choose who to interact with on the bar at the bottom!\nChoose an activity by tapping it!');
				break;
			case "newgamesmenu":
				$('#title').html('<img src="Ily-Logo-White.gif" height="90%"></img>')
				$('#helpmsg').text('Choose who to play with on the bar at the bottom!\nChoose a game by tapping it!');
				break;
			case "audio":
				var audio_container = $('#audio > div#messagecontainer');
				var audio_dash = $('#audio > div#audiodash');
				var target_member = this.acct.members[this.acct.activeFamilyMember]
				audio_container.html('');
				for (var i = 0; i < target_member.numAudioMsgs; i++) {
					if (i % 2 == 0) {
						audio_container.append('<img class=\'audio_component audio-left\' src=\'audio_green.gif\' height=\'100px\'></img>')
					} else {
						audio_container.append('<img class=\'audio_component audio-right\' src=\'audio_blue.gif\' height=\'100px\'></img>')
					}
				}
				$('#helpmsg').text('<Insert audio messaging help>');
				$('#title').text(this.acct.members[this.acct.activeFamilyMember].name);
				break;
			case "gestures":
				var imgholder = $('#gesturesimg');
				if (imgholder.hasClass('step1')) {
					imgholder.removeClass('step1').addClass('step0');
				} else if (imgholder.hasClass('step0')) {

				} else {
					imgholder.addClass('step0');
				}
				$('#helpmsg').text('Place your finger on the screen and move it so it matches the hand to send them a high five!');
				$('#title').text(this.acct.members[this.acct.activeFamilyMember].name);
				break;
			case "tictactoe-load":
				var imgholder = $('#loadingimg');
				var app = this;
				if (imgholder.hasClass('loading')) {
					setTimeout(function() {
						imgholder.removeClass('loading').addClass('loaded');
						setTimeout(function() {
							app.goToPage('tictactoe');
						}, 1000);
					}, 1000);
				}
				$('#title').text(this.acct.members[this.acct.activeFamilyMember].name);
				break;
			case "tictactoe":
				this.activeActivity = new TicTacToeGame();
				this.activeActivity.init(appstate.acct.activeFamilyMember);
				$('#helpmsg').text('When it\'s your turn, make your move by tapping a square!');
				$('#title').text(this.acct.members[this.acct.activeFamilyMember].name);
				break;
			default: 
				$('#title').html('<img src="Ily-Logo-White.gif" height="90%"></img>')
				$('#helpmsg').text('Pick a family member from the bar at the bottom of the page, and interact with them!');

		}
	},

	setupOverlay: function(overlayID) {
		switch (overlayID) {
			case "audio-record":
				$('#audio-record-display').prepend('<img src=\'' + this.acct.activeFamilyMember + 'pic.png\' height=20%></img>');
				this.activeActivity = new FakeAudioRecording();
				this.activeActivity.init();
				break;
		}
	},

	cleanOverlay: function(overlayID) {
		switch (overlayID) {
			case "audio-record":
				$('#audio-record-display').html('<div id="audio-record-time"></div>');
				this.activeActivity = null;
				break;
		}
	},

	activateOverlay: function(overlayID) {
		this.setupOverlay(overlayID);
		$('#' + overlayID).fadeIn('slow').addClass('active');
	},

	deactivateOverlay: function(overlayID) {
		this.cleanOverlay(overlayID);
		$('#' + overlayID).fadeOut('slow').removeClass('active');
	},

	saveAudio: function() {
		var member = this.acct.members[this.acct.activeFamilyMember];
		member.numAudioMsgs = member.numAudioMsgs + 1;
		this.updatePage();
	},

	/* Handle Back Button Functionality */
	// TODO: mainmenu transitions redundant
	// TODO: finish all screen transitions
	goBack: function() {
		//console.log("Back Button Pressed on " + this.activePage);
		switch (this.activePage) {
			case "audio":
			case "newgamesmenu":
				this.goToPage('mainmenu');
				break;
			case "gestures":
				$('#gestures > div#gesturespanel').css('background-image', 'none');
				this.goToPage('mainmenu');
				break;
			default:
				this.goToPage('mainmenu');
				break;

		}
		//console.log(appstate);
	},
	login: function(e) {
		$('#header').fadeIn('slow');
		$('#footer').fadeIn('slow');

		this.selectFamilyMember('dad');
	}
};

var TicTacToeGame = function() {};

TicTacToeGame.prototype = {
	current_player: 0,
	init: function(name) {
		var game = this;
		$('#tictactoepanel').empty();

		for (var i=0; i < 3 * 3; ++i) {
			var cell = $('<div></div>').addClass('cell').appendTo('#tictactoepanel');
			if (i % 3 === 0) {
				cell.before('<div class="clear"></div>');
			}
		}

		this.players[0].name = appstate.acct.name;
		this.players[1].name = name;

		this.initTurn();

		$('#tictactoepanel .cell').bind("click", function() {
			var cell = $(this);
			cell
				.addClass(game.players[game.current_player].style)
				.addClass("marked")
				.text(game.players[game.current_player].mark)
				.unbind("click")

			if (!game.checkAndProcessWin()) {
				game.current_player = (++game.current_player) % game.players.length;
				game.initTurn(game.current_player);
			}

			if (1 == game.current_player) {
				setTimeout(function() {
					var found = false;
					var index = 0;
					while (!found) {
						index = getRandomInt(0,8);
						currCell = $($('#tictactoepanel .cell').get(index));
						if (!currCell.hasClass("marked")) {
							found = true;
							currCell
								.addClass(game.players[1].style)
								.addClass("marked")
								.text(game.players[1].mark)
								.unbind("click");
						}
					}

					if (!game.checkAndProcessWin()) {
						game.current_player = (++game.current_player) % game.players.length;
						game.initTurn(game.current_player);
					}
				}, 500);
			}
					
		});

		$('#restart_game').bind("click", function(e) {
			e.preventDefault();
			game.restartGame();
		});

		$('#quit_game').bind("click", function(e) {
			e.preventDefault();
			appstate.goToPage('mainmenu');
		});
	},
	initTurn: function() {
		$('#player_name').text(this.players[this.current_player].name);
		$('#player_mark').text(this.players[this.current_player].mark);
	},
	players: [{
		mark: 'X',
		name: 'You',
		style: 'player1_cell',
		score_el: 'player1_wins',
		wins: 0
	},{
		mark: 'O',
		name: '',
		style: 'player2_cell',
		score_el: 'player2_wins',
		wins: 0
	}],
	restartGame: function() {
		$('.end_game').hide();
		this.current_player = 0;
		this.init(this.players[1].name);
	},
	disableGame: function(e) {
		$("#tictactoepanel .cell").unbind("click");
	},
	checkAndProcessWin: function() {
		var current_class = this.players[this.current_player].style;
		var marked_cells = $("#tictactoepanel ."+current_class);
		var num_of_cols = 3;
		var num_of_rows = 3;
		var win = false;
		if ( marked_cells.length >= num_of_cols )
		{
			/* Check the rows */
			var cells = $("#tictactoepanel .cell");
			var cells_inspected = {};
			for (var row=1; row <= num_of_rows && !win; ++row ) 
			{
				cells_inspected = cells
									.filter(":lt("+num_of_cols*row+")")
									.filter(":eq("+(num_of_cols*(row-1))+"),:gt("+(num_of_cols*(row-1))+")")
									.filter("."+current_class);
				if ( cells_inspected.length == num_of_cols ) win = true;
			}
			/* Check the cols */
			for (var col=0; col <= num_of_cols && !win; ++col ) 
			{
				cells_inspected = cells
									.filter(":sub_mod("+col+","+num_of_rows+")")
									.filter("."+current_class);
									
				if ( cells_inspected.length == num_of_rows ) win = true;
			}
			/* Check the diagonals */
			// We always have 2 diagonals
			// From left up to right down
			if ( !win )
			{
				cells_inspected = cells
									.filter(":mod("+(num_of_rows+1)+")")
									.filter("."+current_class);
				if ( cells_inspected.length == num_of_rows ) win = true;
				else{
					// From right down to left up
					cells_inspected = cells
										.filter(":mod("+(num_of_rows-1)+"):not(:last,:first)")
										.filter("."+current_class);
					if ( cells_inspected.length == num_of_rows ) win = true;					
				}
			}
		}
		
		if ( win ){
			this.disableGame();
			cells_inspected.addClass("win");
			++this.players[this.current_player].wins;
			$("#winner #winner_name").text(this.players[this.current_player].name);
			$("#"+this.players[this.current_player].score_el).text(this.players[this.current_player].wins);
			$(".end_game").show();
		} else {
			// Save the trouble and just restart the game since it a dead end
			if ( $("#tictactoepanel .marked").length == num_of_rows * num_of_cols ) $("#ask_restart").show();
		}
		return win;
	}
}

var FakeAudioRecording = function() {};

FakeAudioRecording.prototype = {
	timecount: 0,
	totaltime: 0,
	running: false,
	recording: true,

	init: function() {
		var recording = this;

		this.timerhandle = setInterval(function() {
			recording.count('audio-record-time');
		}, 1000);

		$('.grayable').addClass('inactive');
		$('#button-left').removeClass('inactive');
	},

	count: function(target) {
		this.timecount = this.timecount + 1;
		if (this.recording) {
			this.totaltime = this.timecount;
		}
		console.log(this.timecount + "-" + this.totaltime)
		this.display(this.timecount, target);
	},

	display: function(count, id, neg) {
		var secs = count % 60;
		var mins = (count - secs) / 60;

		if (secs < 10) {
			secs = '0' + secs;
		}

		if (mins < 10) {
			mins = '0' + mins;
		}
		if (neg) {
			$('#' + id).text("-" + mins + ":" + secs);
		} else {
			$('#' + id).text(mins + ":" + secs);
		}
		
	},

	stop: function() {
		this.running = false;
		this.recording = false;

		clearInterval(this.timerhandle);
		this.timecount = 0;
		this.display(this.totaltime, 'audio-record-time');

		$('.grayable').removeClass('inactive');
	},

	pause: function() {
		this.running = false;
		clearInterval(this.timerhandle);
	},

	play: function() {
		if (this.timecount == this.totaltime) {
			this.timecount = 0;
		}
		var recording = this;
		this.running = true;

		$('#audio-record-time').html("<p id='audio-text-left' class='alignleft audioplayer'></p>\n<p id='audio-text-right' class='alignright audioplayer'></p>");
		recording.display(0, 'audio-text-left');
		recording.display(recording.totaltime, 'audio-text-right', true);


		this.timerhandle = setInterval(function() {
			recording.count('audio-text-left');
			recording.display(recording.totaltime - recording.timecount, 'audio-text-right', true);
			if (recording.timecount == recording.totaltime) {
				recording.running = false;
				console.log("done: " + recording.timecount + ":" + recording.totaltime);
				$('#button-right').css({'background-position': '-14px -28px'});
				recording.display(recording.totaltime, 'audio-record-time');
				clearInterval(recording.timerhandle);
			}
		}, 1000);
	}
}

$(document).ready(function() {

	appstate.initialize();
	
	$(window).resize(function() {
		appstate.resize();
	});

	$('#loginform').submit(function(e) {
		e.preventDefault();
		appstate.login(e);
		appstate.goToPage('mainmenu');
	});

	$('.family-member-button').bind("click", function() {
		if (this.id == "add-member") {
			appstate.activateOverlay('unfinished');
		} else {
			appstate.selectFamilyMember(this.id);
		}
	});

	$('.menuitem').click(function() {
		appstate.goToPage(this.id.slice(0, this.id.lastIndexOf("-")));
	});

	$('.grid-block.unfinished').click(function() {
		appstate.activateOverlay('unfinished');
	});

	$('#backbutton').click(function() {
		console.log("back");
		appstate.goBack();
	});

	$('#gesturesimg').click(function() {
		if ($(this).hasClass('step0')) {
			$(this).removeClass('step0').addClass('step1');
		} else if ($(this).hasClass('step1')) {
			$(this).removeClass('step1').addClass('step0');
		}
	});

	$('#audio_record').click(function() {
		appstate.activateOverlay('audio-record');
	});

	$('#audio-cancel').click(function() {
		appstate.deactivateOverlay('audio-record');
	});

	$('#audio-confirm').click(function() {
		if (!$(this).hasClass('inactive')) {
			appstate.saveAudio();
			appstate.deactivateOverlay('audio-record');
		}
	});

	$('#audio-center-container #button-left').click(function() {
		if (!$(this).hasClass('inactive')) {
			appstate.activeActivity.stop();
		}
	});

	$('#audio-center-container #button-right').click(function() {
		if (!$(this).hasClass('inactive')) {
			if (appstate.activeActivity.running) {
				appstate.activeActivity.pause();
				console.log("pausing");
				$(this).css({'background-position': '-14px -28px'});
			} else {
				appstate.activeActivity.play();
				console.log("playing");
				$(this).css({'background-position': '-64px -28px'});
			}
		}
	});

	$('#close-notice a').click(function(e) {
		e.preventDefault();
		appstate.deactivateOverlay('unfinished');
	});

	$('#helpbutton').click(function() {
		appstate.activateOverlay('helpoverlay');
	})

	$('#helpoverlay').click(function() {
		appstate.deactivateOverlay('helpoverlay');
	})

	$.expr[":"].mod = function(el, i, m) {
		return i % m[3] === 0
	};  
	$.expr[":"].sub_mod = function(el, i, m) {
		var params = m[3].split(",");
		return (i-params[0]) % params[1] === 0
	}; 

});