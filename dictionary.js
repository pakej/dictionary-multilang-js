/*
* Dictionary.js by Zaim Ramlan
*
* A simple JS library to support multiple language feature
* on websites
*/

function Dictionary() {
	// the tag that is used with the HTML elements
	this.tag = 'data-dictionary';
	// the languages pack object
	this.languages = {};
	// the default language
	this.default_language = new String();
	// the current selected language
	this.current_language = new String();
	// additional button actions to execute
	this.addButtonActions = new Function();
}

Dictionary.prototype = {
	// initialise the language packs
	init: function(language_packs) {
		// preserve 'this' context
		var self = this;		
		var index = 0;
		var current_pack = new Array();		
		this.default_language = new String();

		for(pack in language_packs) {
			// if key is equals to 'default'
			if(pack == 'default') {
				// sets default language pack
				self.default_language = language_packs[pack].toLowerCase();
				self.current_language = language_packs[pack].toLowerCase();
			} else {
				// push the current `pack` into the array which will act as a key
				// for the `languages` object
				current_pack.push(pack.toLowerCase());

				$.ajax({
					url: language_packs[pack]
				}).success(
					function(data) {
						self.languages[current_pack[index++]] = data;
						// initialise texts after the successful load of the last language pack
						// 
						// Note: the condition is necessary, to ensure that the languages object 
						// has already been initialised before the switchTo function is invoked
						if(index + 1 == Object.keys(language_packs).length) self.switchTo(self.default_language);
					}
				).fail(
					function() {
						console.log(current_pack[index++].toUpperCase() + ' language pack failed to load.')
					}
				);				
			}
		}
	},

	// initialise buttons to toggle language pack
	initButtons: function(buttons) {
		var self = this;

		$.each(buttons, function(language, button_selector) {
			var container_button = $('.btn-languages');
			var current_button = $('.' + button_selector);

			// if the current language is the default language
			if(language.toLowerCase() == self.default_language) {
				// set the button to active
				current_button.addClass('active-dictionary');					
			}

			current_button.click(
				function() { 
					// remove elements with 'active-dictionary' class
					$('.active-dictionary').removeClass('active-dictionary');
					// set the current button to active
					current_button.addClass('active-dictionary');					
					// sets the current language
					self.current_language = language.toLowerCase();
					// switch the language
					self.switchTo(language.toLowerCase());
					// execute additional button actions
					self.addButtonActions();
				}
			);
		});
	},

	// function to switch the page's language
	switchTo: function(language) {		
		var tag = this.tag;
		// get all elements that is used with this library
		var elements = $('[' + tag + ']');

		for(var i = 0; i < elements.length; i++) {
			// the location in the JSON tree of the translation in the language pack
			text_location = elements[i].getAttribute(tag);
			// get the text translation from the language pack
			text = eval('this.languages.' + language + '.' + text_location);

			// prepend text translation before any elements within the tagged element
			if(elements[i].getAttribute('prepend-dictionary') != null) elements[i].innerHTML = text + elements[i].innerHTML; 
			// append text translation after any elements within the tagged element
			else if(elements[i].getAttribute('append-dictionary') != null) elements[i].innerHTML += text; 
			// change placeholder text translation on tagged form element
			else if(elements[i].getAttribute('placeholder-dictionary') != null) elements[i].placeholder = text;
			// replace everything within the tagged element to the text translation
			else elements[i].innerHTML = text;
		}
	},

	// return the language pack
	getLanguagePack: function() {
		// if a language is not specified, the current selected language
		// will be used instead
		var language = arguments[0] || this.current_language;
		var language_pack = eval('this.languages.' + language);
		return language_pack;
	}
};