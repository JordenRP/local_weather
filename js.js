var api = "https://fcc-weather-api.glitch.me/api/current?";
var lat, lon;
var currentUnit = 'c';

var layout = {
  sunny: '<div class="sun"><img src="http://i91.fastpic.ru/big/2017/0921/9e/5c271b23b27e5796e3d0bbff7daeb49e.png" alt=""></div><div class="pos_sun"><p class="temperature"><span id="temp"></span><span id="tempUnit"></span></p></div><div class="wrapp"><div class="rays"><img src="http://i89.fastpic.ru/big/2017/0921/38/e4c2fbfa08051047fe0e62acea7e2938.png" alt=""></div></div>',
  cloud: '<div><img src="http://i89.fastpic.ru/big/2017/0920/dc/6adf9f27d8ac660d69ca905aea6aa7dc.png" alt=""></div><div class="pos"><p class="temperature"><span id="temp"></span><span id="tempUnit"></span></p></div>',
  rain: '<div class="cloud"><img src="http://i89.fastpic.ru/big/2017/0920/dc/6adf9f27d8ac660d69ca905aea6aa7dc.png" alt=""></div><div class="back back_rain pos"><p class="temperature"><span id="temp"></span><span id="tempUnit"></span></p></div><div class="pos forward_rain forward"></div>',
  snow: '<div class="cloud"><img src="http://i89.fastpic.ru/big/2017/0920/dc/6adf9f27d8ac660d69ca905aea6aa7dc.png" alt=""></div><div class="back_snow pos back"><p class="temperature"><span id="temp"></span><span id="tempUnit"></span></p></div><div class="pos forward forward_snow"></div>',
  drizzle: '<div class="cloud"><img src="http://i89.fastpic.ru/big/2017/0920/dc/6adf9f27d8ac660d69ca905aea6aa7dc.png" alt=""></div><div class="pos back_driz back"><p class="temperature"><span id="temp"></span><span id="tempUnit"></span></p></div><div class="pos forward_driz forward"></div>',
  thunderstorm: '<div class="cloud"><img src="http://i89.fastpic.ru/big/2017/0920/dc/6adf9f27d8ac660d69ca905aea6aa7dc.png" alt=""></div><div class="back_thunder pos back"><p class="temperature"><span id="temp"></span><span id="tempUnit"></span></p></div><div class="pos forward_thunder forward"></div><div class="fix"><canvas id="canvas" width="40" height="170" class="keep"></canvas></div>"'

}



function findLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = "lat=" + position.coords.latitude;
      var lon = "lon=" + position.coords.longitude;
      getObj(lat, lon);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  };
}
 findLocation();
  
 function getObj(lat, lon) {
   var urlString = api + lat + '&'+ lon;
   var xhr = new XMLHttpRequest ();
   xhr.open('GET', urlString);
   xhr.onload = function(evt) {
     var rawData = evt.target.response;
     loaderObj = JSON.parse(rawData);
     
     getMarkup(loaderObj);
     getWeather(loaderObj);
     canvas();
     }
   
   xhr.send();
 };
  
 function getWeather (Obj) {
   var info = document.querySelectorAll('td > span');
   var speed = info[0];
   var direction = info[1];
   var humidity = info[2];
   var pressure = info[3];
   var cloud = info[4];
   
   var weather = Obj.weather[0];
   
   
   var city = document.getElementById('city');
   var country = document.getElementById('country');
   
   var temp = document.getElementById('temp');
   
   var main_w = document.getElementById('main');
   
   var tempUnit = document.getElementById('tempUnit')
   
   var dir = Obj.wind.deg;
   
   function getDirection (dir) {
    if(dir<= 22.5){
      return dir = 'NNE';
    }else if(dir>22.5||dir<=45){
      return dir = 'NE';
    }else if(dir>45||dir<=67.5){
      return dir = 'ENE'
    }else if(dir>67.5||dir<=90){
      return dir = 'E';
    }else if(dir>90||dir<=112.5){
      return dir = 'ESE';
    }else if(dir>112.5||dir<=135){
      return dir = 'SE';
    }else if(dir>135||dir<=157.5){
      return dir = 'SSE';
    }else if(dir>157.5||dir<=180){
      return dir = 's';
    }else if(dir>180||dir<=202.5){
      return dir = 'SSW';
    }else if(dir>202.5||dir<=225){
      return dir = 'SW';
    }else if(dir>225||dir<=247.5){
      return dir = 'WSW';
    }else if(dir>247.5||dir<=270){
      return dir = 'W';
    }else if(dir>270||dir<=292.5){
      return dir = 'WNW';
    }else if(dir>292.5||dir<=315){
      return dir = 'NW';
    }else if(dir>315||dir<=337.5){
      return dir = 'NNW';
    }else{
      return dir = 'N';
    }
   }
   
   city.innerHTML = Obj.name;
   country.innerHTML = Obj.sys.country;

   temp.innerHTML = Obj.main.temp+String.fromCharCode(176);

   
   tempUnit.innerHTML = currentUnit;
   
   tempUnit.addEventListener('click', function(){
     if(currentUnit == 'c'){
       currentUnit = 'f'
       tempUnit.innerHTML = currentUnit;
       temp.innerHTML = Math.round(Obj.main.temp*9/5+32)+String.fromCharCode(176);
     }else if(currentUnit == 'f'){
       currentUnit = 'c';
       tempUnit.innerHTML = currentUnit;
       temp.innerHTML = Obj.main.temp+String.fromCharCode(176);
     }
   });
   
   
   speed.innerHTML = Obj.wind.speed;
   humidity.innerHTML = Obj.main.humidity;
   pressure.innerHTML = Obj.main.pressure;
   cloud.innerHTML = Obj.clouds.all;
   direction.innerHTML =  getDirection(dir);
   
    main_w.innerHTML = weather.main;
 };

 function getMarkup(mark) {
   var loader = document.getElementById('loader');
   var check = mark.weather[0].main; 
   var clouds = mark.clouds.all;
   var background = document.getElementById('background');
   if (clouds>40){
     background.classList.add('back_cloud');
   }else {
     background.classList.add('back_clear');
   }
   
   switch (check) {
      case 'Clear':
        loader.innerHTML = layout.sunny;
      break;
      case 'Rain':
        loader.innerHTML = layout.rain;
      break;
      case 'Snow':
        loader.innerHTML = layout.snow;
      break;
      case 'Clouds':
        loader.innerHTML = layout.cloud;
      break;
      case 'Thunderstorm':
        loader.innerHTML = layout.thunderstorm;
      break;
      case 'Drizzle':
        loader.innerHTML = layout.drizzle;
      break;
   }
   
 }



function canvas (){
var canvas = document.getElementById("canvas"),
		  ctx = canvas.getContext('2d');
			canvas.height = 170;
			canvas.width  = 40;
      
      ctx.lineWidth = '3';
      ctx.strokeStyle = '#f9ed04';
      
      function run(){
      var opts = {
        x: 40,
        y: 50,
      }
      function clear(){
        ctx.clearRect(0, 0, 40, 170);       
      };
      
     var id = setInterval(step, 150);
     var count = 0;
     function step(){
        count++;
        ctx.beginPath();
        ctx.moveTo(opts.x, opts.y);
        if(opts.x == 40) {
          opts.x = 10;
        }else{
         opts.x = 40;
        }
         opts.y += 40;
        ctx.lineTo(opts.x, opts.y);
        ctx.stroke(); 
        if(count==3){
          clearInterval(id);
          setTimeout(clear, 150);
        }
      };  
      };
      run();
      setInterval(run, 2000)
}