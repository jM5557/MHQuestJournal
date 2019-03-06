//Function for creating a clickable Sidebar Item Icon
var sidebarItemComponent = function (iconImagePath, MyComp, label, num) {
	return React.createClass({
		handleIconClick : function (ComponentToRender, num) {
			this.props.handleIconClick(ComponentToRender, num);
		},

		render : function () {
			return (<div className = {"image_icon_wrapper " + (this.props.selected ? 'selected' : null)} onClick = { this.handleIconClick.bind(this, MyComp, num) }>
				<img alt = { iconImagePath } src = { "assets/images/" + iconImagePath } />
				<p>{ label }</p>
			</div>);
		}
	});
}

var ItemOneWrapper = sidebarItemComponent("search_icon.png", SearchQuests, "Search For Quests", 1);
var ItemTwoWrapper = sidebarItemComponent("quest_icon.png", AllQuestsWrapper, "View All Quests", 2);
var ItemThreeWrapper = sidebarItemComponent("map_icon.png", ResourcesWrapper, "Database Apps", 3);

var SidebarComponent = React.createClass({
	getInitialState : function () {
		return { 
			MyComp : "",
			display : false, 
			selectedButton: -1 
		}
	},

	handleIconClick : function (ComponentToRender, num) {
		if(this.state.MyComp == ComponentToRender)
		{
			this.setState({
				display: ((this.state.display) ? false : true),
				selectedButton: ((this.state.display) ? -1 : num),
			});

			return;
		}

		this.setState({
			MyComp : ComponentToRender,
			display : true,
			selectedButton: num,
		});
	},

	render : function () {
		return (<section id = "sidebar">

			<ItemOneWrapper selected = { (this.state.selectedButton == 1) ? true : false} handleIconClick = {this.handleIconClick} />
			<ItemTwoWrapper selected = { (this.state.selectedButton == 2) ? true : false} handleIconClick = {this.handleIconClick} />
			<ItemThreeWrapper selected = { (this.state.selectedButton == 3) ? true : false} handleIconClick = {this.handleIconClick} />
			
			<div className = "image_icon_wrapper">
				<a href = "https://github.com/jM5557/MHQuestJournal">
					<img alt = "jM5557 github repo link icon" src = "assets/images/github-icon-white.png" />
					<p>Github Repo</p>
				</a>
			</div>
			
			{this.state.display && <div id = "current_selected_item_overlay" onClick = {this.handleIconClick.bind(this, this.state.MyComp)}></div>}
			{this.state.display && 
				<div id = "current_selected_item">
					<button id = "close_sidebar" onClick = {this.handleIconClick.bind(this, this.state.MyComp)}>×</button>
					<this.state.MyComp quests = { this.props.quests } handleUpdate = {this.props.handleUpdate} doClearSearch = { this.props.doClearSearch } />
				</div>
			}
		</section>);
	}
});