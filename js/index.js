onload =>{
    var canvas=document.getElementById("canvas");
    let dayUrl = 'https://devapi.qweather.com/v7/weather/7d?location=101110101&key=a8919d085a214522b6bfb62bd2e1ccd7';
    dayWeather(dayUrl,101110101);
}

function getAjax(httpurl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', httpurl);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(xhr);
            }
        }
    }
}

let loc = document.querySelector('#location');//城市
let search = document.querySelector('#search');//搜索框
let searchBtn = document.querySelector('#btn');//搜索按钮


let right = document.querySelectorAll("#right");//右箭头
let button = document.getElementsByTagName('button');
let hourWeatherDiv = document.querySelector('#hourWeather');
let left = document.querySelectorAll('#left');//左箭头


let temp = document.querySelector('#number');//实时温度
let temptxt = document.querySelector('#text');//实时天气
let wind = document.querySelector('#wind');//实时风向
let humidity = document.querySelector('#humidity');//实时湿度
let pressure = document.querySelector('#pressure');//实时气压
let aqi = document.querySelector('#aqi');//实时空气质量

let weatherIcon = document.querySelector('#weatherIcon');//实时天气图标
let life = document.querySelector('#life');//实时生活指数

let lis = document.querySelectorAll('#hourWeather > li');//逐时天气

let days = document.querySelectorAll('.day');//7天预报天数
let dates = document.querySelectorAll('.date');//7天预报日期
let dayTimes = document.querySelectorAll('.dayTime');//7天预报白天
let nightTimes = document.querySelectorAll('.nightTime');//7天预报夜晚
let winds = document.querySelectorAll('.wind');//7天预报风力
//初始化
preLoad();
//默认为西安市
function preLoad() {
    let idUrl = 'https://geoapi.qweather.com/v2/city/lookup?location=101110101&key=a8919d085a214522b6bfb62bd2e1ccd7';
    Load(idUrl,101110101);
    Location('西安市');
}

//绑定搜索事件
btn.addEventListener('click', () => {
    let city = search.value;
    if (city != '') {
        let idUrl = 'https://geoapi.qweather.com/v2/city/lookup?location=' + city + '&key=a8919d085a214522b6bfb62bd2e1ccd7';
        Load(idUrl, city);
        Location(city);
    }
})

//
function Load(idUrl, city) {
    getAjax(idUrl, xhr => {
        let data = JSON.parse(xhr.response);
        let cityId = data.location[0].id;
        let dayUrl = 'https://devapi.qweather.com/v7/weather/7d?location='+cityId+'&key=a8919d085a214522b6bfb62bd2e1ccd7';
        let hourUrl ='https://devapi.qweather.com/v7/weather/24h?location='+cityId+'&key=a8919d085a214522b6bfb62bd2e1ccd7';
        let lifeUrl = 'https://devapi.qweather.com/v7/indices/1d?type=0&location='+cityId + '&key=a8919d085a214522b6bfb62bd2e1ccd7';
        let nowUrl = 'https://devapi.qweather.com/v7/weather/now?location=' + cityId + '&key=a8919d085a214522b6bfb62bd2e1ccd7';
        let aqiUrl = 'https://devapi.qweather.com/v7/air/now?location=' + cityId + '&key=a8919d085a214522b6bfb62bd2e1ccd7';
        timeWeather(nowUrl, cityId);
        getAqi(aqiUrl, cityId);
        nowLife(lifeUrl,cityId);
        hourWeather(hourUrl,cityId);
        dayWeather(dayUrl, cityId)
    })
}

//更改城市信息
function Location(city) {
    loc.innerHTML = city ;
}

//获取实时天气
function timeWeather(nowUrl, cityId) {
    getAjax(nowUrl, xhr => {
        let data = JSON.parse(xhr.response);
        temp.innerHTML = data.now.temp + '°';
        temptxt.innerHTML = data.now.text;
        wind.innerHTML = data.now.windDir + ' ' + data.now.windScale + '级';
        humidity.innerHTML = '湿度' + ' ' + data.now.humidity + '%';
        pressure.innerHTML = '气压' + ' ' + data.now.pressure + 'hPa';
        weatherIcon.innerHTML = `<i class='qi-${data.now.icon}'> </i>`;
    });
}

