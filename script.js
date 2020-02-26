var temp_button1 = 1;
var rain_button1 = 0;
var temp_button2 = 1;
var rain_button2 = 0;
var city_ids = ["6619279","3996063","524901","6455259","1796236"] 
var current_id = "6619279"
var krakow_id = "3094802"

document.getElementsByClassName("country_name")[0].onclick = function() {
    document.getElementById("cityName").innerHTML = this.innerHTML
    current_id = city_ids[0]
    $('body').css("background-image","url('bg2.jpg')")
    air_quality("pm2","New York")
    chartdata()
    
}
document.getElementsByClassName("country_name")[1].onclick = function() {
    document.getElementById("cityName").innerHTML = this.innerHTML
    current_id = city_ids[1];
    $('body').css("background-image","url('bg2.jpg')")
    air_quality("pm2","Amsterdam")
    chartdata()
}
document.getElementsByClassName("country_name")[2].onclick = function() {
    document.getElementById("cityName").innerHTML = this.innerHTML
    current_id = city_ids[2]
    air_quality("pm2","Moscow")
    $('body').css("background-image","url('bg2.jpg')")
    chartdata()
}
document.getElementsByClassName("country_name")[3].onclick = function() {
    document.getElementById("cityName").innerHTML = this.innerHTML
    current_id = city_ids[3]
    air_quality("pm2","Paris")
    $('body').css("background-image","url('bg2.jpg')")
    chartdata()
}
document.getElementsByClassName("country_name")[4].onclick = function() {
    document.getElementById("cityName").innerHTML = this.innerHTML
    current_id = city_ids[4]
    air_quality("pm2","Los Angeles")
    $('body').css("background-image","url('bg2.jpg')")
    chartdata()
};
//szansa opadów
$('#rain2').click(function(){
    temp_button2 = 0;
    rain_button2 = 1;
    chartdata();
});
$('#temperature2').click(function(){
    temp_button2 = 1;
    rain_button2 = 0;
    chartdata();
});
$('#rain1').click(function(){
    temp_button1 = 0;
    rain_button1 = 1;
    chartdatakrakow();
});
$('#temperature1').click(function(){
    temp_button1 = 1;
    rain_button1 = 0;
    chartdatakrakow();
});
chartdata();
chartdatakrakow();


function  chartdatakrakow() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://api.openweathermap.org/data/2.5/forecast?id=3094802&APPID=ee59d5f4d3351c1d1b4ebb8aa325c0efc");
    xhr.onreadystatechange = function(){
        var date = [];
        var hours = [];
        var temp = [];
        var icon_id = [];
        var rain = [];

        data(this,date,hours,temp,icon_id,rain);
        if(temp_button1==1 && rain_button1==0){chart1temp(hours,temp);}else{chart1rain(hours,rain)};
        document.getElementById("weather_icon1").src = "http://openweathermap.org/img/wn/"+icon_id[0]+"@2x.png"

    };
    xhr.send(null);
};

function  chartdata() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://api.openweathermap.org/data/2.5/forecast?id="+current_id+"&APPID=531f22778d8dec93c4f283113edb022c");
    xhr.onreadystatechange = function(){
        var date = [];
        var hours = [];
        var temp = [];
        var icon_id = [];
        var rain = [];
        data(this,date,hours,temp,icon_id,rain);
        if(temp_button2==1 && rain_button2==0){chart2temp(hours,temp);}else{chart2rain(hours,rain)};
        document.getElementById("weather_icon").src = "http://openweathermap.org/img/wn/"+icon_id[0]+"@2x.png"
        document.getElementsByClassName('day')[0].innerText = date[0] + ', ' + hours[0];
        document.getElementsByClassName('day')[1].innerText = date[0] + ', ' + hours[0];
    };
    xhr.send(null);
};


function data(x,d,h,t,ic,r){            
    //konwersja tekstu Json na obiekty javaScript
    responseObject = JSON.parse(x.responseText);
    var lista = responseObject.list;
    //pobieranie danych potrzebnych do wykresu
    for(var i=0;i<9;i++){
        d.push(/\d\d\d\d-\d\d-\d\d/.exec(lista[i].dt_txt)[0]);
        h.push(/\d\d:\d\d/.exec(lista[i].dt_txt)[0]); 
        t.push((lista[i].main.temp-273.15).toFixed(2));
        ic.push(lista[i].weather[0].icon);
        if(lista[i].rain != undefined){
            r.push(lista[i].rain["3h"]);
        }else if(lista[i].snow != undefined){
            r.push(lista[i].snow["3h"]);
        }else{
            r.push(0);
        };
        
    };
};
        

        
//  wykres temperatura
function chart2temp(h,t){
    $("canvas#myChart2").remove();
    $("div.chart2").append('<canvas id="myChart2" height="inherit" width="inherit"></canvas>');
    var ctx2 = document.getElementById("myChart2").getContext('2d');
    var LineChart2 = new Chart(ctx2, {
        type: 'line',
        data:{
            labels: h,
            datasets: [{
                label: 'Temperatura',
                data: t,
                backgroundColor: 'rgba(255,255,0, 0.1)',
                borderColor: 'rgb(255, 204, 0)',
                borderWidth: 1,
                
            }]
        },
        
    });
};
//  wykres opady 
function chart2rain(h,r){
    $("canvas#myChart2").remove();
    $("div.chart2").append('<canvas id="myChart2" height="inherit" width="inherit"></canvas>');
    var ctx2 = document.getElementById("myChart2").getContext('2d');
    var LineChart2 = new Chart(ctx2, {
        type: 'bar',
        data:{
            labels: h,
            datasets: [{
                label: 'Opady',
                data: r,
                backgroundColor: 'rgba(191, 220, 231)',
                borderColor: 'rgb(59, 80, 121)',
                borderWidth: 1,
                
            }]
        },
        
    });
};


//Jakość powietrza

function  air_quality(id,miasto) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.waqi.info/feed/"+miasto+"/?token=69fefa412d572ac2e6eb2cc34b7baf0134c1f809");
    xhr.onreadystatechange = function(){
        var air = JSON.parse(this.responseText)
        var pm = air.data.iaqi.pm10.v
        if (pm>200){
            document.getElementById(id).innerText = "Bardzo zły"
            document.getElementById(id).style.backgroundColor = "#990000"
        }
        if (pm<200){
            document.getElementById(id).innerText = "Zły"
            document.getElementById(id).style.backgroundColor = "#E40000"
        }
        if (pm<141){
            document.getElementById(id).innerText = "Dostateczny"
            document.getElementById(id).style.backgroundColor = "#E48100"
        }
        if (pm<101){
            document.getElementById(id).innerText = "Umiarkowany"
            document.getElementById(id).style.backgroundColor = "yellow"
        }
        if (pm<6120){
            document.getElementById(id).innerText = "Dobry"
            document.getElementById(id).style.backgroundColor = "#B0DD10"
        }
        if (pm<21){
            document.getElementById(id).innerText = "Bardzo dobry"
            document.getElementById(id).style.backgroundColor = "#58B109"
        }
    };
    xhr.send(null);
};
air_quality("pm1","krakow")
air_quality("pm2","Sydney")



