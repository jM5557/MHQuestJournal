//MAIN Component
var MyQuestsWrapper = React.createClass({
	getInitialState : function () {
		if(JSON.parse(localStorage.getItem("mh_quest_journal_react")) === null)
			return { 
				"myQuests" : [[], []], 
				"selectedGame" : quests, 
				"selectedGameList" : 0,
				"doClearSearch": false,
				"currentDisplayedQuests": [],
				"currentFilter": "none"
			};

		var m = JSON.parse(localStorage.getItem("mh_quest_journal_react"));

		for(let i in m[0]){
			m[0][i].specialUniqueID = i;
		}

		for(let i in m[1]){
			m[1][i].specialUniqueID = i;
		}

		return { 
			"myQuests" : m,
			"selectedGame" : quests,
			"selectedGameList" : 0,
			"doClearSearch" : false,
			"currentDisplayedQuests": m[0],
			"currentFilter": "none",
		 };
	},

	saveMyQuestsToLocalStorage : function () {
		localStorage.setItem("mh_quest_journal_react",
			JSON.stringify(this.state.myQuests)
		);
	},

	showAddedAlert : function () {
		var added_alert = document.createElement("div");
		added_alert.innerHTML = "Quest Added!"
		added_alert.className = "quest_added_alert added";

		document.body.appendChild(added_alert);

		setTimeout(function () {
			added_alert.className = "quest_added_alert";
		}, 350)

		setTimeout(function () { 
			//show any `removed` style
			added_alert.className = "quest_added_alert removed";
			
			//remove element from DOM
			setTimeout(function () {
				added_alert.remove();
			}, 650)
		}, 1500);
	},

	getFilteredQuestList : function () {
		let currFilter = this.state.currentFilter;

		return this.state.myQuests[this.state.selectedGameList].filter(function (q) {
			if(currFilter == "none")
				//gets ALL the quests without filtering
				return parseInt(q.stars) >= 0;

			//gets quests with a star difficulty matching the current filter value
			return q.stars == currFilter;
		});

	},

	filterQuestList : function (filter) {
		this.setState({
			sortType:'none'
		});

		if(filter == "none")
		{
			this.setState({
				currentDisplayedQuests: this.state.myQuests[this.state.selectedGameList],
				currentFilter: filter
			});

			return;
		}

		let t = this.state.myQuests[this.state.selectedGameList].filter(function (q) {
			return q.stars == filter;
		});

		this.setState({
			currentDisplayedQuests : t,
			currentFilter: filter
		});
	},

	sortQuestListBy : function (typeOfSort) {
		let t = this.state.currentDisplayedQuests.slice();

		if(typeOfSort == "none")
		{
			this.setState({
				currentDisplayedQuests : this.getFilteredQuestList(),
				sortType : typeOfSort
			});
			return;
		}

		for(let i in t)
			t[i].pos = i;

		t = t.sort(function (a, b) {
			if(typeOfSort == "stars")
			{
				if(parseInt(a.stars) == parseInt(b.stars))
					return a.pos - b.pos;

				return parseInt(a.stars) - parseInt(b.stars);
			}

			else if(typeOfSort == "questIsClear")
			{
				if(a.questClear === b.questClear)
					return a.pos - b.pos;

				return (a.questClear) ? -1 : 1;
			}
		});

		this.setState({
			currentDisplayedQuests: t,
			sortType: typeOfSort
		});

		return t;
	},

	handleChangeGame : function (game_quests_arr, pos) {
		this.setState({
			//clears searchbar and result list
			doClearSearch: true,
			clearSearch : true,

			//sets the list the user is going to be adding/removing from
			selectedGameList : pos,

			//sets the game whose quests the user can pick from
			selectedGame : game_quests_arr,
		}, function () {
			this.setState({
				//sets to no sorting and sets the current displayed list of quests in 
				//your journal log
				sortType: 'none',
				currentDisplayedQuests: this.getFilteredQuestList()
			});
		});
	},

	handleUpdateUserQuests : function (o) {
		let obj = JSON.parse(JSON.stringify(o));
		obj.specialUniqueID = this.state.myQuests[this.state.selectedGameList].length;
		console.log(obj.specialUniqueID);

		let t = this.state.myQuests.slice();
		console.log(t);
		t[this.state.selectedGameList].push(obj);

		let t_filtered = this.getFilteredQuestList();

		this.setState({ 
			myQuests : t,
			currentDisplayedQuests : t_filtered,
			sortType:'none'
		});

		this.showAddedAlert();
	},

	handleQuestClearClick : function (obj) {
		let t = this.state.myQuests.slice();
		
		let getObj = t[this.state.selectedGameList].filter(function (val) {
			return val.specialUniqueID == obj.specialUniqueID;
		})[0];

		let pos = t[this.state.selectedGameList].indexOf(getObj);

		if(pos == -1)
			return;

		if(!t[this.state.selectedGameList][pos].questClear)
			t[this.state.selectedGameList][pos].questClear = true;
		else
			t[this.state.selectedGameList][pos].questClear = false;

		let t_filtered = this.getFilteredQuestList();

		this.setState({ 
			myQuests : t, 
			currentDisplayedQuests : t_filtered,
			sortType : 'none'
		});
	},

	handleDeleteClick : function (obj) {

		let t = this.state.myQuests.slice();
		let pos = t[this.state.selectedGameList].indexOf(obj);

		t[this.state.selectedGameList].splice(pos, 1);
		
		let t_filtered = this.getFilteredQuestList();

		this.setState({ 
			myQuests : t, 
			currentDisplayedQuests : t_filtered, 
			sortType:'none'
		});
	},

	handleClearAll : function () {
		let t = this.state.myQuests.slice();

		let currFilter = this.state.currentFilter;
		if(currFilter == "none")
		{
			//clears the whole list
			t[this.state.selectedGameList] = [];
		}
		else 
		{
			//excludes, from the whole list, the quests with the star-difficulty matching
			//the current selected filter. This clears all the quests of the selected star difficulty
			t[this.state.selectedGameList] = t[this.state.selectedGameList].filter( function (q) {
				return q.stars != currFilter;
			});
		}

		this.setState({ 
			myQuests : t,
			currentDisplayedQuests: [],
			sortType:'none'
		});
	},

	render : function () {
		this.saveMyQuestsToLocalStorage();

		if(typeof this.state.sortType === 'undefined')
			this.setState({ sortType:'none' });

		const myQuestsList = this.state.currentDisplayedQuests.map(function (quest) {
			
			return (<li key = { quest.specialUniqueID } onClick = { this.handleQuestClearClick.bind(this, quest) } className = { (quest.questClear) ? 'questClear' : null }>
				<p className = "name">{ quest.name }</p>
				{ quest.target } | { quest.stars } &#9734;
				<button onClick = { this.handleDeleteClick.bind(this, quest) }>
					×
				</button>
			</li>);
		}, this);

		let elArr = [];

		//Generates clickable buttons for the selected game's star level filters
		let makeStarSelects = function (_t) {
			let arr = ["1"];
			let minStars = 1;

			let t = _t.state.selectedGame.quests;

			for(var i = 0; i < t.length; i++){
				if(minStars < parseInt(t[i].stars)){
					arr.push(t[i].stars);
					minStars++;
				}
			}

			for(var i = 0; i < arr.length; i++){
				elArr.push(<button className = {_t.state.currentFilter == arr[i] ? 'selected' : null} onClick = {_t.filterQuestList.bind(this, arr[i])}>{arr[i]}</button>);
			}
		}

		makeStarSelects(this);

		return (
		<div id = "main_wrapper">
			<SidebarComponent doClearSearch = { this.state.doClearSearch } quests = { this.state.selectedGame } handleUpdate = {this.handleUpdateUserQuests}/>
			<section id = "user_content_wrapper">
				<h1>My Quest Journal</h1>
				<div id = "game_select_wrapper">
					<button className = {this.state.selectedGameList == 0 ? 'selected' : null} onClick = { this.handleChangeGame.bind(this, quests, 0) }>Monster Hunter Generations</button>
					<button className = {this.state.selectedGameList == 1 ? 'selected' : null} onClick = {this.handleChangeGame.bind(this, quests_mh4u, 1) }>Monster Hunter 4 Ultimate</button>
				</div>
				<div id = "filter_select_wrapper">
					<h3>Select Star Difficulty</h3>
					<button className = {this.state.currentFilter == "none" ? 'selected' : null} onClick = {this.filterQuestList.bind(this, "none")}>All Quests</button>
					<button className = {this.state.currentFilter == "0" ? 'selected' : null} onClick = {this.filterQuestList.bind(this, "0")}>Training</button>
					{elArr}
					<br/>
					<h3>Sort By</h3>
					{this.state.currentFilter == "none"
						&& <button className = {this.state.sortType == "stars" ? 'selected' : null} onClick = { this.sortQuestListBy.bind(this, "stars")}>Star Difficulty</button>
					}
					<button className = {this.state.sortType == "questIsClear" ? 'selected' : null} onClick = { this.sortQuestListBy.bind(this, "questIsClear")}>Quest Cleared</button>
					<button className = {this.state.sortType == "none" ? 'selected' : null} onClick = { this.sortQuestListBy.bind(this, "none")}>No Sort</button>
				</div>

				{this.state.currentFilter != "none" && <h2>{this.state.currentFilter} Star Quests</h2>}
				{myQuestsList.length <= 0 ? 
					(<div className = "error_message">(0) Quests In Journal Log</div>)
					: (<ul id = "my_game_list" className = "item_list">{ myQuestsList }</ul>)
				}

				{myQuestsList.length > 0 &&
					<button id = "clear_all_button" onClick = { this.handleClearAll }>
						Clear All
					</button>
				}
			</section>
		</div>);
	}
});