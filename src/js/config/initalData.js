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