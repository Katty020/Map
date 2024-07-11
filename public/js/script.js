const socket=io();
console.log("hey");


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude}=position.coords;
        socket.emit("send-location",{latitude, longitude});
    },(error)=>{
        console.log(error);
    },{
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:5000,
    });
}

const map= L.map("map").setView([0,0],18);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);

const markers={};
socket.on("received-location",(data)=>{
    const{id,latitude,longitude}=data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude],90); 
     }else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
     }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});