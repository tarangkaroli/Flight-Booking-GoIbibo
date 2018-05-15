'use strict';

var _ = require('lodash');
var ResourcePage = require('./resource.po.js');

function FlightPage() {
    ResourcePage.call(this, 'flightPage');
}

FlightPage.prototype = Object.create(ResourcePage.prototype);
FlightPage.prototype.constructor = FlightPage;

var flightPageElements = {
    roundTripRadioBox: element(by.id('gi_roundtrip_label')),
    textBoxSource: element(by.id('gosuggest_inputSrc')),
    textBoxDestination: element(by.id('gosuggest_inputDest')),
    dateIcon: element.all(by.css('.icon-calendar1')),
    calenderBox: element(by.css('.DayPicker')),
    searchButton: element(by.id('gi_search_btn')),

    onwardFlightListDeparture: element.all(by.xpath("//div[@id='onwFltContainer']//div//div[contains(@class,'card-block')]//div[contains(@class,'col-sm-4')]//span[contains(@class,'ico20')]")),
    returnFlightListDeparture: element.all(by.xpath("//div[@id='retFltContainer']//div//div[contains(@class,'card-block')]//div[contains(@class,'col-sm-4')]//span[contains(@class,'ico20')]")),

    onwardDateFlight: element.all(by.css('#onwFltContainer .control--radio .control__indicator')),
    returnDateFlight: element.all(by.css('#retFltContainer .control--radio .control__indicator')),
    bookingButton: element(by.xpath("//div[@class='db']//input[@value='BOOK']")),

    totalAmount: element(by.xpath("//div[@class='blueBgLt fl width100 pad10']")),
    proceedPayment: element(by.xpath("//div//button[text()='Proceed to Payment']")),
};

_.assign(FlightPage.prototype, flightPageElements);
module.exports = FlightPage;