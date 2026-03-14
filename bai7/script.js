const $ = id => document.getElementById(id);

const searchInput = $("searchInput");
const btnSearch = $("btnSearch");
const userList=$("userList");
const messageEl =$("message");
const countEl =$("count");

const modal=$("modal");
const modalBody =$("modalBody");
const closeModal =$("closeModal");

let users = [];


/* Fetch user */

const fetchUsers = async () =>{
    if(users.length) return users;
    try{
        const res = await fetch("https://jsonplaceholder.typicode.com/users")
        if(!res.ok) throw new Error("Loi Ket Noi Mang");
        users =await res.json();
        return users;
    } catch(err)
    {
        messageEl.textContent="Khong the tai du lieu sever";
        return [];
    }
};

/* Hien thi ra man hinh */
const renderUsers = list =>{

    userList.innerHTML="";
    countEl.textContent=list.length ? `${list.length} Ket qua`:"";
    messageEl.textContent=list.length ? "": "Không Tìm Thấy User";
    list.forEach(user => {
       const {name, email, address}=user;

       const initals = name
       .split(" ")
       .filter(Boolean)
       .map(n=> n[0])
       .join("");

       const card =document.createElement("div");
       card.className= "user-card";

       card.innerHTML= `
       <div class="avatar">${initals}</div>

      <div class="info">
        <div><b>${name}</b></div>

        <div class="meta">
          <i class="fa-solid fa-envelope"></i> ${email}
        </div>

        <div class="meta">
          <i class="fa-solid fa-city"></i> ${address.city}
        </div>
      </div>

      <button class="details-btn">Chi tiết</button>
       `
       const detailsBtn =card.querySelector(".details-btn");

       detailsBtn.addEventListener("click",()=> showUserDetail(user));
       userList.appendChild(card);
    });
};

/* Modal */
const showUserDetail = user =>{
    const{ name,username, email,phone ,website,address,company}=user;

    modal.style.display="flex";
    modalBody.innerHTML=`
        <h2>${name}</h2>

        <p><i class="fa-solid fa-user"></i> Username: ${username}</p>
        <p><i class="fa-solid fa-envelope"></i> Email: ${email}</p>
        <p><i class="fa-solid fa-phone"></i> Phone: ${phone}</p>
        <p><i class="fa-solid fa-globe"></i> Website: ${website}</p>
        <p>
            <i class="fa-solid fa-location-dot"></i>
            Address: ${address.street}, ${address.suite},
            ${address.city}, ${address.zipcode}
        </p>

        <p>
            <i class="fa-solid fa-building"></i>
            Company: ${company.name}
        </p>
  `;
};

/* Tim kiem */
const search =async() =>{

    const query =searchInput.value.trim().toLowerCase();

    if(!query){
        messageEl.textContent="Nhập Tên Để Tìm";
        userList.innerHTML="";
        countEl.textContent="";

        searchInput.focus();
        return;
    }
    const data= await fetchUsers();
    const result=data.filter( user=> 
        user.name.toLowerCase().includes(query)
    );
    renderUsers(result);
};

/* modal close*/
const closeModalFunc =() =>{
    modal.style.display="none";
};
closeModal.addEventListener("click",closeModalFunc);
window.addEventListener("click",e => {
    if(e.target ===modal) closeModalFunc();

});
document.addEventListener("keydown", e=>{
    if(e.key ==="Escape") closeModalFunc();
    
})

/*Event */
btnSearch.addEventListener("click",search);
searchInput.addEventListener("keydown",e=>{
    if(e.key === "Enter") search();
});