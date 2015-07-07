#!/usr/bin/env node

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var metaphrase = require('../src/metaphrase.js').metaphrase;

var m = new metaphrase({
  projectId: 19,
  language: 'gr',
  API_KEY: '614a98a31bd17b3a82094ef0388b9d81',
  cacheTTL: 1
});

//create a callback for onload
m.onLoadSubscribe(function(o) {
  //translate the entire page on load
  console.log('Translated keywords (language:' + o.language + '):\n');
  console.log(o.metaphraseKeyword('application_title'));
  console.log(o.metaphraseKeyword('heading_title'));
  console.log(o.metaphraseKeyword('heading_subtitle'));

  console.log(o.metaphraseKeyword('you_have_N_new_offers', {
    offers: 15
  }));
});

//switch langauge
m.switchLanguage();
