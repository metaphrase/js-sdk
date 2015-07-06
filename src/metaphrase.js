/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function() {
  var Metaphrase = function(params) {
    var missingKeys = [];

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
      language: 'en',
      API_KEY: null,
      onLoad: null,
      translationStorageType: sessionStorage,
      cacheTTL: 3600000
    };

    this.API_BASE = 'https://translate.nohponex.gr/';

    //copy given param to parameters object
    for (var p in params) {
      if (params.hasOwnProperty(p) && this.parameters.hasOwnProperty(p)) {
        this.parameters[key] = params[key];
      }
    }

    //Current language
    this.language = this.parameters.language;

    //Current translation key : translation
    this.translation = [];

    var apiURL = this.API_BASE + 'fetch/listing/?id=' + this.parameters.projectId +
      '&language=' + this.language + '&api_key=' + this.parameters.API_KEY;

    //storage
    //Check sessionStorage
    var temp = (typeof(sessionStorage) !== 'undefined') ? sessionStorage.getItem(
      apiURL) : null;

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
        if (diff < this.parameters.cache_duration) {

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
   * Metaphrase an DOM element's children
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  Metaphrase.prototype.metaphrase = function(element) {
    element = typeof(element) !== 'undefined' ? element : document;

    var elements = element.querySelectorAll('[data-i18]');
  };

  /**
   * Fetch translated strings
   * @return {[type]} [description]
   */
  Metaphrase.prototype.fetch = function() {
    var request = new XMLHttpRequest();
    request.open('GET',
      this.API_BASE + 'fetch/listing/?id=' + this.parameters.projectId +
      '&language=' + this.parameters.language + '&api_key=' + this.parameters
      .API_KEY,
      true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        JSON.parse(request.responseText);
      }

    };

    request.onerror = function() {};

    request.send();

  };

  /**
   * Metaphrase a keyword
   * @param  {[type]} keyword    [description]
   * @param  {[type]} parameters [description]
   * @return {[type]}            [description]
   */
  Metaphrase.prototype.metaphraseKeyword = function(keyword, parameters) {
    parameters = typeof(parameters) !== 'undefined' ? parameters : null;

    var t = this.translation[key];

    //If translation is not set
    if (!t) {

      //On missing key add request
      if (this.missingKeys.indexOf(key) < 0) {

        //Add key to missing key list
        this.missingKeys.push(key);

        //Add key to API
        this.addKey(key);

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

  Metaphrase.prototype.addKey = function(keyword) {
    //TOOD
  };

  //Expose Metaphrase SDK class to window (for browsers) or exports (for nodejs)
  if (typeof window === 'undefined') {
    exports.Metaphrase = Metaphrase;
  } else {
    window.Metaphrase = Metaphrase;
  }
})();
