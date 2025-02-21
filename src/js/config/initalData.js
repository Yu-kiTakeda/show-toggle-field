export async function initalData(appId) {

    let data = [];

    try {
        const appInfo = await kintone.api(`/k/v1/app.json`, 'GET', { id: appId });

        console.log(appInfo);
        if(appInfo.name == '事件管理') {
            data = [
                {
                    applyPage: 'all',
                    isShowDefault: true,
                    selectFields: ['CarAccident', '保険会社'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "交通事故・損害保険",
                        field: "case_types_category",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['依頼者名'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "成年後見",
                        field: "case_types_category",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['顧問'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "顧問",
                        field: "case_types_category",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['顧問'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "顧問",
                        field: "case_types_category",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['被相続人'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "遺言，相続",
                        field: "case_types_category",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['被相続人'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "遺言，相続",
                        field: "case_types_category",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['月々の金額'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "月々の金額",
                        field: "分割方法",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['分割回数'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "回数",
                        field: "分割方法",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['タイムチャージ一覧','HiddenGroup'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "",
                        field: "",
                        isOr: true,
                    }
                    ]
                },
            ];
        }
        if(appInfo.name == '記録') {
            data = [
                {
                    applyPage: 'all',
                    isShowDefault: true,
                    selectFields: ['重要度', 'カテゴリ','発信者','折り返し電話番号','ConfirmedUser','対応チェック','通知先'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "受電",
                        field: "formType",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['scheduleType'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "スケジュール",
                        field: "formType",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: true,
                    selectFields: ['日時'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "スケジュール",
                        field: "formType",
                        isOr: true,
                    },
                    {
                        compare: "equal",
                        compareVal: "ToDo",
                        field: "formType",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['締切日','事件種類','関連TODO一覧','関連タスクID','タスク名','状態','担当者'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "ToDo",
                        field: "formType",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['公開非公開','alertDay'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "スケジュール",
                        field: "formType",
                        isOr: true,
                    }
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: true,
                    selectFields: ['startDate','endDate','allDay','equipment','繰り返し予定'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "受電",
                        field: "formType",
                        isOr: true,
                    },
                    {
                        compare: "equal",
                        compareVal: "経過記録",
                        field: "formType",
                        isOr: true,
                    },
                    {
                        compare: "equal",
                        compareVal: "ToDo",
                        field: "formType",
                        isOr: true,
                    },
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: true,
                    selectFields: ['scheduleTitle','公開非公開'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "受電",
                        field: "formType",
                        isOr: true,
                    },
                    {
                        compare: "equal",
                        compareVal: "経過記録",
                        field: "formType",
                        isOr: true,
                    },
                    ]
                },
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: ['HiddenGroup'],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "",
                        field: "",
                        isOr: true,
                    }
                    ]
                },
            ];
        }

        //もし、dataが空だったら、初期値を空で設定
        if(data.length == 0) {
            data = [
                {
                    applyPage: 'all',
                    isShowDefault: false,
                    selectFields: [''],
                    conditions: [
                    {
                        compare: "equal",
                        compareVal: "",
                        field: "",
                        isOr: true,
                    }
                    ]
                }
            ];
        }
    } catch(e) {
        console.log(e);
        console.log('initalData: 初期値の取得に失敗しました。');
        return [];
    }

    return data;
}