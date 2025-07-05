let taxInfo = document.querySelector("#switchCheckReverse");
let optionBtn = document.querySelector(".option-btn");
let filters = document.querySelectorAll(".filter");
let taxBtn = document.querySelector(".tax-btn");

taxInfo.addEventListener("click",()=>{
let taxTag = document.querySelectorAll(".tax-info");
 for(let tax of taxTag){
if(tax.style.display === "inline"){
       tax.style.display = "none";
}else{
       tax.style.display = "inline";
     }
 }
})

//taxBtn

taxBtn.addEventListener("click",()=>{
let taxTag = document.querySelectorAll(".tax-info");
 for(let tax of taxTag){
if(tax.style.display === "inline"){
       tax.style.display = "none";
}else{
       tax.style.display = "inline";
     }
 }
})

optionBtn.addEventListener("click",()=>{
    for(let filter of filters){
        if(filter.style.display !== "none"){
            console.log("clicked!");
            filter.style.display = "none";           
        }else{
            filter.style.display = "flex";
            filter.style.flexDirection = "column";
            filter.style.flexWrap = "wrap";
        }
    }
})