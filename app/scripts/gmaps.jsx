var AddressInput = React.createClass({
	handleChange: function() {
		this.props.onUserInput(
			this.refs.addressInput.getDOMNode().value
		);
	},
	render: function() {
		return (
			<form>
				<input type="text"
					placeholder="Where?"
					ref="addressInput"
				/>
				<input type="button"
					value="Go"
					onClick={this.handleChange}
				/>
			</form>
		)
	}
});

function initialize(address) {
		 	var geocoder = new google.maps.Geocoder();
			    geocoder.geocode( { 'address': address}, function(results, status) {
			          if (status == google.maps.GeocoderStatus.OK) {

			          	  // Set up the map
						  var mapOptions = {
						    center: results[0].geometry.location,
						    zoom: 14,
						    streetViewControl: false
						  };
						  new google.maps.Map(document.getElementById('map-canvas'),
						      mapOptions);

			            console.log("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng()); 
			          } else {
			            console.log("Something got wrong " + status);
			          }
			        });
		}

var Maps = React.createClass({
	render : function() {

		var address = this.props.address;

		google.maps.event.addDomListener(window, 'load', function() {initialize(address);});

		return (
			<div>
				<div id="map-canvas"></div>
			</div>
		)
	},

	componentDidUpdate: function() {
		initialize(this.props.address);
	}
});

var AddressResponder = React.createClass({
	getInitialState: function() {
        return {
            address: 'Amsterdam'
        };
    },

    handleUserInput: function(address) {
        this.setState({
            address: address
        });
    },

    render: function() {
    	return (
    			<div>
    				<AddressInput onUserInput={this.handleUserInput}/>
    				<Maps address={this.state.address} />
    			</div>
    		);
    }
});

React.render(
  <AddressResponder/>,
  document.getElementById('maps')
);