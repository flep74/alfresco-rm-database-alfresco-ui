'use strict';

angular.module('openDeskApp.declaration')
	.factory('propertyService', function ($http) {

		var content = [];
		var propertyContent = [];
		var propertyName = '';
		var propertyValues = {};

		function getValuesForProperty(propertyName) {
			return propertyValues[propertyName];
		}

		function setPropertyValues(property, values) {
			return $http.put("/alfresco/s/propertyValues", {
				"siteShortName": "retspsyk",
				"property": property,
				"values": values,
			}).then(function (response) {
				return response.data;
			});
		}


		// todo det er her der er en fejl, du får gemt string og ikke et objekt.
		function saveChanges() {
			var values = [];
			propertyContent.forEach(function (property) {
				values.push(property.title);
			})
			setPropertyValues(propertyName, values);
		}

		// todo det er her der er en fejl, du får gemt string og ikke et objekt.
		function saveChangesHenvisende() {
			var values = [];
			propertyContent.forEach(function (property) {
				values.push(property);
			})
			setPropertyValues(propertyName, values);
		}

		return {

			initPropertyValues: function () {
				return $http.get("/alfresco/s/propertyValues?siteShortName=retspsyk")
					.then(function (response) {
						propertyValues = response.data;
						return response.data;
					});
			},

			getAllPropertyValues: function () {

			    // cleanup values for doctors, socialworkers, psycologists and secretaries - remove the userid

					var userTypes = ["secretary", "socialworker", "psychologist", "doctor"];

					userTypes.forEach(function (type) {
						for (var x in propertyValues[type]) {
							var user = propertyValues[type][x];
							var username = user.match(/ *\([^)]*\) */g);
							propertyValues[type][x] = propertyValues[type][x].replace(username, "");
						}
					});

				return propertyValues;
			},

			getPropertyContentHenvisende: function (property) {
			propertyName = property;
			propertyContent = [];

			var content = getValuesForProperty(property);



			// tmp for testing, reset contents in table
				    // return [];

			if (!content) return propertyContent;

			content.forEach(function (elem, key) {

				if (elem.hasOwnProperty("title")) {

					var newObj = {
						title: elem.title,
						email: elem.email,
						by: elem.by,
						postnr: elem.postnr,
						adresse: elem.adresse,
						selected: false
					}
					propertyContent.push(newObj);
				}
			}, this);

			return propertyContent;
		},

			getPropertyContent: function (property) {
				propertyName = property;
				propertyContent = [];

				var content = getValuesForProperty(property);


				if (!content) return propertyContent;

				content.forEach(function (elem, key) {
					propertyContent.push({
						title: elem,
						selected: false
					});
				}, this);

				return propertyContent;
			},

			addPropertyValueHenvisende: function (value) {
				propertyContent.push(value);
				saveChangesHenvisende();
			},

			addPropertyValue: function (value) {
				propertyContent.push({
					title: value,
					selected: false
				});
				saveChanges();
			},

			/**
			 * rename a property
			 *
			 */
			renamePropertyValue: function (oldVal, newVal) {
				propertyContent.forEach(function (prop, key) {
					if (prop.title == oldVal.title)
						propertyContent.splice(key, 1);
				})
				propertyContent.push(newVal);
				saveChanges();
			},

			deletePropertyValues: function (values) {
				propertyContent.forEach(function (prop, key) {
					values.forEach(function (value) {
						if (prop.title == value.title) {
							propertyContent.splice(key, 1);
						}
					});
				});
				saveChanges();
			},

			/**
			 * rename a property for henvisende
			 *
			 */
			renamePropertyValueHenvisende: function (oldVal, newVal) {

				propertyContent.forEach(function (prop, key) {

					if (prop.title == oldVal.title) {
					     propertyContent.splice(key, 1);
					}
				})
				propertyContent.push(newVal);
				saveChangesHenvisende();
			},

			deletePropertyValuesHenvisende: function (values) {
				propertyContent.forEach(function (prop, key) {
					values.forEach(function (value) {
						if (prop.title == value.title) {
							propertyContent.splice(key, 1);
						}
					});
				});
				saveChangesHenvisende();
			}
		};
	});
