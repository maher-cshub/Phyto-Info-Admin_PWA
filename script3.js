
import firebase_app from "./util.js"
import {getDatabase , ref ,onValue,onChildAdded,onChildRemoved} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { initVars } from "./script4.js";


const database = getDatabase(firebase_app);

const results_area = document.getElementById("results-area");
const add_btn = document.getElementById("add-btn");
document.addEventListener("DOMContentLoaded",refreshData);
add_btn.addEventListener("click",addItem);


function addItem(){
    window.location.href = "add.html";
}
function saveElement(element){
    const item = document.createElement("div")
    item.setAttribute("id","item");
    item.setAttribute("item_id",element[0]);
    item.innerHTML = `
        <div id="item-image">
            <img src=${element[1]["image"]} alt=${element[1]["name"]}>
        </div>
        <div id="item-details">
            <h1 id="item-title">${element[1]["name"]}</h1>
            <button class="info-btn-cls" id="item-info-btn">GET INFO</button>
            <button class="update-btn-cls" id="item-update-btn">UPDATE</buton>
            <button class="delete-btn-cls" id="item-delete-btn">DELETE</buton>

        </div>
    `
    
    results_area.appendChild(item);
    return
}

async function getAllItems(){
    try {  
        const items_ref = ref(database,"items");
        await onValue(items_ref,function(snapshot){
            if (snapshot.exists()){
                let items = Object.entries(snapshot.val())
                localStorage.setItem("items",JSON.stringify(items))
                
            }
            else{
                localStorage.setItem("items",JSON.stringify([]))
            }

        });
    } catch (error) {
        alert("please check your internet connection")
    }
}


async function refreshData(){
    
    await getAllItems(); 

    results_area.innerHTML = "";

    let items = JSON.parse(localStorage.getItem("items"))
    
    items.forEach(saveElement)

    initVars()

    return
}


onChildAdded(ref(database,"items"),(snapshot,key)=>{
    refreshData()

        })


//--------------------item removed (done)
onChildRemoved(ref(database,"items"),(snapshot)=>{
    const deleted_item = document.querySelector(`[item_id="${snapshot.key}"]`);
    deleted_item.remove();
    let items = JSON.parse(localStorage.getItem("items"));
    items = items.filter(item => !(item[0] == snapshot.key));
    localStorage.setItem("items",items);
})


setInterval(()=>{
    localStorage.removeItem("items");
    refreshData()
},60000)

