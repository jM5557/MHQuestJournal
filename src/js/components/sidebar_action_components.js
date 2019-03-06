// Quest Databases for MH Gen and MH4U sourced from https://github.com/gatheringhallstudios/MHGenDatabase 
// and https://github.com/kamegami13/MonsterHunter4UDatabase respectively

var AllQuestsWrapper = React.createClass({
	getInitialState : function () {
		return ({ display : false });
	},

	handleClick : function (obj) {
		obj.questClear = false;
		this.props.handleUpdate(obj);
	},

	handleDisplay : function (event) {
		if(this.state.display){
			if(event.currentTarget.id == "display_quests_container")
				return;

			this.setState({ display : false });
		}
		else{
			this.setState({ display : true });
		}
	},

	render : function () {
		const quests = this.props.quests.quests;
		const listQuests = quests.map(function (quest) {
			if(quest.name.length < 1)
				return;

			return (<li key = {quest._id}  onClick = { this.handleClick.bind(this, quest) }>
				<p className = "name">{ quest.name }</p>
				<span className = "target">{ quest.target }</span>
					<span className = "star-num">{ quest.stars } &#9734;</span>
			</li>);
		}, this);

		return (
			<div>
				<h1>All Quests</h1>
				<ul className = "item_list search">{ listQuests }</ul>
			</div>
		);
	}
});

//Component for Searching Quests By Name
var SearchQuests = React.createClass({
	getInitialState : function () {
		return { search: [] }
	},

	handleSearch : function (event) {
		let val = event.target.value;
		
		//limits the search to terms that are longer than 3 characters
		if(val.length <= 3){
			this.setState({ search : [] });
			return;
		}

		let t = [];

		for(let i in this.props.quests.quests){
			let q = this.props.quests.quests[i];

			if(val.toLowerCase().indexOf('stars: ') > -1){

				let str = val.toLowerCase().substring(7); //gets star difficulty number as a string
				let str_num = parseInt(str); //converts above string to integer
				
				//checks for quests with star difficulty from user-input
				if(q.stars == str_num){
					t.push(q);
					console.log(q);
				}
			}

			else if(q.name.toLowerCase().indexOf(val.toLowerCase()) > -1
				|| q.target.toLowerCase().indexOf(val.toLowerCase()) > -1)
			{
				

				t.push(q);
				console.log(q);
			}
		}

		t = t.sort(function (a, b) {
			return (a.stars - b.stars);
		});

		this.setState({ search : t });
	},

	handleClick : function (obj) {
		obj.questClear = false;
		this.props.handleUpdate(obj);
	},

	clearSearch : function () {
		let el = document.getElementById("search_bar");

		if(el === 'undefined' || el === null)
			return;

		el.value = "";

		this.setState({ search : [] });
	},

	render : function () {
		const resultQuests = this.state.search;

		let listResultQuests = this.state.search.map(function (quest) {
			return (
				<li onClick = { this.handleClick.bind(this, quest) } key = {quest.id}>
					<p className = "name">{ quest.name }</p>
					<span className = "target">{ quest.target }</span>
					<span className = "star-num">{ quest.stars } &#9734;</span>
				</li>
			);
		}, this);

		if(this.props.doClearSearch){
			this.clearSearch();
		}

		console.log(this.props.doClearSearch + ": " + this.state.doClearSearch)

		return (	
					<div id = "search_wrapper">
						<h1>Search For Quests</h1>
						<p className = "notice">
							You can search by typing a quest name or target as seen in-game, or typing 
							<strong>stars: #</strong> to search by star number.
						</p>
						<input id = "search_bar" type = "text" placeholder = "Enter A Quest Name Here" onChange = { this.handleSearch.bind(this) } />
						{this.state.search.length > 0 &&
							<button id = "clear_all_search_results_button" onClick = { this.clearSearch }>
								Clear All Search Results
							</button>
						}
						<ul className = "item_list search">
							{ listResultQuests }
						</ul>
					</div>
				);
	}
});

//Component for displaying a Resource list
var ResourcesWrapper = React.createClass({
	render : function () {
		let res_list = [{
			"name": "MHGU Database App",
			"url": "https://play.google.com/store/apps/details?id=com.ghstudios.android.mhgendatabase&hl=en"
		},
		{
			"name": "MHWorld Database App",
			"url": "https://play.google.com/store/apps/details?id=com.gatheringhallstudios.mhworlddatabase"
		},
		{
			"name": "MH4U Database App",
			"url": "https://github.com/kamegami13/MonsterHunter4UDatabase/releases"
		}];

		let res_list_el = res_list.map(function (i) {
			return (<li><a href = { i.url }>{ i.name }</a></li>);
		});

		return (
			<div>
				<h1>Data obtained from the GatheringHallStudios team.</h1>
				<h2>Check out their Android Apps!</h2>

				<ul>
					{ res_list_el }
				</ul>
			</div>
		);
	}
});