import React, {useState, useEffect} from "react";
import { Autocomplete, TextField, Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
// import { KintoneConfigHelper } from "KintoneConfigHelper";

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

  const excludeFieldTypes = ['CATEGORY', 'STATUS', 'STATUS_ASSIGNEE'];
  const excludeConditionFieldTypes = ['FILE', 'GROUP', 'REFERENCE_TABLE', 'SUBTABLE'];  
  const optionFields = fields.filter(field => excludeFieldTypes.indexOf(field.type) < 0);
  const includeTableFields = optionFields.reduce((includeTableFields, field) => field.type === 'SUBTABLE' ? includeTableFields.concat(Object.keys(field.fields).map(key => field.fields[key])) : includeTableFields, [])
  const conditionFields = optionFields.filter(field => excludeConditionFieldTypes.indexOf(field.type) < 0 && includeTableFields.indexOf(field) < 0);
  const selectFields = optionFields.filter(field => field.options);

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
  const hundleChangeAutoComplete_option = (optIdx, selectFidx, AC_Opt) => {
    let newOptions = [...options];
    newOptions[optIdx].selectFields[selectFidx] = AC_Opt ? AC_Opt.code: '';
    setOptions(newOptions);
  }

  const hundleChangeConditionField = (optIdx, condIdx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].field = value;
    setOptions(newOptions);
  };
  const hundleChangeAutoComplete_condition = (optIdx, condIdx, AC_Cond) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].field = AC_Cond ? AC_Cond.code: '';
    setOptions(newOptions);
  };

  const hundleChangeConditionCompare = (optIdx, condIdx, value) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].compare = value;
    setOptions(newOptions);
  };
  const hundleChangeAutoComplete_compare = (optIdx, condIdx, AC_Compare) => {
    let newOptions = [...options];
    newOptions[optIdx].conditions[condIdx].compare = AC_Compare ? AC_Compare.value : '';
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

  // スタイルの拡張（orverride）
  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            '.MuiOutlinedInput-root': {
              paddingTop: '2px', paddingBottom: '2px',
              '.MuiAutocomplete-input': {
                padding: 0
              }
            },
            '.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': {
              top: '50%', transform: 'translate(9px, -50%)'
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    // フィールド取得
    kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', {app: kintone.app.getId()}, resp => {      
      let fields = Object.keys(resp.properties).reduce((fields, fieldCode) => {
        fields.push(resp.properties[fieldCode]);
        if(resp.properties[fieldCode].type === 'SUBTABLE') {
          fields = fields.concat(Object.keys(resp.properties[fieldCode].fields).map(key => resp.properties[fieldCode].fields[key]));
        }
        return fields;
      }, []);
      // スペース取得
      KintoneConfigHelper.getFields('SPACER').then(resp => {
        fields = fields.concat(resp.filter(spacer => spacer.elementId).map(spacer => ({type: spacer.type, label: spacer.elementId, code: spacer.elementId})));
        setFields(fields);
      }).catch(err => {
        console.log(err);        
      });            
    }, err => {
      console.log(err);
    })

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
    <ThemeProvider theme={theme}>
    <div>
      <ul>
        {
          options.map((opt, optIdx) =>           
            <li className="kintoneplugin-row" key={optIdx}>
              <p className="kintoneplugin-label"></p>
              <div className="select-fields">
                <p className="kintoneplugin-title">表示を切替るフィールド</p>
                <ul className="show-toggle-fields">
                  {opt.selectFields.map((field, selectF_idx) =>
                    <li key={selectF_idx}>
                      <Autocomplete
                        disablePortal                        
                        options={optionFields.map((field, i) => ({label: field.label, type: field.type, code: field.code}))}
                        isOptionEqualToValue={(option, value) => option.type === value.type && option.code === value.code}                        
                        value={
                          optionFields.findIndex(field => field.code === opt.selectFields[selectF_idx]) >= 0 ? 
                            {code: opt.selectFields[selectF_idx], type: optionFields[optionFields.findIndex(field => field.code === opt.selectFields[selectF_idx])].type, label: optionFields[optionFields.findIndex(field => field.code === opt.selectFields[selectF_idx])].label} : null
                        }
                        sx={{ width: 300, display: 'inline-block', p: 0}}
                        renderInput={(params) => <TextField {...params} label="Field" sx={{p: 0}}/>}
                        renderOption={(props, option) => {
                          return (
                            <Box component="li" {...props} key={option.code} sx={{p: 0}}>
                              {option.label}
                            </Box>
                          )
                        }}
                        noOptionsText="見つかりません"
                        onChange={(event, value, reason) => {hundleChangeAutoComplete_option(optIdx, selectF_idx, value);}}
                      />
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
                          <Autocomplete
                            disablePortal                        
                            options={conditionFields.map((field, i) => ({label: field.label, type: field.type, code: field.code}))}
                            isOptionEqualToValue={(option, value) => option.type === value.type && option.code === value.code}                        
                            value={
                              conditionFields.findIndex(field => field.code === opt.conditions[condIdx].field) >= 0 ? 
                                {code: opt.conditions[condIdx].field, type: conditionFields[conditionFields.findIndex(field => field.code === opt.conditions[condIdx].field)].type, label: conditionFields[conditionFields.findIndex(field => field.code === opt.conditions[condIdx].field)].label} : null
                            }
                            sx={{ width: 300, display: 'inline-block', p: 0}}
                            renderInput={(params) => <TextField {...params} label="Field" sx={{p: 0}}/>}
                            renderOption={(props, option) => {
                              return (
                                <Box component="li" {...props} key={option.code} sx={{p: 0}}>
                                  {option.label}
                                </Box>
                              )
                            }}
                            noOptionsText="見つかりません"
                            onChange={(event, value, reason) => {hundleChangeAutoComplete_condition(optIdx, condIdx, value);}}
                          />
                            <Autocomplete                                                      
                              options={comparis}                         
                              value={comparis.findIndex(compare => compare.value === opt.conditions[condIdx].compare) >= 0 ?  comparis[comparis.findIndex(compare => compare.value === opt.conditions[condIdx].compare)] : null}
                              sx={{ width: 150, display: 'inline-block', p: 0}}
                              renderInput={(params) => <TextField {...params} label="条件" sx={{p: 0}}/>}                            
                              onChange={(event, value, reason) => {hundleChangeAutoComplete_compare(optIdx, condIdx, value);}}
                            />
                            <Autocomplete
                              freeSolo                        
                              options={selectFields.filter(field => field.code === opt.conditions[condIdx].field).reduce((options, field) => Object.keys(field.options), [])}                            
                              value={opt.conditions[condIdx].compareVal}
                              sx={{ width: 150, display: 'inline-block', p: 0}}
                              renderInput={(params) => <TextField {...params} label="値" sx={{p: 0}}/>}                            
                              onChange={(event, value, reason) => {hundleChangeConditionCompareVal(optIdx, condIdx, value);}}
                            />
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
    </ThemeProvider>  
  );
}
