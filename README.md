# Description
A simple JS library to support multiple language (multi-lang) feature or translations on sites

# Dependencies
- jQuery

# Installation
Simply download `dictionary.js` into your website folder and you are ready to go!

# Usage
1) Import dictionary-js
```
<script src="path/to/dictionary.js"></script>
```

2) Initialise language packs
```
var dictionary = new Dictionary();
dictionary.init({
  en: 'path/to/lang.english.json',
  bm: 'path/to/lang.bahasa.json',
  th: 'path/to/lang.thai.json,
  default: 'en'
});
```

3) Initialise language toggle buttons
```
dictionary.initButtons({
  en: 'btn-en',
  bm: 'btn-bm',
  th: 'btn-th'  
});
```

4) Tag the elements that you want translated, with `data-dictionary="text.location.in.JSON.tree"`
```
<h1 data-dictionary="body.some_heading.text"></h1>
```

5) Add the language buttons
```
<a class="btn-en">EN</a> | <a class="btn-bm">BM</a> | <a class="btn-th">TH</a>
```

That's it! The rest will magically happen when you simply toggle the languages.
  
Have fun!

# Styling
The active language button will automatically have the class `active-dictionary`. So you can simply style the active language by using the CSS class selector `.active-dictionary`
```
a.active-dictionary {
  text-decoration: underline;
}
```

# Making Changes
1. Create your feature branch (`git checkout -b new-feature`)  
2. Commit your changes (`git commit -am 'Some cool reflection'`)  
3. Push to the branch (`git push origin new-feature`)  
4. Create new Pull Request

# License
MIT
