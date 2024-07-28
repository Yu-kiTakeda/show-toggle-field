/**
 * 表示切り替え(デスクトップ)
 */
(function(PLUGIN_ID) {
  'use strict';

  const configObj = kintone.plugin.app.getConfig(PLUGIN_ID);
  const options = configObj.options ? JSON.parse(configObj.options) : [];

/**
 * @type {Array.<String>} events: kintoneイベント
 */
  const events = [
    ...['app.record.create.show', 'app.record.edit.show', 'app.record.print.show', 'app.record.detail.show'],
    ...options.reduce((condFields, opt) => {
      return condFields.concat(opt.conditions.filter((condition, condIdx) => {
        return condFields.indexOf(condition.field) < 0 && opt.conditions.findIndex(searchCondition => searchCondition.field === condition.field) === condIdx;
      }).map(condtion => {
        return condtion.field;
      }));
    }, []).reduce((events, field) => {
      return events.concat(['app.record.create.change.', 'app.record.edit.change.'].map(e => e + field));
    }, [])
  ];
  kintone.events.on(events, function(event) {
    const record = event.record;
    //イベントタイプのラストワード
    const eTypeLastWord = event.type.substr(event.type.lastIndexOf('.') + 1);

    const targetOptions = eTypeLastWord === 'show' ? 
      options.filter(opt => (!opt.applyPage || opt.applyPage === 'all') ? true : (opt.applyPage === 'detail' && event.type === 'app.record.detail.show') ? true : (opt.applyPage === 'edit' && (event.type === 'app.record.edit.show' || event.type === 'app.record.create.show')) ? true : false)
    : options.filter(opt => (!opt.applyPage || opt.applyPage === 'all' || opt.applyPage === 'edit') && opt.conditions.findIndex(cond => cond.field === eTypeLastWord) >= 0);

    targetOptions.map(opt => {
      let isShow = false;
      opt.conditions.map(condition => {
        if(!record[condition.field])return;
        if(condition.field === '') return;
        let isShow_condition = false;
        switch(record[condition.field].type) {
          case 'CHECK_BOX':
          case 'MULTI_SELECT':
          case 'CATEGORY': {
            const fieldValue = record[condition.field].value ? record[condition.field].value : [];
            if(condition.compare === 'equal' || condition.compare === '一致') {
              isShow_condition = fieldValue.some(value => value === condition.compareVal);
            } else if(condition.compare === 'include' || condition.compare === '含む') {
              isShow_condition =  fieldValue.some(value => value.indexOf(condition.compareVal) >= 0);
            }
            isShow = condition.isOr ? isShow || isShow_condition : isShow && isShow_condition;
            break;
          }
          case 'CREATED_TIME':
          case 'UPDATED_TIME':
          case 'DATE':
          case 'DATETIME': {
            if(!condition.compareVal || isNaN(new Date(condition.compareVal).getDate())) {
              if(!condition.isOr) isShow = false;
              break;
            }            
            let fieldValue = record[condition.field].value ? record[condition.field].value : '';            
            if(fieldValue && record[condition.field].type !== 'DATE') {
              const date = new Date(record[condition.field].value);
              date.setHours(date.getHours() + 9);
              fieldValue = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:0`;
            }
            if(condition.compare === 'equal' || condition.compare === '一致') {
              isShow_condition = fieldValue !== '' && (new Date(fieldValue).getTime() === new Date(condition.compareVal).getTime());
            } else if(condition.compare === 'include' || condition.compare === '含む') {
              isShow_condition = fieldValue.indexOf(condition.compareVal) >= 0;
            }
            isShow = condition.isOr ? isShow || isShow_condition : isShow && isShow_condition;
            break;
          }
          default: {
            const fieldValue = record[condition.field].value ? record[condition.field].value : '';
            if(condition.compare === 'equal' || condition.compare === '一致') {
              isShow_condition = fieldValue === condition.compareVal;
            } else if(condition.compare === 'include' || condition.compare === '含む') {
              isShow_condition = fieldValue.indexOf(condition.compareVal) >= 0;
            }            
            isShow = condition.isOr ? isShow || isShow_condition : isShow && isShow_condition;
          }          
        }
        return;      
      });
      opt.selectFields.map(field => {
        kintone.app.record.setFieldShown(field, (opt.isShowDefault ? !isShow : isShow));
        if(!record[field]) {
            // スペースの場合は要素を表示切替する
            var spaceEl = kintone.app.record.getSpaceElement(field);
            if(spaceEl) spaceShowToggle(spaceEl, (opt.isShowDefault ? !isShow : isShow));
        }
      });
    })

    return event;
  });
  /**
   * スペース切替
   * @param {HTMLElement} spaceElement : スペース要素
   * @param {Boolean} isShow : 表示切替の真偽値
   */
  function spaceShowToggle(spaceElement, isShow) {
    if(spaceElement) spaceElement.parentElement.style.cssText += (isShow ? 'display: inline-block !important;' : 'display: none !important;');    
  }

})(kintone.$PLUGIN_ID);