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


let right = document.querySelector("#right");//右箭头
let left = document.querySelector('#left');//左箭头


let temp = document.querySelector('#number');//实时温度
let temptxt = document.querySelector('#text');//实时天气
let wind = document.querySelector('#wind');//实时风向
let humidity = document.querySelector('#humidity');//实时湿度
let pressure = document.querySelector('#pressure');//实时气压
let aqi = document.querySelector('#aqi');//实时空气质量

let weatherIcon = document.querySelector('#weatherIcon');//实时天气图标
let life = document.querySelector('#life');//实时生活指数

//初始化
preLoad();
//默认为西安市
function preLoad() {
    let lifeUrl = 'https://devapi.qweather.com/v7/indices/1d?type=0&location=101110101&key=552a387a46de4ec1924f4ae7d4778ed4';
    let nowUrl = 'https://devapi.qweather.com/v7/weather/now?location=101110101&key=552a387a46de4ec1924f4ae7d4778ed4';
    let aqiUrl = 'https://devapi.qweather.com/v7/air/now?location=101110101&key=552a387a46de4ec1924f4ae7d4778ed4';
    Location('西安市');
    timeWeather(nowUrl,101110101);
    getAqi(aqiUrl,101110101);
    nowLife(lifeUrl,101110101);
}

//绑定搜索事件
btn.addEventListener('click', () => {
    let city = search.value;
    if (city != '') {
        let idUrl = 'https://geoapi.qweather.com/v2/city/lookup?location=' + city + '&key=552a387a46de4ec1924f4ae7d4778ed4';
        Load(idUrl, city);
        Location(city);
    }
})

//
function Load(idUrl, city) {
    getAjax(idUrl, xhr => {
        let data = JSON.parse(xhr.response);
        let cityId = data.location[0].id;
        let lifeUrl = 'https://devapi.qweather.com/v7/indices/1d?type=0&location='+cityId + '&key=552a387a46de4ec1924f4ae7d4778ed4';
        let nowUrl = 'https://devapi.qweather.com/v7/weather/now?location=' + cityId + '&key=552a387a46de4ec1924f4ae7d4778ed4';
        let aqiUrl = 'https://devapi.qweather.com/v7/air/now?location=' + cityId + '&key=552a387a46de4ec1924f4ae7d4778ed4';
        timeWeather(nowUrl, cityId);
        getAqi(aqiUrl, cityId);
        nowLife(lifeUrl,cityId);
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
        console.log(qualiy);
        console.log(typeof qualiy);
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
right.addEventListener('click',() => {
    life.style.left = '-1400px';
})
left.addEventListener('click',() => {
    life.style.left = '0';
})

