'use strict';

var _ = require('lodash');

function ResourcePage(resource) {
    this.resource = resource;
}

ResourcePage.prototype = {
    flightIcon: element(by.css('.mainLinks .active .icon-flights')),
    autoSuggestDestination: element(by.css('.searchList #react-autosuggest-1-suggestion--0 .dib .mainTxt span')),
    webclickCloseButton: element(by.id('webklipper-publisher-widget-container-notification-close-div')),
    notificationFrame: element(by.id('webklipper-publisher-widget-container-notification-frame')),
    paymentPageIcon: element(by.xpath("//a[contains(@class,'giHdrLogo')]")),

    /*
      This method is used to navigate the UI
      to the element in question to view
     */
    scrollToBringElementIntoView: function(webElement) {
        return browser.executeScript('arguments[0].scrollIntoView()', webElement.getWebElement());
    },

    /*
        This method is used to navigate to the
        top of the page of the UI
    */
    scrollTop: function () {
        return browser.executeScript("window.scrollTo(0,0)");
    },

    /*
        This method is used to navigate the UI
        to the bottom of the page
    */
    scrollDown: function () {
        return browser.executeScript("window.scrollTo(0,10000)");
    },

    /*Protractor test runs are too fast to see visibly what's happening in the UI
     hence, wrote this function to highlight the element that protractor interacts with UI during execution
     */
    highlightElement: function (webElement) {
        console.log("locator---:" + webElement.locator());

        return browser.executeScript("arguments[0].setAttribute('style', arguments[1]);",webElement.getWebElement(), "color: Red; border: 4px solid red;");
    }
};

module.exports = ResourcePage;