$(document).ready(function () {
    
    setProgress(30, 'Расчет данных', false);
    var startTime = new Date();
    var secondSimple = findGetParameter('second') || false;
    var width = findGetParameter('width') || false;

    if (!secondSimple) {
        $.get('http://10.3.85.3:3000/',{width:width}).then(function (resp) {
            resp = (typeof  resp == 'object') ? resp : JSON.parse(resp);
            console.log(Math.round(((Date.now()) - startTime) / 1000 / 60));
            setProgress(60, 'Визуалзиация данных', false);
            setTimeout(function () {
                renderTables(resp.machines, resp.machineTypes, resp.originalItems, 900);
            }, 500);
        })
    }else{
        $.get('http://10.3.85.3:3000/2',{width:width}).then(function (resp) {
            resp = (typeof  resp == 'object') ? resp : JSON.parse(resp);
            console.log(Math.round(((Date.now()) - startTime) / 1000 / 60));
            setProgress(60, 'Визуалзиация данных', false);
            setTimeout(function () {
                renderTables(resp.machines, resp.machineTypes, resp.originalItems, 30);
            }, 500);
        })
    }
    
});