var appstate = {
	dimensions: {
		height: 0,
		width: 0
	},
	acct: {
		name: 'Susie',
		activeFamilyMember: 'dad',
	}, 
	activePage: 'mainmenu',
	initialize: function() {
		this.resize();

		$('#header').fadeOut(0);
		$('#footer').fadeOut(0);
		$('.contentpage').fadeOut(0);

		this.activePage = 'login'
		$('#login').fadeIn('fast').addClass('active');

		$('<img/>')[0].src = 'Ily-highfive.png';

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
			case "audio":
				var audio_container = $('#audio > div#messagecontainer');
				var audio_dash = $('#audio > div#audiodash');
				switch (this.acct.activeFamilyMember) {
					case "sis":
					case "dad":
						audio_container.html('<img id=\'audio_component\' src=\'audio_component.png\' height=\'89px\'></img>')
						break;
					case "mom": 
						audio_container.html('<img id=\'audio_mom\' src=\'audio_mom_content_1.png\' height=100%></img>');
						break;
					default:
						$('#audio > div#messagecontainer').text(this.acct.activeFamilyMember);
				}
				break;
			case "gestures":
				$('#gestures > div#gesturespanel').text("Connect with " + this.acct.activeFamilyMember + "!!!");
				$('#gestures > div#gesturespanel').css('background-image', 'none');
				break;
		}
	},

	/* Handle Back Button Functionality */
	// TODO: mainmenu transitions redundant
	// TODO: finish all screen transitions
	goBack: function() {
		//console.log("Back Button Pressed on " + this.activePage);
		switch (this.activePage) {
			case "audio":
			case "gamesmenu":
				this.goToPage('mainmenu');
				break;
			case "newgamesmenu":
				this.goToPage('gamesmenu');
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

var tictactoegame = {
	index: 0,
	files: ['Ily-ttt-blank.gif', 'Ily-ttt-1.gif', 'Ily-ttt-2.gif', 'Ily-ttt-3.gif', 'Ily-ttt-4.gif', 'Ily-ttt-5.gif', 'Ily-ttt-win.gif'],
	step: function() {
		if (this.index < 7) {
			var file = this.files[this.index];
			$('#tictactoepanel').css('background-image', 'url(' + file + ')');
		}
		if (this.index >= 7) {
			this.index = 0;
			var file = this.files[this.index];
			$('#tictactoepanel').css('background-image', 'url(' + file + ')');
		}
		this.index++;
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

	$('.family-member-button').click(function() {
		appstate.selectFamilyMember(this.id);
	});

	$('.menuitem').click(function() {
		appstate.goToPage(this.id.slice(0, this.id.lastIndexOf("-")));
	})

	$('#backbutton').click(function() {
		appstate.goBack();
	});

	$('#tictactoepanel').click(function() {
		tictactoegame.step();
	});

	$('#gesturespanel').click(function() {
		$(this).css({'background-image': 'url(Ily-highfive.png)', 'background-position': 'center', 'background-repeat': 'no-repeat'});
	});

});