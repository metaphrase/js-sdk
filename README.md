# metaphrase-js
Javascript SDK for metaphrase service

Metaphrase is a
Currently metaphrase is not available for public.

##Install using bower

```shell
bower install metaphrase-js --save
```

Add scripts at the end of the body

```html
<script src="bower_components/metaphrase-js/src/metaphrase.js" type="text/javascript"></script>
<script type="text/javascript">
  (function() {
    var m = new metaphrase({
      projectId: 19,
      language: 'en',
      API_KEY: 'XXXXXXXXXXXXXXXXXXXXXXXX',
    });
  })();
</script>
```

This will translate all keywords inside the HTML document to `English`
for example

```html
<h1 data-i18="heading_title"></h1>
<a href="#" data-i18="terms_of_use_link" data-i18-title="terms_of_use"></a>
```
