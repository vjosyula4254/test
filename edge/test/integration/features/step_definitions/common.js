/* jslint node: true */
'use strict';

module.exports = function() {
	this.When(/^I request a non-existing API resource$/, {timeout: 60 * 1000}, function(callback) {
		this.apickli.setRequestHeader("Authorization",'Bearer '+token);
		this.apickli.get('/blah', callback);
	});
};
