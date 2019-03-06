//List of different quest data arrays being used 
var quest_lists = [
	quests_mhgen,
	quests_mh4u,
	quests_MHGU
];

//MAIN Component
var MyQuestsWrapper = React.createClass({
	getInitialState : function () {
		if(JSON.parse(localStorage.getItem("mh_quest_journal_react")) === null )
			return { 
				"myQuests" : quest_lists.map(() => { return [] } ), 
				"selectedGame" : quest_lists[quest_lists.length - 1], 
				"selectedGameList" : quest_lists.length - 1,
				"doClearSearch": false,
				"currentDisplayedQuests": [],
				"currentFilter": "none",
				"displayFilterOptions": false,
				"updatedLocalStorage": true,
				"displaySidebar": false
			};

		// Gets stored quest list if they exist
		var m = JSON.parse(localStorage.getItem("mh_quest_journal_react"));

		for (let i = 0; i < quest_lists.length; i++) {

			for (let j in m[i]) {

				m[i][j].specialUniqueID = j;

			}

		}

		// Make a new array if the user doesn't have one
		// for the latest game added to the `quest_lists` 
		if (typeof m[quest_lists.length - 1] === "undefined") {
			m.push(new Array());
		}

		return { 
			"myQuests" : m,
			"selectedGame" : quest_lists[quest_lists.length - 1],
			"selectedGameList" : quest_lists.length - 1,
			"doClearSearch" : false,
			"currentDisplayedQuests": m[quest_lists.length - 1],
			"currentFilter": "none",
			"displayFilterOptions": false,
			"updatedLocalStorage": false,
			"displaySidebar": false
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
			//remove element from DOM
			added_alert.remove();
		}, 2000);
	},

	toggleFilterOptions : function () {
		this.setState({
			displayFilterOptions: !this.state.displayFilterOptions
		});
	},

	getFilteredQuestList : function () {
		let currFilter = this.state.currentFilter;

		let t =  this.state.myQuests[this.state.selectedGameList].filter(function (q) {
			if(currFilter == "none")
				//gets ALL the quests without filtering
				return parseInt(q.stars) >= 0;

			//gets quests with a star difficulty matching the current filter value
			return q.stars == currFilter;
		});

		this.setState({
			currentDisplayedQuests: t
		});

		return t;
	},

	filterQuestList : function (filter) {
		this.setState({
			sortType: 'none'
		});

		if(filter == "none")
		{
			let t = this.setState({
				currentDisplayedQuests: this.state.myQuests[this.state.selectedGameList],
				currentFilter: filter
			});

			return t;
		}

		let t = this.state.myQuests[this.state.selectedGameList].filter(function (q) {
			return q.stars == filter;
		});

		this.setState({
			currentDisplayedQuests : t,
			currentFilter: filter
		});

		return t;
	},

	sortQuestListBy : function (typeOfSort) {
		var t = this.getFilteredQuestList();

		if(typeOfSort == "none")
		{
			this.setState({
				currentDisplayedQuests : this.getFilteredQuestList(),
				sortType : typeOfSort
			});

			return t;
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

			// sets the game whose quests the user can pick from
			selectedGame : game_quests_arr,
		}, function () {
			this.setState({
				// sets to `no sorting` and sets the current displayed list of quests in 
				// your journal log
				sortType: 'none',
				currentDisplayedQuests: this.getFilteredQuestList(),
				doClearSearch: false,
				clearSearch: false
			});
		});
	},

	handleUpdateUserQuests : function (o) {
		let obj = JSON.parse(JSON.stringify(o));
		obj.specialUniqueID = this.state.myQuests[this.state.selectedGameList].length;

		let t = this.state.myQuests.slice();
		t[this.state.selectedGameList].push(obj);

		let t_sort_type = this.state.sortType;

		this.setState({ 
			myQuests : t, 
			currentDisplayedQuests : this.sortQuestListBy(t_sort_type), 
			sortType: t_sort_type
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

		let quest = t[this.state.selectedGameList][pos];

		// Toggles Quest Clear
		quest.questClear = !quest.questClear;

		let t_sort_type = this.state.sortType;

		this.setState({ 
			myQuests : t, 
			currentDisplayedQuests : this.sortQuestListBy(t_sort_type), 
			sortType: t_sort_type
		});
	},

	handleDeleteClick : function (obj) {

		let t = this.state.myQuests.slice();
		let pos = t[this.state.selectedGameList].indexOf(obj);

		t[this.state.selectedGameList].splice(pos, 1);

		let t_sort_type = this.state.sortType;

		this.setState({ 
			myQuests : t, 
			currentDisplayedQuests : this.sortQuestListBy(t_sort_type), 
			sortType: t_sort_type
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

	getClearedQuests: function () {
		return this.state.currentDisplayedQuests.filter((q) => {
			return q.questClear == true;
		});
	},

	getNumOfClearedQuests: function () {

		return this.getClearedQuests().length;

	},

	render : function () {
		this.saveMyQuestsToLocalStorage();

		if(typeof this.state.sortType === 'undefined')
			this.setState({ sortType:'none' });

		const myQuestsList = this.state.currentDisplayedQuests.map(function (quest) {
			
			return (
				<li key = { quest.specialUniqueID } onClick = { this.handleQuestClearClick.bind(this, quest) } className = { (quest.questClear) ? 'questClear' : null }>
					<p className = "name">{ quest.name }</p>

					<span className = "target">{ quest.target }</span>
					<span className = "star-num">{ quest.stars } &#9734;</span>

					{ quest.questClear &&
						<span className = "quest-clear">Quest Clear</span>
					}

					<button onClick = { this.handleDeleteClick.bind(this, quest) }>
						×
					</button>
				</li>
			);
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
			
			{ (this.state.displaySidebar) &&
				<SidebarComponent doClearSearch = { this.state.doClearSearch } quests = { this.state.selectedGame } handleUpdate = {this.handleUpdateUserQuests}/>
			}

			<section id = "main_content" className={ (this.state.displaySidebar) ? 'open_side' : '' }>

				<div id = "games_choice_wrapper">
					<button id = "menu_btn" onClick={ ()=> { this.setState({ displaySidebar: !this.state.displaySidebar }) } }>{ (this.state.displaySidebar) ? " ☰ Hide Menu" : " ☰ Menu" }</button>

				    <button id = "mhgu_choice" className = {this.state.selectedGameList == 2 ? 'selected' : null} onClick = { this.handleChangeGame.bind(this, quest_lists[2], 2) }> MHGU </button>
					<button id = "mhgen_choice" className = {this.state.selectedGameList == 0 ? 'selected' : null} onClick = { this.handleChangeGame.bind(this, quest_lists[0], 0) }> MHGen </button>
					<button id = "mh4u_choice" className = {this.state.selectedGameList == 1 ? 'selected' : null} onClick = {this.handleChangeGame.bind(this, quest_lists[1], 1) }> MH4U </button>
				</div>

				<div id = "app_name_top">
					<h2>{ quest_lists[this.state.selectedGameList].name }</h2>
					
					<h1>
						The Hunter's Journal
						<p id = "tagline"> Plan Your Hunts! </p>
					</h1>
				</div>
				
				<div id = "game_select_wrapper">

						<div id = "filter_options_wrapper">
							<h2>Quests Cleared: {this.getNumOfClearedQuests() + '/' + this.state.currentDisplayedQuests.length} </h2>
							<button id = "toggle_filter_display"
								className = {this.state.displayFilterOptions == true ? 'selected' : ''} 
								onClick = {this.toggleFilterOptions}>
								Filters &#x25BC;
							</button>
						</div>

						<div id = "filter_select_wrapper" className = {this.state.displayFilterOptions == true ? 'display' : 'hide'}>
								<div className = "filter_section">	
									<h3>Select Star Difficulty</h3>
									
									<button className = {this.state.currentFilter == "none" ? 'selected' : null} onClick = {this.filterQuestList.bind(this, "none")}>All Quests</button>
									<button className = {this.state.currentFilter == "0" ? 'selected' : null} onClick = {this.filterQuestList.bind(this, "0")}>Training</button>
									
									{elArr}
								</div>
								
								<div className = "filter_section">
									<h3>Sort By</h3>
									
									{this.state.currentFilter == "none"
										&& <button className = {this.state.sortType == "stars" ? 'selected' : null} onClick = { this.sortQuestListBy.bind(this, "stars")}>Star Difficulty</button>
									}
									
									<button className = {this.state.sortType == "questIsClear" ? 'selected' : null} onClick = { this.sortQuestListBy.bind(this, "questIsClear")}>Quest Cleared</button>
									<button className = {this.state.sortType == "none" ? 'selected' : null} onClick = { this.sortQuestListBy.bind(this, "none")}>No Sort</button>
								</div>
							</div>
				</div>

				<div id = "quest-list-wrapper">

					{ this.state.currentFilter != "none" && 
						<h2 className = "filter-star-num">
							{this.state.currentFilter} Star Quests
						</h2>
					}
					
					{myQuestsList.length <= 0 ? 
						(<div className = "error_message">(0) Quests In Journal Log</div>)
						: (<ul id = "my_game_list" className = "item_list">{ myQuestsList }</ul>)
					}

					{myQuestsList.length > 0 &&
						<button id = "clear_all_button" onClick = { this.handleClearAll }>
							Clear All
						</button>
					}
				</div>
			</section>
		</div>);
	}
});