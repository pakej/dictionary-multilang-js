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
		
		// create a promises array to hold the request promise of
		// ajax request to get the language packs
		self.promises = new Array();

		$.each(language_packs, function(language, url) {
			// if key does not equals to 'default'
			if(language != 'default') {
				// create a new promise instance
				var promise = $.Deferred();
				self.promises.push(promise);

				// dispatches a request to get the language packs
				$.ajax({
					url: url
				}).success(
					function(data) {
						// set the language data into the languages object
						self.languages[language] = data;
						// resolve the promise and sends out the key (indicates success)
						promise.resolve(language);
					}
				).fail(
					function() {
						console.log(language.toUpperCase() + ' language pack failed to load.');
						// rejects the promise (indicates failure)
						promise.reject();
					}
				);				
			}
		});

		$.when.apply($, self.promises).then(
			function(first_language_loaded) {
				// sets the default & current language
				self.default_language = self.current_language = (language_packs.default || first_language_loaded.toLowerCase());
				self.switchTo(self.default_language);
			}
		);
	},

	// initialise buttons to toggle language pack
	initButtons: function(buttons) {
		var self = this;

		$.each(buttons, function(language, button_selector) {
			var container_button = $('.btn-languages');
			var current_button = $('.' + button_selector);

			// execute this when all the language packs have loaded
			$.when.apply($, self.promises).then(function() {
				// if the current language is the default language
				if(language.toLowerCase() == self.default_language) {
					// set the button to active
					current_button.addClass('active-dictionary');					
				}
			});

			current_button.click(
				function() { 
					// if the button is disabled, cancel all actions
					if($(this).hasClass('disabled')) return;
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

			// change placeholder text translation on tagged form element
			if(elements[i].getAttribute('placeholder-dictionary') != null) elements[i].placeholder = text;
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