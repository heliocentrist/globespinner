var NameInput = React.createClass({
	handleChange: function() {
		this.props.onUserInput(
			this.refs.nameInput.getDOMNode().value
		);
	},
	render: function() {
		return (
			<form>
				<input type="text"
					placeholder="Who are you?"
					ref="nameInput"
				/>
				<input type="button"
					value="That is me"
					onClick={this.handleChange}
				/>
			</form>
		)
	}
});

var Greeter = React.createClass({
	render: function() {

		var greeter = this.props.enteredName ? <h2>Hello, {this.props.enteredName}!</h2> : <h2>Identify yourself!</h2>;

		return greeter;
	}
});

var NameResponder = React.createClass({
	getInitialState: function() {
        return {
            enteredName: ''
        };
    },

    handleUserInput: function(enteredName) {
        this.setState({
            enteredName: enteredName
        });
    },

    render: function() {
    	return (
    			<div>
    				<NameInput enteredName={this.state.enteredName} onUserInput={this.handleUserInput}/>
    				<Greeter enteredName={this.state.enteredName} />
    			</div>
    		);
    }
});

React.render(
  <NameResponder/>,
  document.getElementById('example')
);