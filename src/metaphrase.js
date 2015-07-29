/*
 * metaphrase javscript SDK
 * @author Xenophon Spafaridis <nohponex@gmail.com>
 */
(function() {
  /**
   * Create a new metaphrase object.
   * @class
   * @global
   * @param  {!Object}  params                            Initialization parameters.
   * @param  {!number}  params.projectId                  Project's id.
   * @param  {!string}  params.API_KEY                    Your API key.
   * @param  {string}   [params.language=en]              Language to use.
   * @param  {number}   [params.cacheTTL=3600000]         Cache title to live.
   * @param  {string}   [params.language]                 Language to use.
   * @param  {boolean}  [params.reportMissingKeys=false]  Report missing keys to serice.
   * @throws Throws exception when params.projectId or params.API_KEY is not set.
   * @todo add option to show keyword when translation is missing.
   */
  var metaphrase = function(params) {

    params = typeof(params) !== 'undefined' ? params : {};

    //projectId and API_KEY initialization parameters are required
    ['projectId', 'API_KEY'].forEach(function(p) {
      if (!params.hasOwnProperty(p)) {
        throw 'Parameter ' + p + ' is required!';
      }
    });

    /**
     * Default parameters object.
     * @type {Object}
     */
    this.parameters = {
      projectId: null,
      language: 'en', //English
      API_KEY: null,
      cacheType: null,
      cacheTTL: 3600000, //in milliseconds
      reportMissingKeys: false
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

  };

  /**
   * Switch to language, use this language, fetch the translated keyword and translated the page.
   * @param  {string|null} [language] Use this language's translations.
   */
  metaphrase.prototype.switchLanguage = function(language, cb) {
    if (language) {
      this.language = language;
    }

    var apiURL = this.API_BASE + 'fetch/listing/?id=' +
      this.parameters.projectId + '&language=' + this.language +
      '&api_key=' + this.parameters.API_KEY;

    //Check sessionStorage
    var cached =
      (typeof(sessionStorage) !== 'undefined') ?
      sessionStorage.getItem(apiURL) : null;

    //Check localStorage
    if (!cached && typeof(localStorage) !== 'undefined') {
      cached = localStorage.getItem(apiURL);
    }

    //Chech cached data
    if (cached) {

      //Parse as json from session storage
      try {
        cached = JSON.parse(cached);

        if (!cached.date) {
          throw 'date not set';
        }

        //Time difference in milliseconds
        var diff = (new Date() - new Date(cached.date));

        //Check strored translation's date
        if (diff < this.parameters.cacheTTL) {

          //this.language = cached.language;
          this.translation = cached.translation;

        } else {
          //clear storage
          localStorage.removeItem(apiURL);
          sessionStorage.removeItem(apiURL);

          cached = null;
        }
      } catch (e) {
        cached = null;
      }
    }
    var me = this;

    //if cached version is available
    if (cached) {
      if (cb) {
        cb(null, me);
      }
      //else fetch a 'fresh' copy
    } else {

      this.fetch(this.language, function(err, lang, translations) {
        if (err) {
          return;
        }
        if (cb) {
          cb(null, me);
        }
      });
    }
  };

  /**
   * Fetch translated strings from service's remote API
   *
   * @param {string} language Fetch translations in this language.
   * @param {requestCallback} [cb] The callback that handles the response.
   * @this {metaphrase}
   * @memberof metaphrase
   */
  metaphrase.prototype.fetch = function(language, cb) {
    var me = this;

    var request = new XMLHttpRequest();
    request.open('GET',
      this.API_BASE + 'fetch/listing/?id=' + this.parameters.projectId +
      '&language=' + language + '&api_key=' + this.parameters
      .API_KEY,
      true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        //todo add try catch
        me.translation = JSON.parse(request.responseText).translation;

        //if callback is set, call it
        if (cb) {
          cb(null, language, me.translation);
        }
      }

    };

    request.onerror = function() {
      if (cb) {
        cb('error');
      }
    };

    request.send();

  };

  /**
   * This callback is displayed as a global member.
   * @callback requestCallback
   * @param {string} err Error
   * @param {string} language Language of fetched translations.
   * @param {object} translation Trasnlated keywords object.
   */

  /**
   * Translate a DOM element's children.
   *
   * @param  {Element} [element=document] Parent HTML element, use document to translate the entire page.
   * @memberof metaphrase
   */
  metaphrase.prototype.metaphrasePage = function(element) {

    element = typeof(element) !== 'undefined' ? element : document;

    var elements = element.querySelectorAll('[data-i18]');

    //Replace all keys with the translated values
    [].forEach.call(elements, function(el, i) {
      var key = el.getAttribute('data-i18');

      if (key) {
        var parameters = null;
        if (el.getAttribute('data-i18-data')) {
          try {
            //Parse string as json object
            parameters = JSON.parse(el.getAttribute('data-i18-data'));
          } catch (e) {
            parameters = null;
          }
        }

        var t = this.metaphraseKeyword(key, parameters);

        if (t) { //If translation is available
          //Replace element's text
          el.innerHTML = t;
          //If translation is not available and element is empty
        } else if (!el.innerHTML) {
          el.innerHTML = key;
        }
      }
    }, this);

    //Replace all data-i18-title
    elements = element.querySelectorAll('[data-i18-title]');

    [].forEach.call(elements, function(el, i) {
      //Get elements key
      var key = el.getAttribute('data-i18-title');

      if (key) {
        var t = this.metaphraseKeyword(key);

        if (t) { //If translation is available
          //Replace element's text
          el.setAttribute('title', t);
          //If translation is not available and element is empty
        } else if (!el.getAttribute('title')) {
          el.setAttribute('title', key);
        }
      }
    }, this);

    //Replace all data-i18-lang
    elements = element.querySelectorAll('[data-i18-lang]');
    [].forEach.call(elements, function(el, i) {
      //Set current language as text
      el.innerHTML = this.language;
    }, this);

    //Report missing keys
    if (this.parameters.reportMissingKeys) {
      this.missingKeys.forEach(function(item, index) {
        this.addKey(item);
      }, this);
    }
  };

  /**
   * Metaphrase a keyword.
   *
   * @memberof metaphrase
   * @param  {!string} keyword    Keyword.
   * @param  {Object} [parameters={}] Keyword's parameters object.
   * @return {string|null}            Returns the translation of requested key, null if not available.
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
   * Add missing key to service's remote API.
   *
   * @memberof metaphrase
   * @param  {string} keyword Keyword.
   * @param  {Object} [metadata={}] Additional metadata.
   * @todo Authenticate request.
   * @todo Warning only for IE10+
   */
  metaphrase.prototype.addKey = function(keyword, metadata, cb) {

    var request = new XMLHttpRequest();
    request.open('POST',
      this.API_BASE + 'fetch/create/?id=' + this.parameters.projectId +
      '&api_key=' + this.parameters
      .API_KEY,
      true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        //if callback is set, call it
        if (cb) {
          cb(null);
        }
      }

    };

    request.onerror = function() {
      if (cb) {
        cb('error');
      }
    };

    var data = new FormData();
    data.append('key', keyword);

    request.send(data);
  };

  //Expose metaphrase SDK class to window (for browsers) or exports (for nodejs)
  if (typeof(window) === 'undefined') {
    exports.metaphrase = metaphrase;

    //XMLHttpRequest is not set in node.js load the, use the xmlhttprequest package
    if (typeof(XMLHttpRequest) === 'undefined') {
      XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    }
  } else {
    window.metaphrase = metaphrase;
  }
})();