// 获取实时空气质量
function getAqi(aqiUrl, cityId) {
    getAjax(aqiUrl, xhr => {
        let data = JSON.parse(xhr.response);
        let qualiy = data.now.category;
        let color = '#385F32';
        //根据空气质量修改背景颜色
        if(qualiy === '优'){
            color = '#385F32';
        }else if(qualiy === '良'){
            color = '#f0cc35';
        }else{
            color = 'red';
        }
        aqi.innerHTML = `
                <span id="aqi-content" style="background-color:${color}"> ${data.now.aqi} ${data.now.category}</span>
                    <div id="aqi-hover">
                            <div id="top" style="background-color:${color}" >空气质量指数 ${data.now.aqi} ${data.now.category}</div>
                            <ul id="aqi-info">
                            <li>${data.now.pm2p5}<span>PM2.5</span></li>
                            <li>${data.now.pm10}<span>PM10</span></li>
                            <li>${data.now.so2}<span>SO2</span></li>
                            <li>${data.now.no2}<span>NO2</span></li>
                            <li>${data.now.o3}<span>O3</span></li>
                            <li>${data.now.co}<span>CO</span></li>
                        </ul>
                    </div>
                `
        
       })
}

// 获取实时生活指数
function nowLife(lifeUrl, cityId){
    let allOuter = document.querySelectorAll('.outer');
    let allDetail = document.querySelectorAll('.detail');
    getAjax(lifeUrl, xhr => {
        let data = JSON.parse(xhr.response);
        
        allOuter[0].innerHTML = data.daily[2].name +' '+ data.daily[2].category;
        allOuter[1].innerHTML = data.daily[8].name +' '+ data.daily[8].category;
        allOuter[2].innerHTML = data.daily[6].name +' '+ data.daily[6].category;
        allOuter[3].innerHTML = data.daily[1].name +' '+ data.daily[1].category;
        allOuter[4].innerHTML = data.daily[0].name +' '+ data.daily[0].category;
        allOuter[5].innerHTML = data.daily[15].name +' '+ data.daily[15].category;
        allOuter[6].innerHTML = data.daily[3].name +' '+ data.daily[3].category;
        allOuter[7].innerHTML = data.daily[5].name +' '+ data.daily[5].category;
        allOuter[8].innerHTML = data.daily[14].name +' '+ data.daily[14].category;
        allOuter[9].innerHTML = data.daily[9].name +' '+ data.daily[9].category;
        allOuter[10].innerHTML = data.daily[7].name +' '+ data.daily[7].category;
        allOuter[11].innerHTML = data.daily[13].name +' '+ data.daily[13].category;

         allDetail[0].innerHTML = data.daily[2].text;
         allDetail[1].innerHTML = data.daily[8].text ;
         allDetail[2].innerHTML = data.daily[6].text ;
         allDetail[3].innerHTML = data.daily[1].text ;
         allDetail[4].innerHTML = data.daily[0].text ;
         allDetail[5].innerHTML = data.daily[15].text;
         allDetail[6].innerHTML = data.daily[3].text ;
         allDetail[7].innerHTML = data.daily[5].text ;
         allDetail[8].innerHTML = data.daily[14].text ;
         allDetail[9].innerHTML = data.daily[9].text ;
         allDetail[10].innerHTML = data.daily[7].text ;
         allDetail[11].innerHTML = data.daily[13].text ;
    })
}

//绑定按钮事件
button[1].addEventListener('click', () => {
    hourWeatherDiv.style.left = '-1390px';
})
button[2].addEventListener('click', () => {
    hourWeatherDiv.style.left = '10px';
})
button[3].addEventListener('click',() => {
    life.style.left = '-440px';
})
button[4].addEventListener('click',() => {
    life.style.left = '10px';
})

//逐小时天气
function hourWeather(hourUrl, cityId){
    getAjax(hourUrl, xhr => {
        let data = JSON.parse(xhr.response);
        console.log(data);
        const reg = /(?<=T).+?(?=\+)/
        const result = data.hourly[0].fxTime;
        console.log(reg.exec(result)[0]);
        for(let i = 0;i < 24;i++){
            lis[i].innerHTML = `
            <p id="time" style="color: #8a9baf;">${reg.exec(data.hourly[i].fxTime)}</p>
            <i class="qi-${data.hourly[i].icon}" style="font-size:40px ;"></i>
            <p style="font-size: 20px;">${data.hourly[i].temp}°</p>
            `
        }
    })
}

