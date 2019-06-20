/*
Cat images supplied by TheCatApi: https://docs.thecatapi.com/
*/
let gallery = document.getElementById("gallery");
let tooltip = document.getElementById("tooltip");
let fetchBtn = document.getElementById("fetchBtn");
let bigImageClose = document.querySelector(".bigImage-close");
let closeBox = document.querySelector(".closeBox");

let catPics = [];

let disableRefresh = function(){
	document.getElementById("fetchBtn").classList.add("disabled");
	setTimeout(function(){
		document.getElementById("fetchBtn").classList.remove("disabled");
	}, 10000);
};

let fetchCats = function(){
	return new Promise(function(resolve, reject){
		const api = "https://api.thecatapi.com/v1/images/search?size=full&limit=30&mime_types=jpg";
		let xhr = new XMLHttpRequest();
		xhr.open("GET", api);
		xhr.onreadystatechange = function(){
			if (xhr.status === 200 && xhr.readyState === 4){
				document.querySelector(".loading").classList.add("hide");
				let res = JSON.parse(xhr.response);
				let cats = res.reduce(function(acc, cur){
					return [...acc, cur.url];
				}, []);
				catPics = [...cats];
				resolve(cats);
			}
			if (xhr.status !== 200 && xhr.readyState === 4){
				reject(xhr);
			}
		};
		xhr.send();
	}).then(function(pics){
		//Clear pics.
		document.getElementById("gallery").innerHTML = "";
		//Add new pics.
		for (let i=0; i < pics.length; i++){
			let img = document.createElement("img");
			img.setAttribute("src", pics[i]);
			document.getElementById("gallery").append(img);
		}
		//Re-enable fetch button
		disableRefresh();
	}).catch(function(e){
		console.log(e);
		document.querySelector(".spinner").classList.add("hide");
		document.querySelector(".loadMsg").innerText = "Failed to get data. Please try again later.";
		document.querySelector(".loadMsg").style.color = "red";
		//Disable refresh for 10 seconds.
		disableRefresh();
	});

};
//Initial fetch
fetchCats();

//Tooltip hover
gallery.addEventListener("mouseover", function(e){
	if (e.target === e.currentTarget) return;
	let tooltip = document.getElementById("tooltip");
	tooltip.setAttribute("src", e.target.src);
	tooltip.classList.remove("hide");
	let imgRect = e.target.getBoundingClientRect();
	tooltip.style.top = (imgRect.y - (imgRect.height*0.1)) + "px";
	tooltip.style.left = (imgRect.x - (imgRect.width*0.1)) + "px";
	tooltip.style.width = imgRect.width + (imgRect.width*0.2) + "px";
});

tooltip.addEventListener("mouseout", function(e){
	tooltip.classList.add("hide");
});

//Toggle the tooltip on scroll.
let scrollThrottle = true;
window.addEventListener("scroll", function(){
	if (scrollThrottle){
		scrollThrottle = false;
		setTimeout(function(){
			document.getElementById("tooltip").classList.add("hide");
			scrollThrottle = true;
		}, 500);
	}
});

//Open popup by image click (if tooltip is disabled).
gallery.addEventListener("click", function(e){
	if (e.target === e.currentTarget) return;
	document.querySelector(".bigImage-pic").src = e.target.src;
	document.getElementById("popup").classList.remove("hide");
});

//Open popup by tooltip click.
tooltip.addEventListener("click", function(e){
	document.querySelector(".bigImage-pic").src = e.target.src;
	document.getElementById("popup").classList.remove("hide");
});

//Close popup cat picture.
bigImageClose.addEventListener("click", function(){
	document.getElementById("popup").classList.add("hide");
});

//Close popup cat picture (close box).
closeBox.addEventListener("click", function(){
	document.getElementById("popup").classList.add("hide");
});

//Refresh request (10s delay).
let refreshThrottle = true;
fetchBtn.addEventListener("click", function(){
	disableRefresh();
	if (refreshThrottle){
		refreshThrottle = false;
		fetchCats();
		setTimeout(function(){
			refreshThrottle = true;
		}, 10000);
	}
});