/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function() {
  var metaphrase = function(params) {
    console.log('metaphrase');

    //projectId and API_KEY are required
    ['projectId', 'API_KEY'].forEach(function(p) {
      if (!params.hasOwnProperty(p)) {
        throw 'Parameter ' + p + ' is required!';
      }
    });

    /**
     * parameters default
     * @type {Object}
     */
    this.parameters = {
      projectId: null,
      language: 'en', //English
      API_KEY: null,
      onLoad: null,
      cacheType: null,
      cacheTTL: 3600000, //in milliseconds
      reportMissingKeys: true
    };

    //Base url of API service
    this.API_BASE = 'https://translate.nohponex.gr/';

    //copy given param to parameters object
    for (var p in params) {
      if (params.hasOwnProperty(p) && this.parameters.hasOwnProperty(p)) {
        this.parameters[p] = params[p];
      }
    }

    //Current language
    this.language = this.parameters.language;

    //Store missing keys
    this.missingKeys = [];

    //Current translation key : translation
    this.translation = [];

    var apiURL = this.API_BASE + 'fetch/listing/?id=' +
      this.parameters.projectId + '&language=' + this.language +
      '&api_key=' + this.parameters.API_KEY;

    //storage
    //Check sessionStorage
    var temp =
      (typeof(sessionStorage) !== 'undefined') ?
      sessionStorage.getItem(apiURL) : null;

    //Check localStorage
    if (!temp && typeof(localStorage) !== 'undefined') {
      temp = localStorage.getItem(apiURL);
    }

    //Use cached translation
    if (temp) {

      //Parse as json from session storage
      try {
        temp = JSON.parse(temp);

        if (!temp.date) {
          throw 'date not set';
        }

        //Time difference in milliseconds
        var diff = (new Date() - new Date(temp.date));

        //Check strored translation's date
        if (diff < this.parameters.cacheTTL) {

          this.language = temp.language;
          this.translation = temp.translation;

          console.log('from cache..');

          if (this.parameters.onLoad) {
            this.parameters.onLoad(this);
          }

        } else {
          //TODO
          localStorage.removeItem(apiURL);
          sessionStorage.removeItem(apiURL);

          temp = null;
        }
      } catch (e) {
        temp = null;
      }
    }
    if (!temp) {
      this.fetch();
    }
  };

  /**
   * Fetch translated strings
   * @return {[type]} [description]
   */
  metaphrase.prototype.fetch = function() {
    console.log('fetch');
    var request = new XMLHttpRequest();
    request.open('GET',
      this.API_BASE + 'fetch/listing/?id=' + this.parameters.projectId +
      '&language=' + this.parameters.language + '&api_key=' + this.parameters
      .API_KEY,
      true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        //todo add try catch
        this.translation = JSON.parse(request.responseText);
        console.log(this.translation);
      }

    };

    request.onerror = function() {};

    request.send();

  };

  /**
   * Metaphrase an DOM element's children
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  metaphrase.prototype.metaphrase = function(element) {
    element = typeof(element) !== 'undefined' ? element : document;

    var me = this;
    var elements = element.querySelectorAll('[data-i18]');

    //Replace all keys with the translated values
    [].forEach.call(elements, function(el, i) {
      console.log(el);
      var key = el.getAttribute('data-i18');
      if (key) {
        var parameters = null;
        if (el.getAttribute('data-i18-data')) {
          //Parse string as json object
          parameters = JSON.parse(el.getAttribute('data-i18-data'));
        }

        var t = me.metaphraseKeyword(key, parameters);

        if (t) { //If translation is available
          //Replace element's text
          el.innerHTML = t;
          //If translation is not available and element is empty
        } else if (!el.innerHTML) {
          elinnerHTML = key;
        }
      }
    });

    //Replace all data-i18-title
    elements = element.querySelectorAll('[data-i18-title]');

    [].forEach.call(elements, function(el, i) {
      //Get elements key
      var key = el.getAttribute('data-i18-title');

      if (key) {
        var t = me.metaphraseKeyword(key);

        if (t) { //If translation is available
          //Replace element's text
          el.setAttribute('title', t);
          //If translation is not available and element is empty
        } else if (!el.getAttribute('title')) {
          el.setAttribute('title', key);
        }
      }
    });

  };

  /**
   * Metaphrase a keyword
   * @param  {[type]} keyword    [description]
   * @param  {[type]} parameters [description]
   * @return {[type]}            [description]
   */
  metaphrase.prototype.metaphraseKeyword = function(keyword, parameters) {
    parameters = typeof(parameters) !== 'undefined' ? parameters : null;

    var t = this.translation[keyword];

    //If translation is not set
    if (!t) {

      //On missing key add request
      if (this.missingKeys.indexOf(keyword) < 0) {

        //Add key to missing key list
        this.missingKeys.push(keyword);

        //Add key to API
        this.addKey(keyword);

      }

      return null;

    }

    //If parameters are set
    if (parameters) {
      for (var k in parameters) {
        if (parameters.hasOwnProperty(k)) {
          t = t.replace('%' + k + '%', parameters[k]);
        }
      }
    }

    return t;
  };

  /**
   * Add missing key
   * @param  {[type]} keyword [description]
   * @return {[type]}         [description]
   */
  metaphrase.prototype.addKey = function(keyword) {
    //TOOD
  };

  //Expose metaphrase SDK class to window (for browsers) or exports (for nodejs)
  if (typeof(window) === 'undefined') {
    exports.metaphrase = metaphrase;
  } else {
    window.metaphrase = metaphrase;
  }
})();
