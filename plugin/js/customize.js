/**
 * 
 */
(function(PLUGIN_ID) {
  'use strict';  
/**
 * @type {Array.<String>} events: kintoneイベント
 */
  var events = ['app.record.inex.show'];
  kintone.events.on(events, function(event) {
    // var record = event.record;
    //イベントタイプのラストワード
    // var eTypeLastWord = event.type.substr(event.type.lastIndexOf('.') + 1);
    console.log(PLUGIN_ID);
    return event;
  });
})(kintone.$PLUGIN_ID);