#metaphrase-js
Javascript SDK for metaphrase service.

Metaphrase is a localization web service.
Currently metaphrase is not available for public.

[![Code Climate](https://codeclimate.com/github/metaphrase/metaphrase-js/badges/gpa.svg)](https://codeclimate.com/github/metaphrase/metaphrase-js)

##Install using bower

```shell
bower install metaphrase-js --save
```

Add these scripts at the end of the HTML's body

```html
<script src="bower_components/metaphrase-js/dist/metaphrase.min.js" type="text/javascript"></script>
<script type="text/javascript">
  (function() {
    var m = new metaphrase({
      projectId: 19, //Your project id here
      language: 'en', //Current language
      API_KEY: 'XXXXXXXXXXXXXXXXXXXXXXXX', //your API key here
    });
  })();
</script>
```

##Usage in HTML

This will translate all keywords inside the HTML document to `English`
for example

```html
<h1 data-i18="heading_title">Heading fallback</h1>
<a href="#" data-i18="terms_of_use_link" data-i18-title="terms_of_use"></a>
```

##Usage in javascript
```javascript
(function() {
  //Intitialize metaphrase sdk
  var m = new metaphrase({
    projectId: 19, //Your project id here
    language: 'en', //Current language
    API_KEY: 'XXXXXXXXXXXXXXXXXXXXXXXX', //your API key here
  });

  //This will return the translations of `you_have_N_new_messages` keyword
  console.log(
    m.metaphraseKeyword('you_have_N_new_messages', '{"messages":1}')
  );

  //This will translate the complete page
  m.metaphrasePage();

  //This will translate the element with id introduction_body and his children
  var parentElement = document.querySelector('#introduction_body');
  m.metaphrasePage(parentElement);
})();
```

##Documentation
Checkout and execute `grunt doc` to generate jsdoc documentation.
