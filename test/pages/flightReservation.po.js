'use strict';

var _ = require('lodash');
var ResourcePage = require('./resource.po.js');

function FlightPage() {
    ResourcePage.call(this, 'flightPage');
}

FlightPage.prototype = Object.create(ResourcePage.prototype);
FlightPage.prototype.constructor = FlightPage;

var flightPageElements = {
    oneWayOptions: element(by.id("oneway")),
    roundTripOption: element(by.id('roundTrip')),
    multiCityOption: element(by.id("multiCity")),

    textBoxSource: element(by.id('gosuggest_inputSrc')),
    textBoxDestination: element(by.id('gosuggest_inputDest')),

    // dateIcon: element.all(by.css('.icon-calendar1')),
    // calenderBox: element(by.css('.DayPicker')),
    departureCalendar: element(by.id("departureCalendar")),
    returnCalendar: element(by.id("returnCalendar")),
    button_calendarMonthNext: element(by.css(".DayPicker-NavButton--next")),
    button_calendarMonthPrev: element(by.css(".DayPicker-NavButton--prev")),

    passengerSelectBox: element(by.id("pax_link_common")),
    passengerModalWindow: element(by.css(".paxMobile.paxContainer")),
    adultPassengerLabel: element(by.xpath("//label//span[contains(text(), 'Adults')]")),
    passengerDecreaseCount: element(by.id("adultPaxMinus")),
    passengerIncreaseCount: element(by.id("adultPaxPlus")),
    adultPassengerCount: element(by.id("adultPaxBox")),
    childPassengerLabel: element(by.xpath("//label//span[contains(text(), 'Children')]")),
    childPassengerDecreaseCount: element(by.id("childPaxMinus")),
    childPassengerIncreaseCount: element(by.id("childPaxPlus")),
    childPassengerCount: element(by.id("childPaxBox")),
    infantPassengerLabel: element(by.xpath("//label//span[contains(text(), 'Infant(s)')]")),
    infantPassengerDecreaseCount: element(by.id("infantPaxMinus")),
    infantPassengerIncreaseCount: element(by.id("infantPaxPlus")),
    infantPassengerCount: element(by.id("infantPaxBox")),
    travelClassLabel: element(by.xpath("//li//span[contains(text(), 'Travel Class')]")),
    travelClassSelector: element(by.id("gi_class")),

    searchButton: element(by.id('gi_search_btn')),

    locationSelectorList: element.all(by.xpath("//ul[contains(@class, 'autoSuggestBoxList')]//div[contains(@class, 'mainTxt')]")),

    onwardFlightListDeparture: element.all(by.xpath("//div[@class='fltHpyOnwrdWrp']//div[@class='marginB10']//div[contains(@data-cy, 'flightItem_')]")),
    returnFlightListDeparture: element.all(by.xpath("//div[@class='fltHpyRtrnWrp']//div[@class='marginB10']//div[contains(@data-cy, 'flightItem_')]")),

    onwardDateFlight: element.all(by.xpath("//div[@class='fltHpyOnwrdWrp']//div[@class='marginB10']//div[contains(@data-cy, 'flightItem_')]//label[contains(@for, 'radioBtn')]")),
    returnDateFlight: element.all(by.xpath("//div[@class='fltHpyRtrnWrp']//div[@class='marginB10']//div[contains(@data-cy, 'flightItem_')]//label[contains(@for, 'radioBtn')]")),

    departureSortOnwrd: element(by.css(".fltHpyOnwrdWrp #DEPARTURE span span")),
    durationSortOnwrd: element(by.css(".fltHpyOnwrdWrp #DURATION span span")),
    priceSortOnwrd: element(by.css(".fltHpyOnwrdWrp #PRICE span span")),
    arrivalSortOnwrd: element(by.css(".fltHpyOnwrdWrp #ARRIVAL span span")),

    departureSortRtrn: element(by.css(".fltHpyRtrnWrp #DEPARTURE span span")),
    durationSortRtrn: element(by.css(".fltHpyRtrnWrp #DURATION span span")),
    priceSortRtrn: element(by.css(".fltHpyRtrnWrp #PRICE span span")),
    arrivalSortRtrn: element(by.css(".fltHpyRtrnWrp #ARRIVAL span span")),

    bookingButton: element(by.xpath("//input[@value='BOOK']")),

    secureTravelLabel: element(by.css("label[for='secure-trip']")),
    secureTravelRadioBox: element(by.id("secure-trip")),
    riskTravelLabel: element(by.css("label[for='risk-trip']")),
    riskTravelRadioBox: element(by.id("risk-trip")),
    // impInfoRadioBox: element(by.id("impInfo")),
    travelSecuredRadioBox: element(by.name("insuranceRadio")),

    totalAmount: element(by.css(".fltHpyRsltCard .fltHpySumryPrc span.ico24")),
    textBox_PromoCode: element(by.id("goPromo")),

    titleDropDown: element(by.css("#Adulttitle1")),
    firstNameTextBox: element(by.id("AdultfirstName1")),
    middleNameTextBox: element(by.id("AdultmiddleName1")),
    lastNameTextBox: element(by.id("AdultlastName1")),
    emailTextBox: element(by.id("email")),
    mobileNumberTextBox: element(by.id("mobile")),

    button_Proceed: element(by.xpath("//button//div")),
    button_proceedPayment: element(by.xpath("//button//span[text()='Proceed To Payment']")),

    modalWindowSkipQueue: element(by.css(".popModal")),
    button_skipQueue_OK: element(by.css(".popModal .button")),
    label_Seats: element(by.xpath("//span[text()='Seats']")),

    label_noteConveniencePayment: element(by.id("convFeeNote")),
    block_PaymentOptions: element.all(by.css(".paymentBlk")),

    /*
    * This function selects the Travel class given the option provided
    * @params: (string) option, which takes in the chosen class type
    * If no option is provided, the default error message is displayed
    */
    selectClass: function (option) {
        switch (option) {
            case 'Economy':
                var ele = element(by.css("#gi_class option[value='E']"));
                ele.click();
                break;

            case 'Business':
                var ele = element(by.css("#gi_class option[value='B']"));
                ele.click();
                break;

            case 'First Class':
                var ele = element(by.css("#gi_class option[value='F']"));
                ele.click();
                break;

            case 'Premium Economy':
                var ele = element(by.css("#gi_class option[value='W']"));
                ele.click();
                break;

            default:
                throw ("Not a valid option");
                break
        }
    },

    /*
    * This function selects the source city from the drop down auto list.
    * @params: {string} city, the city to be selected from the drop down.
    */
    selectSourceCityFromDropDown: function (city) {
        this.textBoxSource.sendKeys(city).then(function () {
            browser.sleep('3000');
            element(by.xpath("//ul[contains(@class, 'autoSuggestBoxList')]//div[contains(@class, 'mainTxt')]//span[contains(text(), '"+ city +"')]")).click();
        });
    },

    /*
    * This function selects the destination city from the drop down auto list.
    * @params: {string} city, the city to be selected from the drop down.
    */
    selectDestinationCityFromDropDown: function (city) {
        this.textBoxDestination.sendKeys(city).then(function () {
            browser.sleep('3000');
            element(by.xpath("//ul[contains(@class, 'autoSuggestBoxList')]//div[contains(@class, 'mainTxt')]//span[contains(text(), '"+ city +"')]")).click();
        });
    },

    /*
    * This function selects the title of the passenger as selected.
    * @params: {string} Tile, the intended salutation of the passenger*/
    selectTitle: function (option) {
        switch (option) {
            case 'Mr.':
                var ele = element(by.css("#Adulttitle1 option[value='1']"));
                ele.click();
                break;

            case 'Mrs.':
                var ele = element(by.css("#Adulttitle1 option[value='2']"));
                ele.click();
                break;

            case 'Ms.':
                var ele = element(by.css("#Adulttitle1 option[value='3']"));
                ele.click();
                break;

            default:
                throw ("Not a valid Salutation option");
                break
        }
    },

    /*
    * This method lets you selects the departure date for the flight.
    * */
    getDepartureDate: function () {
        var onwDateBook = "fare_"+this.getOnwardFullDate().getFullYear() + this.getOnwMonth() + this.getOnwDate();
        var elementOnwDate = element(by.id(onwDateBook)); //Date of travel
        return elementOnwDate;
    },

    /*
    * This method returns the Return date of the travel.
    * @params: {integer} returnDays; the number of days later the return
    * ticket is to be booked from the travel date.*/
    getReturnDate: function (returnDays) {
        var retDateBook = "fare_"+this.getReturnFullDate(returnDays).getFullYear() + this.getRetMonth(returnDays) + this.getRetDate(returnDays);
        var elementRetDate = element(by.id(retDateBook)); //Date of return
        return elementRetDate;
    },

    /*
    * Below are the methods defined to get the current and the dates
    * on the later dates as it acts a the enabler method for the
    * functions getDepartureDate and getReturnDate.
    * */
    getOnwardFullDate: function() {
        return new Date(new Date().getTime()+(1*24*60*60*1000));
    },

    getReturnFullDate: function (returndays) {
        return new Date(new Date().getTime()+((returndays+1)*24*60*60*1000));
    },

    getOnwDate: function() {
        if(this.getOnwardFullDate().getDate() < 10) {
           return ('0'+ this.getOnwardFullDate().getDate());
        }
        else {return this.getOnwardFullDate().getDate();}
    },

    getRetDate: function (returnDays) {
        if(this.getReturnFullDate(returnDays).getDate() < 10) {
            return ('0'+ this.getReturnFullDate(returnDays).getDate());
        }
        else {return this.getReturnFullDate(returnDays).getDate();}
    },

    getOnwMonth: function () {
        if(this.getOnwardFullDate().getMonth() < 10) {
            return ('0'+ (this.getOnwardFullDate().getMonth() +1));
        }
        else {return (this.getOnwardFullDate().getMonth() + 1);
        }
    },
    
    getRetMonth: function (returnDays) {
        if(this.getReturnFullDate(returnDays).getMonth() < 10) {
            return ('0'+ (this.getReturnFullDate(returnDays).getMonth() +1));
        }
        else {return (this.getReturnFullDate(returnDays).getMonth() + 1);
        }
    }
};

_.assign(FlightPage.prototype, flightPageElements);
module.exports = FlightPage;