/*
Author: Glavin Wiechert
Creation Date: September 12, 2013
Description: JavaScript SDK for the Socrata API.
*/

;(function( socrata, $, undefined ) {
	// For easy access and minification.
	var self = socrata;

    //Private Property
    var lastError = null;
    var debugging = true;

    //Public Property
    self.baseUrl = "https://www.halifaxopendata.ca/api";
    self.debugging = function(newState) {
    	if (typeof newState === "boolean")
    		debugging = newState;
    };

    //Public Method
    self.view = function(viewId, params, callback) {
    	// Validate
    	if (typeof viewId !== "string") {
    		lastError = new Error('Invalid viewId.');
    		if (debugging) console.warn(lastError.message);
    		return lastError;
    	}
    	if (params && typeof params !== "object") {
    		lastError = new Error('Invalid parameters.');
    		if (debugging) console.warn(lastError.message);
    		return lastError;
    	}
    	if (typeof callback !== "function") {
    		lastError = new Error('Callback must be function. Do you not want to receive the result?');
    		if (debugging) console.warn(lastError.message);
    		return lastError;
    	}

    	// Send request
    	var url = self.baseUrl + '/views/' + viewId;
    	return apiCall('/views/'+viewId, params, function(data) {
    			var view = new SocrataView(data);
    			callback(view);
    		}
    	);

    };

    self.views = function(params, callback) {

		if (params && typeof params !== "object") {
    		lastError = new Error('Invalid parameters.');
    		if (debugging) console.warn(lastError.message);
    		return lastError;
    	}
    	if (typeof callback !== "function") {
    		lastError = new Error('Callback must be function. Do you not want to receive the result?');
    		if (debugging) console.warn(lastError.message);
    		return lastError;
    	}

    	// Send request
    	return apiCall('/views', params, function(data) {
    			// Convert to SocrataView array
    			var arr = [], obj = { };
    			for (var i=0, len=data.length; i<len; i++) {
    				arr.push( new SocrataView(data[i]) );
    				obj[data[i].name] = new SocrataView(data[i]);
    			}
    			callback(obj);
    		}
    	);

    }

    //Private Method
    function apiCall( api, params, callback ) {
		if (debugging) {
			console.info('API Call Request:', api, params);
		}
		return $.getJSON(
    		self.baseUrl + api,
    		params,
    		function(data, textstatus) {
    			if (debugging) {
    				console.info('API Call Result:', data);
    			}
				callback(data);
    		}
    	);
    };

    // Specialty Objects
    function SocrataView(viewData) {
    	var self = this;
    	this.data = viewData;
    	this.id = this.data['id'];
    	this.baseUrl = '/views/'+this.id;
    	this.name = this.data['name'];
    	this.type = this.data['viewType'];
    	this.category = this.data['category'];
    	this.description = this.data['description'];
    	this.childViews = this.data['childViews'] || [ ];
    	this.get = function(property) {
    		return this.data['property'] || null;
    	};
    	this.columns = function(params, callback) {
    		apiCall(this.baseUrl + '/columns.json', params, function(data) {
				// Convert to SocrataView array
    			var arr = [];
    			for (var i=0, len=data.length; i<len; i++) {
    				arr.push( new SocrataViewColumn(self.id, data[i]) );
    			}
    			callback(arr);    		
    		});
    	};
    	this.column = function(columnId, params, callback) {
    		return apiCall(this.baseUrl + '/columns/'+columnId, params, function(data) {
				// Convert to SocrataView array
    			callback( new SocrataViewColumn(self.id, data) );    		
    		});
    	};
    	this.rows = function(params, callback) {
    		if (this.type !== "tabular") {
	    		lastError = new Error('Can only get rows for tabular datasets.');
	    		if (debugging) console.warn(lastError.message);
	    		return lastError;
    		}
    		params = params || { 'method':'getRows', 'start':0, 'length':10 }; // { 'row_ids_only':'true' };
    		params['method'] = 'getRows'; // Force to get Rows
    		return apiCall(this.baseUrl + '/rows.json', params, function(data) {
				// Convert to SocrataView array
    			var arr = [];
    			for (var i=0, len=data.length; i<len; i++) {
    				arr.push( new SocrataViewRow(self.id, data[i]) );
    			}
    			callback(arr);    		
    		});
    	};
    	this.row = function(rowId, params, callback) {
    		return apiCall(this.baseUrl + '/rows/'+rowId, params, function(data) {
				// Convert to SocrataView array
    			callback( new SocrataViewRow(self.id, data) );    		
    		});
    	};
    	/*
    	this.tabularLayers = function(params, callback) {
    		params['access_type'] = 'API';
    		params['length'] =  params['length'] || 100;
    		return apiCall(this.baseUrl + '/rows.json', params, function(data) {
    			callback(data);
    		});
    	};
    	*/
    	this.childViewAt = function(index, params, callback) {
    		if (this.childViews.length <= index) {
				lastError = new Error('Index for childView out of bounds.');
	    		if (debugging) console.warn(lastError.message);
	    		return lastError;
    		}
    		return apiCall('/views/'+this.childViews[index], params, function(data) {
    			return callback( new SocrataView(data) );
    		});
    	}
    };
    function SocrataViewColumn(viewId, columnData) {
    	if (!viewId || !columnData) {
			lastError = new Error('Missing argument for SocrataViewColumn constructor.');
    		if (debugging) console.warn(lastError.message);
    		return lastError;
		}
    	this.viewId = viewId;
    	this.id = columnData['id'];
    	this.baseUrl = '/views/'+this.viewId+'/columns/'+this.id;
    	this.data = columnData;
    	this.get = function(property) {
    		return data['property'] || null;
    	};
    };
	function SocrataViewRow(viewId, rowData) {
    	if (!viewId || !rowData) {
			lastError = new Error('Missing argument for SocrataViewRow constructor.');
    		if (debugging) console.warn(lastError.message);
    		return lastError;
		}
    	this.viewId = viewId;
    	this.id = rowData['id'];
    	this.baseUrl = '/views/'+this.viewId+'/columns/'+this.id;
    	this.data = rowData;
    	this.get = function(property) {
    		return data['property'] || null;
    	};
    };

}( window.socrata = window.socrata || {}, jQuery ));