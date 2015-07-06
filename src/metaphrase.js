/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function() {
  var Metaphrase = function(params) {
    var missingKeys = [];

    [projectId, API_KEY].forEach(function(p) {
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
        parameters[key] = params[key];
      }
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

  };

  //Expose Solver class to window (for browsers) or exports (for nodejs)
  if (typeof window === 'undefined') {
    exports.Solver = Solver;
  } else {
    window.Solver = Solver;
  }
})();
