'use strict';

var _ = require('lodash');

var FlightPage = require('../pages/flightBooking.po.js'),
    resource = require('../pages/resource.po.js');

var flightPage = new FlightPage();

describe('Book a flight ticket', function () {
    /*defining up the date for the onward
     * and return flight dates */
    var onwDate = new Date(new Date().getTime()+(1*24*60*60*1000));
    var retDate = new Date(new Date().getTime()+(3*24*60*60*1000));

    if(onwDate.getDate() < 10) {
        var ddOnw = '0'+ onwDate.getDate();
    }
    else {ddOnw = onwDate.getDate();}

    if(retDate.getDate() < 10) {
        var ddRet = '0' + retDate.getDate();
    }
    else {ddRet = retDate.getDate();}

    if(onwDate.getMonth() < 10) {
        var monOnw = '0' + (onwDate.getMonth() +1);
    }
    else {monOnw = (onwDate.getMonth() + 1);}

    if(retDate.getMonth() < 10) {
        var monRet = '0' + (retDate.getMonth() + 1);
    }
    else {monRet = (retDate.getMonth() + 1);}

    var onwDateBook = "fare_"+onwDate.getFullYear() + monOnw + ddOnw;
    var retDateBook = "fare_"+retDate.getFullYear() + monRet + ddRet;

    var elementOnwDate = element(by.id(onwDateBook)); //Date of travel
    var elementRetDate = element(by.id(retDateBook)); //Date of return

    var listOnwDep = flightPage.onwardFlightListDeparture; //list of onward departure time
    var listRetDep = flightPage.returnFlightListDeparture; //list of return departure time

    var xpathOnw = "//div[@id='onwFltContainer']//div//div[contains(@class,'card-block')]//div[contains(@class,'col-sm-4')]//span[contains(@class,'ico20') and text() = '";
    var xpathRet = "//div[@id='retFltContainer']//div//div[contains(@class,'card-block')]//div[contains(@class,'col-sm-4')]//span[contains(@class,'ico20') and text() = '";


    /*This function checks for any notification
    * that may appear using iframe tag*/
    function checkFrame() {
        browser.isElementPresent(flightPage.notificationFrame).then(function (present) {
            if (present) {
                browser.switchTo().frame('webklipper-publisher-widget-container-notification-frame');
                browser.isElementPresent(flightPage.webclickCloseButton).then(function (present) {
                    if (present) {
                        flightPage.webclickCloseButton.click();
                    }
                })
            }
        });
    }


    beforeAll(function () {
        browser.sleep(15000);
        checkFrame();

        browser.isElementPresent(flightPage.flightIcon).then(function (present) {
            if(present) {
                flightPage.flightIcon.click();
            }
        });
    });


    afterAll(function () {
        browser.get("https://www.goibibo.com/");
    });


    it('booking a ticket from Bangalore to Mumbai', function () {
        checkFrame();
        browser.refresh();

        /*Select round trip option*/
        expect(flightPage.roundTripRadioBox.isPresent()).toBe(true);
        flightPage.roundTripRadioBox.click();

        /*enter the source and select from the autosuggest*/
        flightPage.textBoxSource.sendKeys("Bangalore (BLR)");
        browser.sleep(1000);
        flightPage.autoSuggestDestination.getText().then(function (text) {
            if(text.indexOf("Bangalore")!== -1) {
                flightPage.autoSuggestDestination.click();
            }
        });
        expect(flightPage.textBoxSource.getAttribute('value')).toBe("Bangalore (BLR)");

        /* enter the destination and select from the autosuggest*/
        flightPage.textBoxDestination.sendKeys("Mumbai (BOM)");
        browser.sleep(1000);
        flightPage.autoSuggestDestination.getText().then(function (text) {
            if(text.indexOf("Mumbai")!== -1) {
                flightPage.autoSuggestDestination.click();
            }
        });
        expect(flightPage.textBoxDestination.getAttribute('value')).toBe("Mumbai (BOM)");

        /*Choosing onward flight date*/
        expect(flightPage.dateIcon.get(0).isPresent()).toBe(true);
        flightPage.dateIcon.get(0).click();
        expect(flightPage.calenderBox.isPresent()).toBe(true);
        browser.sleep(5000);
        expect(elementOnwDate.isDisplayed()).toBe(true);
        elementOnwDate.click();

        /*Choosing return flight date*/
        expect(flightPage.calenderBox.isPresent()).toBe(true);
        browser.sleep(5000);
        expect(elementRetDate.isDisplayed()).toBe(true);
        elementRetDate.click();

        expect(flightPage.searchButton.isEnabled()).toBe(true);
        flightPage.searchButton.click();

        /*Wait for the booking page to load*/
        browser.wait(protractor.ExpectedConditions.visibilityOf(flightPage.bookingButton, 20000)).then(function () {
            expect(browser.getTitle()).toContain("Online Flight Booking");
            browser.sleep(2000);
        });

        flightPage.scrollDown();
        browser.sleep(5000);

        /*selecting the onward flight with the earliest departure time*/
        listOnwDep.getText().then(function (text) {
            var list1 = [];
            list1 = text;
            /*sort the departure time in ascending order*/
            list1.sort();
            console.log("Onward Departure: " + list1);

            /*xpath for the earliest departure time and it's respective radio box*/
            var xpathDepartureTimeOnw = xpathOnw + list1[0] + "']";
            var xpathRadioBoxTimeOnw = xpathDepartureTimeOnw + "/../../../..//label//div[contains(@class,'control__indicator')]";

            flightPage.scrollToBringElementIntoView(element(by.xpath(xpathDepartureTimeOnw)));
            browser.sleep(2000);
            expect(element(by.xpath(xpathDepartureTimeOnw)).isDisplayed()).toBe(true);
            expect(element(by.xpath(xpathRadioBoxTimeOnw)).isDisplayed()).toBe(true);

            flightPage.scrollToBringElementIntoView(element(by.xpath(xpathRadioBoxTimeOnw)));
            browser.sleep(2000);
            browser.actions().mouseMove(element(by.xpath(xpathRadioBoxTimeOnw))).click().perform();
        });

        flightPage.scrollTop();

        /*selecting the return flight with the earliest departure*/
        listRetDep.getText().then(function (text) {
            var list1 = [];
            list1 = text;
            /*sort the departure time in ascending order*/
            list1.sort();
            console.log("Return Departure: " + list1);

            /*xpath for the earliest departure time and it's respective radio box*/
            var xpathDepartureTimeRet = xpathRet + list1[0] + "']";
            var xpathRadioBoxTimeRet = xpathDepartureTimeRet + "/../../../..//label//div[contains(@class,'control__indicator')]";


            flightPage.scrollToBringElementIntoView(element(by.xpath(xpathDepartureTimeRet)));
            browser.sleep(2000);
            expect(element(by.xpath(xpathDepartureTimeRet)).isDisplayed()).toBe(true);
            expect(element(by.xpath(xpathRadioBoxTimeRet)).isDisplayed()).toBe(true);

            flightPage.scrollToBringElementIntoView(element(by.xpath(xpathRadioBoxTimeRet)));
            browser.sleep(2000);
            browser.actions().mouseMove(element(by.xpath(xpathRadioBoxTimeRet))).click().perform();
        });

        flightPage.scrollTop();
        expect(flightPage.bookingButton.isPresent()).toBe(true);
        browser.sleep(2000);
        flightPage.bookingButton.click(); /*will redrect the browser to the payment page*/


        /*Wait for the payment page to appear*/
        browser.wait(protractor.ExpectedConditions.visibilityOf(flightPage.paymentPageIcon, 20000)).then(function () {
            expect(flightPage.paymentPageIcon.isPresent()).toBe(true);
        });

        flightPage.scrollTop();
        browser.sleep(3000);

        /*Check that total amount and Proceed to payment option is displayed*/
        expect(flightPage.totalAmount.isDisplayed()).toBe(true);
        flightPage.scrollToBringElementIntoView(flightPage.proceedPayment).then(function () {
            expect(flightPage.proceedPayment.isPresent()).toBe(true);
            browser.sleep(2000);
        });
    });
});