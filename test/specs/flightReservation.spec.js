'use strict';

var _ = require('lodash');

var FlightPage = require('../pages/flightReservation.po.js'),
    flightPage = new FlightPage;

describe('Book a flight', function () {
    //navigates to the flight reservation
    //system of the site, if not already there.
    beforeAll(function () {
        browser.isElementPresent(flightPage.flightIcon).then(function (present) {
            if(present) {
                flightPage.flightIcon.click();
            }
        });
    });

    afterAll(function () {
        browser.get("https://www.goibibo.com/");
    });

    it('should verify that login and sign up options are present', function () {
        expect(flightPage.signInLink.isPresent()).toBe(true);
        expect(flightPage.signUpLink.isPresent()).toBe(true);
    });

    it('should verify the different options available on the home page', function () {
        expect(flightPage.flightLink.isDisplayed()).toBe(true);
        expect(flightPage.hotelLink.isDisplayed()).toBe(true);
        expect(flightPage.goStaysLink.isDisplayed()).toBe(true);
        expect(flightPage.busLink.isDisplayed()).toBe(true);
        expect(flightPage.trainLink.isDisplayed()).toBe(true);
        expect(flightPage.visaLink.isDisplayed()).toBe(true);
        expect(flightPage.moreOptionDropDown.isDisplayed()).toBe(true);
    });

    it('should verify that there are dropdown for more options', function () {
        flightPage.moreOptionDropDown.click();
        flightPage.waitForElementsVisibilityStatus(flightPage.moreOptionDropDownList.get(0), true);
    });
    
    it('should verify that there are different options for flight booking', function () {
        expect(flightPage.oneWayOptions.isPresent()).toBe(true);
        expect(flightPage.oneWayOptions.getAttribute('class')).toContain('switchAct');
        expect(flightPage.roundTripOption.isPresent()).toBe(true);
        flightPage.roundTripOption.click();
        expect(flightPage.roundTripOption.getAttribute('class')).toContain('switchAct');
        expect(flightPage.multiCityOption.isPresent()).toBe(true);
        flightPage.multiCityOption.click();
        expect(flightPage.multiCityOption.getAttribute('class')).toContain('switchAct');
    });

    it('should verify the input options available for flight reservation', function () {
        flightPage.oneWayOptions.click();
        expect(flightPage.textBoxSource.isPresent()).toBe(true);
        expect(flightPage.textBoxDestination.isPresent()).toBe(true);
        expect(flightPage.departureCalendar.isPresent()).toBe(true);
        expect(flightPage.returnCalendar.isPresent()).toBe(true);
        expect(flightPage.passengerSelectBox.isPresent()).toBe(true);
    });
    
    it('should verify that there is drop down for the airports to choose from', function () {
        flightPage.selectSourceCityFromDropDown('Bengaluru');
        expect(flightPage.textBoxSource.getAttribute('value')).toBe("Bengaluru (BLR)");
        flightPage.selectDestinationCityFromDropDown('Mumbai');
        expect(flightPage.textBoxDestination.getAttribute('value')).toBe("Mumbai (BOM)");
    });

    it('should verify that the flight option shifts from the one way to round trip when departure is selected', function () {
        expect(flightPage.oneWayOptions.getAttribute('class')).toContain('switchAct');
        flightPage.departureCalendar.click();
        browser.sleep(2500);
        expect(flightPage.getDepartureDate().isDisplayed()).toBe(true);
        flightPage.getDepartureDate().click();

        flightPage.returnCalendar.click();
        browser.sleep(2500);

        //logic to select the calendar month as for the appropriate date.
        if (flightPage.getOnwMonth() != flightPage.getRetMonth(20)) {
            expect(flightPage.button_calendarMonthNext.isPresent()).toBe(true);
            flightPage.button_calendarMonthNext.click();
            flightPage.waitForElementsVisibilityStatus(flightPage.button_calendarMonthPrev, true);
            expect(flightPage.getReturnDate(20).isDisplayed()).toBe(true);
            flightPage.getReturnDate(20).click();
        }
        else if (flightPage.getOnwMonth() == flightPage.getRetMonth(20)) {
            expect(flightPage.getReturnDate(20).isDisplayed()).toBe(true);
            flightPage.getReturnDate(20).click();
        }
        // expect(flightPage.getReturnDate(5).isDisplayed()).toBe(true);
        // flightPage.getReturnDate(5).click();
        expect(flightPage.roundTripOption.getAttribute('class')).toContain('switchAct');
    });

    it('should display options to update the passenger count and change the travel class', function () {
        flightPage.passengerSelectBox.click();
        flightPage.waitForElementsVisibilityStatus(flightPage.passengerModalWindow, true, 250000);

        //verify the default counts of passenger
        expect(flightPage.adultPassengerCount.getAttribute('value')).toEqual('1');
        expect(flightPage.childPassengerCount.getAttribute('value')).toEqual('0');
        expect(flightPage.infantPassengerCount.getAttribute('value')).toEqual('0');

        //increase the counts and verify the passenger count
        //and then decrease the count to original count
        flightPage.passengerIncreaseCount.click();
        expect(flightPage.adultPassengerCount.getAttribute('value')).toEqual('2');
        flightPage.passengerDecreaseCount.click();
        expect(flightPage.adultPassengerCount.getAttribute('value')).toEqual('1');

        flightPage.childPassengerIncreaseCount.click();
        expect(flightPage.childPassengerCount.getAttribute('value')).toEqual('1');
        flightPage.childPassengerIncreaseCount.click();
        expect(flightPage.childPassengerCount.getAttribute('value')).toEqual('2');
        flightPage.childPassengerDecreaseCount.click();
        flightPage.childPassengerDecreaseCount.click();
        expect(flightPage.childPassengerCount.getAttribute('value')).toEqual('0');

        //change the travel class and verify that it is reflected in the travel box
        expect(flightPage.passengerSelectBox.getText()).toContain('Economy');
        flightPage.selectClass('Business');
        expect(flightPage.passengerSelectBox.getText()).toContain('Business');
        flightPage.selectClass('Economy');
        expect(flightPage.passengerSelectBox.getText()).toContain('Economy');
    });

    it('should list flights for onward and return journey after the search button is clicked', function () {
        browser.refresh();
        flightPage.waitForElementsVisibilityStatus(flightPage.flightIcon, true);

        flightPage.selectSourceCityFromDropDown('Bengaluru');
        flightPage.selectDestinationCityFromDropDown('Mumbai');

        flightPage.departureCalendar.click();
        browser.sleep(2500);
        expect(flightPage.getDepartureDate().isDisplayed()).toBe(true);
        flightPage.getDepartureDate().click();

        flightPage.returnCalendar.click();
        browser.sleep(2500);

        if (flightPage.getOnwMonth() != flightPage.getRetMonth(3)) {
            expect(flightPage.button_calendarMonthNext.isPresent()).toBe(true);
            flightPage.button_calendarMonthNext.click();
            flightPage.waitForElementsVisibilityStatus(flightPage.button_calendarMonthPrev, true);
            expect(flightPage.getReturnDate(3).isDisplayed()).toBe(true);
            flightPage.getReturnDate(3).click();
        }
        else if (flightPage.getOnwMonth() == flightPage.getRetMonth(5)) {
            expect(flightPage.getReturnDate(3).isDisplayed()).toBe(true);
            flightPage.getReturnDate(3).click();
        }
        // expect(flightPage.getReturnDate(3).isDisplayed()).toBe(true);
        // flightPage.getReturnDate(3).click();

        flightPage.searchButton.click();
        flightPage.waitForElementsVisibilityStatus(flightPage.bookingButton, true, 25000);

        flightPage.scrollDown();
        browser.sleep(2000);
        flightPage.scrollTop();
        browser.sleep(2000);
    });
    
    it('should display options to sort the flights using different categories, and price is the default sort option', function () {
        expect(flightPage.departureSortOnwrd.isPresent()).toBe(true);
        expect(flightPage.durationSortOnwrd.isPresent()).toBe(true);
        expect(flightPage.priceSortOnwrd.isPresent()).toBe(true);
        expect(flightPage.arrivalSortOnwrd.isPresent()).toBe(true);
        expect(flightPage.priceSortOnwrd.getAttribute('class')).toContain('hpyBlueLt');

        expect(flightPage.departureSortRtrn.isPresent()).toBe(true);
        expect(flightPage.durationSortRtrn.isPresent()).toBe(true);
        expect(flightPage.priceSortRtrn.isPresent()).toBe(true);
        expect(flightPage.arrivalSortRtrn.isPresent()).toBe(true);
        expect(flightPage.priceSortRtrn.getAttribute('class')).toContain('hpyBlueLt');
    });

    it('should display the flight list based on the earliest departure', function () {
        flightPage.departureSortOnwrd.click();
        browser.sleep(2000);
        expect(flightPage.departureSortOnwrd.getAttribute('class')).toContain('hpyBlueLt');

        flightPage.departureSortRtrn.click();
        browser.sleep(2000);
        expect(flightPage.departureSortRtrn.getAttribute('class')).toContain('hpyBlueLt');
    });

    it('should select the first flight from the departure and return flight lists', function () {
        flightPage.onwardDateFlight.get(0).click();
        flightPage.returnDateFlight.get(0).click();

        flightPage.bookingButton.click();
        flightPage.waitForElementsVisibilityStatus(flightPage.textBox_PromoCode, true, 25000);
    });

    it('should display the option to either secure the trip or not', function () {
        flightPage.scrollToBringElementIntoView(flightPage.secureTravelRadioBox);
        browser.sleep(2000);
        expect(flightPage.secureTravelLabel.getText()).toBe("Yes, secure my trip");
        expect(flightPage.riskTravelRadioBox.isPresent()).toBe(true);
        expect(flightPage.riskTravelLabel.getText()).toBe("I am willing to risk my trip");

        flightPage.secureTravelRadioBox.click();
        flightPage.waitForElementsVisibilityStatus(flightPage.firstNameTextBox, true);
        flightPage.scrollToBringElementIntoView(flightPage.travelSecuredRadioBox);
        expect(flightPage.travelSecuredRadioBox.isPresent()).toBe(true);
    });
    
    it('should have input boxes to fill in passenger details', function () {
        flightPage.scrollToBringElementIntoView(flightPage.firstNameTextBox);
        expect(flightPage.titleDropDown.isPresent()).toBe(true);
        expect(flightPage.firstNameTextBox.isPresent()).toBe(true);
        expect(flightPage.middleNameTextBox.isPresent()).toBe(true);
        expect(flightPage.lastNameTextBox.isPresent()).toBe(true);
        expect(flightPage.emailTextBox.isPresent()).toBe(true);
        expect(flightPage.mobileNumberTextBox.isPresent()).toBe(true);
        expect(flightPage.button_Proceed.isPresent()).toBe(true);
    });

    it('should display a modal window to skip the queue after providing the details', function () {
        flightPage.selectTitle('Mr.');
        flightPage.firstNameTextBox.sendKeys('Tarang');
        flightPage.lastNameTextBox.sendKeys('Karoli');
        flightPage.emailTextBox.sendKeys('tarangtest@abc.com');
        flightPage.mobileNumberTextBox.sendKeys('2587413369');
        browser.sleep(5000);
        flightPage.button_Proceed.click();

        flightPage.waitForElementsVisibilityStatus(flightPage.modalWindowSkipQueue, true, 30000);
        expect(flightPage.button_skipQueue_OK.isDisplayed()).toBe(true);
        flightPage.button_skipQueue_OK.click();
        flightPage.waitForElementsVisibilityStatus(flightPage.label_Seats, true, 30000);
    });

    it('should show payment options after clicking on "Proceed on Payment"', function () {
        flightPage.scrollToBringElementIntoView(flightPage.button_proceedPayment);
        flightPage.button_proceedPayment.click();
        flightPage.waitForElementsVisibilityStatus(flightPage.label_noteConveniencePayment, true, 30000);

        expect(flightPage.block_PaymentOptions.count()).toEqual(7);
        //default first option for payment
        expect(flightPage.block_PaymentOptions.get(0).getText()).toContain("Debit/Credit Card");
    });
});