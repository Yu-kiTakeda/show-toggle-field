import React, {useState, useEffect} from "react";

// import { KintoneConfigHelper } from "kintone-config-helper";

export default function Config({pluginId}) {
  
  const initialCondition = {
    field: '', compare: '', compareVal: '', isOr: true
  };
  const initialOption = {
    selectFields: [""],
    isShowDefault: true,
    conditions: [
      initialCondition
    ]
  };

  const [options, setOptions] = useState([initialOption]);
  const [fields, setFields] = useState([]);

  const excludeConditionFieldTypes = ['FILE', 'USER_SELECT', 'ORGANIZATION_SELECT', 'GROUP_SELECT','REFERENCE_TABLE', 'SUBTABLE', 'GROUP', 'CREATOR', 'MODIFIER'];
  const conditionFields = fields.filter(field => excludeConditionFieldTypes.indexOf(field.type) < 0);

  const comparis = [
    {label: '一致', value: 'equal'},
    {label: '含む', value: 'include'}
  ];

  const hundleClickAddOption = (optIdx) => {
    let newOptions = [...options];
    newOptions.splice(optIdx, 0, initialOption);
    setOptions(newOptions);
  };
  const hundleClickDelOption = (optIdx) => {
    let newOptions = [...options];
    newOptions.splice(optIdx, 1);
    setOptions(newOptions);
  };

  const hundleClickAddFieldSelect = (optIdx, selectF_idx) => {
    let newOptions = [...options];
    newOptions[optIdx].selectFields.splice(selectF_idx, 0, "");
    setOptions(newOptions);
  };
  const hundleClickDelFieldSelect = (optIdx, selectF_idx) => {
    let newOptions = [...options];
    newOptions[optIdx].selectFields.splice(selectF_idx, 1);
    setOptions(newOptions);
  };

  const hundleClickAddCondition = (optIdx, condIdx) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions.splice(condIdx, 0, initialCondition);
    setOptions(newOptions);
  };
  const hundleClickDelCondition = (optIdx, condIdx) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions.splice(condIdx, 1);
    newOptions[optIdx].conditions[0].isOr = true;
    setOptions(newOptions);
  };

  const hundleChangeSelectField = (optIdx, selectFidx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].selectFields[selectFidx] = value;
    setOptions(newOptions);
  };

  const hundleChangeConditionField = (optIdx, condIdx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].field = value;
    setOptions(newOptions);
  };
  const hundleChangeConditionCompare = (optIdx, condIdx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].compare = value;
    setOptions(newOptions);
  };
  const hundleChangeConditionCompareVal = (optIdx, condIdx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].compareVal = value;
    setOptions(newOptions);
  };
  const hundleChangeRadio = (optIdx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].isShowDefault = value === 'show';
    setOptions(newOptions);
  };
  const hundleChangeOrAndSelect = (optIdx, condIdx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].isOr = value === 'or';
    setOptions(newOptions);
  }

  const hundleClickSave = () => {
    kintone.plugin.app.setConfig({options: JSON.stringify(options)});
  };
  const hundleClickCancel = () => {
    location.href = location.href.match(/.*\//)[0];
  };

  useEffect(() => {    
    KintoneConfigHelper.getFields().then(getFields => {
        setFields(getFields.filter(getF => getF.type !== 'SPACER'));
    }).catch(error => {
      console.log(JSON.stringify(error));
    });

    if(pluginId) {
      const configObj = kintone.plugin.app.getConfig(pluginId);
      if(configObj.options)  {
        let newOptions = JSON.parse(configObj.options);
        newOptions = newOptions.map(newOption => {
          let newOpt = Object.assign({...initialOption}, newOption);
          newOpt.conditions = newOpt.conditions.map((condition => Object.assign({...initialCondition}, condition)));
          return newOpt;
        });
        setOptions(newOptions);      
      }
    }
  }, []);

  return(
    <div>
      <ul>
        {
          options.map((opt, optIdx) =>           
            <li className="kintoneplugin-row" key={optIdx}>
              <p className="kintoneplugin-label"></p>
              <div className="select-fields">
                <p className="kintoneplugin-title">表示を切替るフィールド</p>
                <ul className="">
                  {opt.selectFields.map((field, selectF_idx) =>
                    <li key={selectF_idx}>
                      <select value={fields.filter(f => f.code === field).length ? field : ""} onChange={(e) => {hundleChangeSelectField(optIdx, selectF_idx,e.currentTarget.value)}}>
                        <option value="" disabled>フィールドを選択してください。</option>
                        {
                          fields.map((field, idx) => <option value={field.code} key={idx}>{field.label ? field.label: field.code}</option>)
                        }
                      </select>
                      <div className="buttons">
                        <button className="add-field-select" onClick={() => {hundleClickAddFieldSelect(optIdx,selectF_idx+1)}}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                        {(() => {
                          if(opt.selectFields.length > 1) return <button className="del-field-select" onClick={() => {hundleClickDelFieldSelect(optIdx, selectF_idx)}}><i className="fa fa-minus-circle" aria-hidden="true"></i></button>
                        })()}
                      </div>
                    </li>
                  )}
                </ul>              
              </div>
              <div className="select-conditions">
              <p className="kintoneplugin-title">表示切替の条件</p>
                <div className="isShow-default">
                  <p className="radio-title">初期状態</p>
                  <label><input type="radio" value="show" checked={opt.isShowDefault} onChange={(e) => { hundleChangeRadio(optIdx, e.currentTarget.value); }} />表示</label>
                  <label><input type="radio" value="hidden" checked={!opt.isShowDefault} onChange={(e) => { hundleChangeRadio(optIdx, e.currentTarget.value); }}/>非表示</label>
                </div>
                <ul className="list-condition">
                  {
                    opt.conditions.map((cond, condIdx) => {
                      return (
                        <li key={condIdx}>
                          {
                            (() => {
                              if(condIdx >= 1) return (
                                <div className="select_or-and">
                                  <select value={cond.isOr ? 'or' : 'and'} onChange={(e) => {hundleChangeOrAndSelect(optIdx, condIdx, e.currentTarget.value)}}>
                                    <option value="or">または</option>
                                    <option value="and">かつ</option>
                                  </select>
                                </div>
                              );
                            })()
                          }
                          <div>
                            <select value={conditionFields.filter(f => f.code === cond.field).length ? cond.field : ""} onChange={(e) => {hundleChangeConditionField(optIdx, condIdx, e.currentTarget.value)}}>
                              <option value="" disabled>フィールドを選択してください。</option>
                              {
                                conditionFields.map((field, idx) => <option value={field.code} key={idx}>{field.label ? field.label: field.code}</option>)
                              }
                            </select>
                            <select value={cond.compare} onChange={(e) => {hundleChangeConditionCompare(optIdx, condIdx, e.currentTarget.value)}}>
                              <option value ="" disabled>条件を選択してください。</option>
                              {
                                comparis.map((compare, idx) => <option value={compare.value} key={idx}>{compare.label}</option>)
                              }
                            </select>
                            <input type="text" placeholder="文字を入力してください。" value={cond.compareVal} onChange={(e) => {hundleChangeConditionCompareVal(optIdx, condIdx, e.currentTarget.value)}} />
                          </div>
                          <div className="buttons">
                            <button className="add-option" onClick={() => {hundleClickAddCondition(optIdx, condIdx+1)}}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                            {(() => {
                              if(opt.conditions.length > 1) return <button className="del-option" onClick={() => {hundleClickDelCondition(optIdx, condIdx)}}><i className="fa fa-minus-circle" aria-hidden="true"></i></button>
                            })()}
                          </div>                          
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
              <div className="buttons">
                  <button className="add-option" onClick={() => {hundleClickAddOption(optIdx+1)}}><i className="fa fa-plus" aria-hidden="true"></i></button>
                  {(() => {
                    if(options.length > 1) return <button className="del-option" onClick={() => {hundleClickDelOption(optIdx)}}><i className="fa fa-minus" aria-hidden="true"></i></button>
                  })()}
              </div>       
            </li>
          )
        }
      </ul>
      <div className="buttons save-buttons">
        <button className="kintoneplugin-button-dialog-ok" onClick={() => {hundleClickSave()}}>保存する</button>
        <button className="kintoneplugin-button-dialog-cancel" onClick={() => {hundleClickCancel()}}>キャンセル</button>
      </div>
    </div>   
  );
}
