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

var searchForPhotos = function(address, callback) {

	var geocoder = new google.maps.Geocoder();
			    geocoder.geocode( { 'address': address}, function(results, status) {
			          if (status == google.maps.GeocoderStatus.OK) {

			          	  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search" +
							"&api_key=805e8790687db0e7a54d0602db004feb" + 
							"&tags=street" + 
							"&lat=" + results[0].geometry.location.lat() + 
							"&lon=" + results[0].geometry.location.lng() +
							"&min_upload_date=1420122446" + 
							"&radius=" + 10 +
							"&safe_search=1" +
							//"&geo_context=2" +
							"&extras=url_m" +
							"&per_page=15";
						
							var photos = [];
							$.getJSON(url + "&format=json&jsoncallback=?", function(data){
							    $.each(data.photos.photo, function(i,item){
							        photos.push(item.url_m);
							    });

							    callback(photos);
							});

			            } else {
			            console.log("Something got wrong " + status);
			          }
			        });
}

var Picture = React.createClass({
	render: function(){
        return (
        	<div className="pic">
            	<img src={this.props.src} />
            </div>
        );
    }
});

var Photos = React.createClass({

	getInitialState: function(){
        return { pictures: [] };
    },

	render : function() {
		var pictures = this.state.pictures.map(function(p){
            return <Picture src={p} key={p}/>
        });

        if(!pictures.length){
            pictures = <p>Loading images..</p>;
        }
        return (
            <div id="container">
                {pictures}
            </div>
        );
	},

	componentDidMount: function() {

		var self = this;

		var address = this.props.address;

		if (address) {
				searchForPhotos(address, function(photos) {
					self.setState({ pictures: photos });

						var container = document.querySelector('#container');

						var msnry = new Masonry( container, {
						  // options
						  columnWidth: 400,
						  itemSelector: '.pic'
						});

						imagesLoaded( container, function() {
						  msnry.layout();
						});
				});
		}
	},

	componentDidUpdate: function(prevProps) {

		if (prevProps.address === this.props.address) {
			return;
		}

		var self = this;

		var address = this.props.address;

		if (address) {
				searchForPhotos(address, function(photos) {
					self.setState({ pictures: photos });

					var msnry = new Masonry( '#container', {
						  // options
						  columnWidth: 400,
						  itemSelector: '.pic'
						});

					imagesLoaded( container, function() {
						  msnry.layout();
						});
				});
		}
	}
})

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
    				<Photos address={this.state.address} />
    			</div>
    		);
    }
});

React.render(
  <AddressResponder/>,
  document.getElementById('maps')
);