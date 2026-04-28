const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";


document.querySelectorAll(".scramble").forEach(link=>{
let interval=null;

link.addEventListener("mouseover",()=>{
let iteration=0;
const original=link.dataset.text;

clearInterval(interval);

interval=setInterval(()=>{
link.innerText=original.split("").map((letter,index)=>{
if(index<iteration)return original[index];
return letters[Math.floor(Math.random()*letters.length)];
}).join("");

iteration+=1/3;

if(iteration>=original.length)clearInterval(interval);
},30);
});
});


const logo=document.getElementById("logo");

window.addEventListener("scroll",()=>{
if(!logo) return;

const scrollY=window.scrollY;

const moveUp=Math.min(scrollY,300);
const scale=1-(scrollY/600);

logo.style.transform=`
translate(-50%, calc(-50% - ${moveUp}px))
scale(${Math.max(scale,0.4)})
`;
});


let allData=[];

fetch("data.json")
.then(res=>res.json())
.then(data=>{
allData=data;
displayData(data);
})
.catch(()=>{
const container=document.getElementById("dataContainer");
if(container){
container.innerHTML="<p style='color:red'>Failed to load data</p>";
}
});


function displayData(data){
const container=document.getElementById("dataContainer");
if(!container) return;

container.innerHTML="";

data.forEach(item=>{
container.innerHTML+=`
<div class="card">
<h3>${item.website}</h3>
<p>${item.year}</p>
<p>${item.data}</p>
</div>
`;
});
}


function searchData(){
const input=document.getElementById("search").value.toLowerCase();

const filtered=allData.filter(item=>
item.website.toLowerCase().includes(input)
);

displayData(filtered);
}