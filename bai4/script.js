const openBtn=document.getElementById("openBtn");
const closeBtn= document.getElementById("closeBtn");
const modal=document.getElementById("modal");
const overlay=document.getElementById("overlay");

//openmodal
openBtn.addEventListener("click", function()
{
    modal.classList.add("active");
    overlay.classList.add("active");
});

//closemoda
closeBtn.addEventListener("click", function()
{
    modal.classList.remove("active");
    overlay.classList.remove("active");
});

//close modal overlay 
overlay.addEventListener("click",function(){
    modal.classList.remove("active");
    overlay.classList.remove("active");

    
});

document.addEventListener("keydown", function(event)
{
    modal.classList.remove("active");
    overlay.classList.remove("active");
});