window.onload = function () {
	document.getElementById("loading_wrapper").remove();

	ReactDOM.render(
		<MyQuestsWrapper />,
		document.getElementById("root")
	);
	
	document.getElementById("scroll_top_btn").addEventListener("click", function () {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}, null);
}

window.onscroll = function () {
	document.getElementById("scroll_top_btn").style.display = 
						(document.body.scrollTop < 250) ? "none" : "block";
}