import {getDatabase,ref,push,get} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import firebase_app from "./util.js";

tinymce.init({
    selector: '#default',
    plugins:[
        'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 
        'table', 'emoticons', 'template', 'codesample'
    ],
    toolbar: 'undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |' + 
    'bullist numlist outdent indent | link image | media fullscreen | ' +
    'forecolor backcolor emoticons',
    menubar: 'insert format',
    statusbar: false,
    promotion: false,
});

const save_btn = document.getElementById("save-btn");
const chapter_name_field = document.getElementById("chapter-name");
chapter_name_field.oninput = setUpperCase;

save_btn.addEventListener("click",Save);


function setUpperCase(){
    chapter_name_field.value = chapter_name_field.value.toUpperCase();
}

function validateInputs(item){
    if (item["item_name"].length <= 0 || item["item_image"].length <=0){
        return false;
    }
    else{
        if ((item["chapter_name"].length > 0 && item["chapter_content"].length <=0) || (item["chapter_name"].length <= 0 && item["chapter_content"].length >0)){
            return false
        }
        else
        {
            return true   
        }

    }
}

function Save(){
    const item_data = {
        item_name: document.getElementById("item-title").value,
        item_image: document.getElementById("item-image").value,
        chapter_name: document.getElementById("chapter-name").value,
        chapter_content: tinymce.get("default").getContent()
    }
    const database = getDatabase(firebase_app);
    const item_ref = ref(database,"items");
    if (validateInputs(item_data)){
        //save to fb
        const date_update =  new Date().toLocaleDateString();
        const time_update =  new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"});
        const user_uid = localStorage.getItem("currentUser");
        let infos = {};
        if (item_data["chapter_name"].length > 0){
            infos= {[item_data["chapter_name"]]:item_data["chapter_content"]};
        }
        const last_updated = {user_uid:user_uid,time:time_update,date:date_update}
        let item = {name:item_data["item_name"],image:item_data["item_image"],last_updated:last_updated}
        if (infos != {}){
            item["infos"] = infos
        }
        get(item_ref)
        .then((snapshot) =>{
            if (snapshot.exists()){
                let all_items = Object.values(snapshot.val())
                let exist = all_items.some((element) =>{
                    return element["name"].toLowerCase().trim() == item["name"].toLowerCase().trim()
                })
                if (exist){
                    alert(`Item (${item["name"]}) already exisited !`)
                    return
                }
                else{
                    push(item_ref,item);
                    alert("Item Addedd Successfully");
                    window.location.href = "user.html"
                    return
                }
            }

            else{

                push(item_ref,item);
                alert("Item Addedd Successfully")
                window.location.href = "user.html"
                retutn
            }
        })
        .catch((error)=>{

        })
    }
    else{
        alert("please fill all required fields !!!");
        return
    }

}


    

