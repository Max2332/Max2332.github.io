function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    
    return color;
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function setProgress(procent, text) {
    $('.progress-bar').html(text).width(procent + '%')
    if(procent == 100){
        $('.bar-bottom').fadeOut();
    }
}


function renderTables(machines, machineTypes, originalItems, scaleTable1) {
    
    function getMachineNameById(id) {
        return machineTypes.find(type => type.id == id).name;
    }
    
    console.log(machines);
    
    let mainTable = document.querySelector('.s-main-table');
    machines.forEach(machine => {
        let tr = document.createElement('tr');
        tr.id = machine.id;
        mainTable.appendChild(tr);
        
        tr = document.getElementById(machine.id);
        let th = document.createElement('th');
        th.scope = 'row';
        th.innerHTML = machine.id;
        th.style = 'width: 30px; padding: 0.25rem;';
        tr.appendChild(th);
        let td = document.createElement('td');
        td.style = 'position: relative; width: 100%; padding-top: 0;';
        tr.appendChild(td);
        
        td = tr.querySelector('td');
        machine.ranges.forEach(range => {
            let hoursRangeFrom = range.timeRange.timeFrom / 60 * scaleTable1;
            let hoursRangeTo = range.timeRange.timeTo / 60 * scaleTable1;
            
            let width = hoursRangeTo - hoursRangeFrom;
            
            let span = document.createElement('span');
            span.style = `height: 100%; display:block; top:0; position: absolute; width: ${width}px; left: ${hoursRangeFrom}px; background: ${range.item.color};`;
            span.dataset.toggle = 'tooltip';
            span.dataset.originalTitle = range.item.name + `(${range.timeRange.timeFrom} - ${range.timeRange.timeTo})`;
            span.dataset.color = range.item.color;
            
            td.appendChild(span);
        });
    });
    
    // let itemsTable = document.querySelector('.s-items-table');
    // originalItems.forEach((item, key) => {
    //     let tr = document.createElement('tr');
    //     tr.id = 'item-' + item.id * key;
    //     itemsTable.appendChild(tr);
    //
    //     tr = document.getElementById('item-' + item.id * key);
    //
    //     let th = document.createElement('th');
    //     th.scope = 'row';
    //     th.innerHTML = item.name;
    //     th.style = 'width: 50px; padding: 0.25rem;';
    //     tr.appendChild(th);
    //
    //     let td = document.createElement('td');
    //     td.style = `width: 100%; background: ${item.color}; padding-top: 0;`;
    //     td.dataset.color = item.color;
    //
    //     tr.appendChild(td);
    // });
    
    $(document).on('click', '.s-items-table td, [data-color]', function () {
        let items = $(document).find('[data-color="' + this.dataset.color + '"]');
        let spans = $(document).find('span, .s-items-table td');
        $.each(spans, function (index, value) {
            $(value).css('border', '0px');
        });
        $.each(items, function (index, value) {
            $(value).css('border', '4px solid black');
        });
    })
    
    /**
     * Вывод нижних таблиц
     */
    machines = machines.map((machine, index) => {
        
        machine.color = getRandomColor();
        
        var $tr = $('<tr></tr>');
        var $colorTd = $('<td>' + machine.color + '</td>')
        $colorTd.css('background', machine.color);
        var $nameTd = $('<td>' + getMachineNameById(machine.typeId) + '</td>');
        $tr.append($nameTd);
        $tr.append($colorTd);
        $('.machines').append($tr);
        
        return machine;
    });
    
    
    let allMachinesRanges = [].concat.apply([], machines.map((machineItem, index) => {
        let ranges = machineItem.ranges.map(range => {
            range.color = machineItem.color;
            range.typeId = machineItem.typeId;
            return range
        })
        return ranges;
    }));
    
    let maxDateTo = Math.max.apply(Math, allMachinesRanges.map(machineRange => machineRange.timeRange.timeTo));
    let allParts = [].concat.apply([], allMachinesRanges.map(range => {
        return {
            name: range.item.name,
            id: range.item.id
        };
    }));
    
    let uniquePartsIds = [];
    let uniqueParts = [];
    for (var i = 0; i < allParts.length; i++) {
        var itemId = allParts[i].id;
        if (uniquePartsIds.findIndex(existId => existId == itemId) < 0) {
            uniqueParts.push(allParts[i]);
            uniquePartsIds.push(allParts[i].id);
        }
    }
    
    var $tr = $('.timetable .minutes');
    for (var i = 1; i <= maxDateTo; i++) {
        $tr.append('<th>' + i + '</th>');
    }
    
    uniqueParts.forEach(part => {
        var $tr = $('<tr></tr>');
        $tr.append('<td style="width: 300px; display: block;">' + part.name + '</td>');
        for (var i = 1; i <= maxDateTo; i++) {
            var $td = $('<td></td>');
            $tr.append($td);
            allMachinesRanges.map(range => {
                if (
                    range.item.id === part.id &&
                    range.timeRange.timeFrom < i &&
                    range.timeRange.timeTo >= i
                ) {
                    $td.attr('data-toggle', 'tooltip');
                    $td.attr('data-original-title', getMachineNameById(range.typeId));
                    $td.css({
                        'background': range.color,
                        'border': 'none'
                    });
                }
            })
        }
        $('.timetable').append($tr);
    });
    
    $('[data-toggle="tooltip"]').tooltip();
    setTimeout(function () {
        setProgress(100, 'Конец визуализации');
    },800)
}