// 7天天气
function dayWeather(dayUrl, cityId){
    getAjax(dayUrl, xhr => {
        let data = JSON.parse(xhr.response);
        console.log(data.daily[0].tempMax);
        let date = new Date();
        let strDate = date.getDate();
        let nowMonth = date.getMonth() + 1;
    let l = ["日","一","二","三","四","五","六"];
    let d = new Date().getDay();
    for(let i = 0;i < 7;i++){
        //更改日期
        dates[i].innerHTML = nowMonth +'月'+strDate +'日';
        strDate++;
        // 更改天
        if(i <= 2){
            days[0].innerHTML = '今天';
            days[1].innerHTML = '明天';
            days[2].innerHTML = '后天';
        }else{
            days[i].innerHTML = '周' + l[(d+3)%7];
            d++;
        }
        //更改白天
        dayTimes[i].innerHTML = `
        ${data.daily[i].textDay}
        <i class="qi-${data.daily[i].iconDay}" style="margin-top: 10px; display: block; font-size: 40px;"></i>
        `

        // 更改夜晚
        nightTimes[i].innerHTML =`
        <i class="qi-${data.daily[i].iconNight}" style="margin-bottom: 10px; display: block; font-size: 40px;"></i>
        ${data.daily[i].textNight}
        `

        //更改风力
        winds[i].innerHTML = data.daily[i].windDirDay+' '+data.daily[i].windScaleDay+'级';
    }
       
    //更改折线图
    $(function(){
        var forecast=new Array();
            for(let i = 0;i < 7;i++){
                forecast[i] = new Array();
                forecast[i]['high']=data.daily[i].tempMax;
                forecast[i]['low']=data.daily[i].tempMin;
            }
            //温度走势图start
            var maxTemp=forecast[0]['high'];
            var minTemp=forecast[0]['low'];
            
            var high_tep_arr=[];
            for(x=0;x<forecast.length;x++){
                var high_tep=forecast[x]['high'];
                if(high_tep>maxTemp){maxTemp=high_tep;}
                high_tep_arr.push(high_tep);
            }
            var low_tep_arr=[];
            for(x=0;x<forecast.length;x++){
                var low_tep=forecast[x]['low'];
                if(low_tep<minTemp){minTemp=low_tep;}
                low_tep_arr.push(low_tep);
            }
            var canvas=document.getElementById("canvas");
            var context=canvas.getContext("2d");
            canvas.style.width='700px';
            canvas.style.height='170px';
            canvas.width=832;
            canvas.height=174;
            var item_width = 120;
            var wencha=maxTemp-minTemp;
            var tem_pexi=(80/(maxTemp-minTemp));//计算每度对应的px。80是自己设定的，这里画布总高是174,所以我设定这几天最高温度和最低温度之间间距为80。
            context.translate(53,maxTemp*tem_pexi+40);//画布的偏移量，53是画布x轴从左向右方向偏移。后面的值是y轴（细说一下：web里面的坐标轴和我们数学知识上学习的坐标系，y轴是相反的。故这里画点为了让温度高的点显示在温度低的上面，我们要取反。取反以后这个点就跑到画布以外去了，所以我们要向正方向偏移出来。偏移的数值，我这里是选择了最高温度所占对应px加上每个点上要写文字的距离，从而计算出来）。
            //折线走势
            var new_high_x=[];
            var new_high_y=[];
            function draw_line(a,high_color_line){
                new_high_x=[];
                new_high_y=[];
                for(var j=0;j<a.length;j++){//a温度数组
                    //画点
                context.beginPath();
                var high_y=parseInt(Number(a[j])*tem_pexi);
                var high_x=j * item_width;
               context.arc(high_x,-high_y,3,0,2*Math.PI,true);
               context.strokeStyle=high_color_line;
               context.stroke();
               context.fillStyle=high_color_line;
               context.fill();
               context.closePath();
               //画线
               new_high_x.push(high_x);
               new_high_y.push(-high_y);
                //写文字
                if(a==high_tep_arr){
                context.beginPath();
                context.font = "18px 微软雅黑";  
                context.fillStyle = "#333";
                context.fillText(a[j]+"°",high_x-10,-high_y-20,50);  
                context.stroke();
                context.closePath();
                }else{
                context.beginPath();
                context.font = "18px 微软雅黑";  
                context.fillStyle = "#333";
                context.fillText(a[j]+"°",high_x-10,-high_y+30,50);  
                context.stroke();
                context.closePath();
                }
            }
                for(var z=0;z<14;z++){
                    if(z == 6){
                        continue;
                    }
                    context.beginPath();
                    context.moveTo(new_high_x[z],new_high_y[z]);
                    context.lineTo(new_high_x[z+1],new_high_y[z+1]);
                    context.strokeStyle=high_color_line;
                    context.lineWidth=3;
                    context.stroke();
                    context.closePath();
    
                  }
            }
            draw_line(high_tep_arr,'#fcc370');
            draw_line(low_tep_arr,'#94ccf9');
                //温度走势图end
        })
    })
}
