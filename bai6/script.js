const buttons = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach(button =>{
    button.addEventListener("click",()=>{

        const isActive = button.classList.contains("active");

        buttons.forEach(btn => btn.classList.remove("active"));
        contents.forEach(content => content.classList.remove("active"));

        if(!isActive){
            button.classList.add("active");

            const tabNumber = button.getAttribute("data-tab");
            const activeContent = document.getElementById("tab-"+tabNumber);
            
            activeContent.classList.add("active");
        }
    });
});

//red-more-btn
const readMoreButtons = document.querySelectorAll(".read-more-btn");

readMoreButtons.forEach(button =>{
    button.addEventListener("click",() =>{
        const paragraph = button.previousElementSibling;
        paragraph.classList.toggle("collapsed");

        if(paragraph.classList.contains("collapsed")){
            button.textContent= "Xem thêm";

        }else{
            button.textContent="Thu gọn";
        }
    });
});