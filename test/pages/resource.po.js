'use strict';

var _ = require('lodash');

function ResourcePage(resource) {
    this.resource = resource;
}

ResourcePage.prototype = {
    signInLink: element(by.id("get_sign_in")),
    signUpLink: element(by.id("get_sign_up")),
    modalWindowAuth: element(by.id("authiframe")),
    textBoxMobileNum: element(by.id("authMobile")),
    button_mobileSubmitButton: element(by.id("mobileSubmitBtn")),
    button_facebookAuth: element(by.id("authFBSignInBtn")),
    closeAuthModal: element(by.css(".popClose.icon-close")),

    flightLink: element(by.css("#header a[href='/flights/']")),
    flightIcon: element(by.css('.mainLinks .active .icon-flights')),
    hotelLink: element(by.css("#header a[href='/hotels/']")),
    goStaysLink: element(by.css("#header a[href='/gostays/']")),
    busLink: element(by.css("#header a[href='/sbus/']")),
    trainLink: element(by.css("#header a[href='/trains/']")),
    carLink: element(by.css("#header a[href='/cars/']")),
    visaLink: element(by.css("#header a[href='/visa/']")),
    moreOptionDropDown: element(by.css(".hdrMoreLink")),
    moreOptionDropDownList: element.all(by.css(".hdrMoreLink .moreSubLinks a")),

    autoSuggestDestination: element(by.css('.searchList #react-autosuggest-1-suggestion--0 .dib .mainTxt span')),
    paymentPageIcon: element(by.xpath("//a[contains(@class,'giHdrLogo')]")),

    /**
     * This method allows you to wait for an elements visibility status to change. This can be useful because sometimes
     * you might want to wait for an element to be visible or invisible before continuing automation.
     *
     * @param {webElement} webElement - The web element that you wish to check and wait for.
     * @param {boolean} isVisible - True if you wish to wait for it to be visible or false if you wish to wait for it to be invisible.
     * @param {integer} timeoutInMilliSeconds - It is an optional parameter. Yo can provide timeout in milliseconds if some
     * element requires more than 10000 milliseconds to get visible on the screen.
     * @param {boolean} isFailureAllowed - True or false depending on if failures for this call is allowed or not.
     * @param {integer} numberOfAttemptsPreviouslyMade - The number of attempts previously made to this call.
     * Normally the user does not need to pass in this value, as the number of attempts made previously is always 0.
     */
    waitForElementsVisibilityStatus: function(webElement, isVisible, timeoutInMilliSeconds, isFailureAllowed, numberOfAttemptsPreviouslyMade) {
        numberOfAttemptsPreviouslyMade = numberOfAttemptsPreviouslyMade || 0;
        var numberOfRetryAttemptsAllowed = 1;
        var timeoutBetweenRetries = 10000;
        var timeout = timeoutInMilliSeconds || 10000;
        var isFailureAllowed = isFailureAllowed || false;
        var expectedConditions = protractor.ExpectedConditions;
        var conditionToCheck = expectedConditions.visibilityOf(webElement);
        var deferred = protractor.promise.defer();
        var resolveResult = function(promiseRejectionValue) {
            if (isFailureAllowed) {
                console.log("waitForElementsVisibilityStatus: Failed to wait for element but automation will continue since failures are allowed. ");
                deferred.fulfill(true);
            } else {
                deferred.reject(promiseRejectionValue);
            }
        }.bind(this);
        if (isVisible == false)
        {
            conditionToCheck = expectedConditions.invisibilityOf(webElement);
        }
        browser.wait(conditionToCheck, timeout).then(function() {
            deferred.fulfill();
        }, function(promiseRejectionValue) {
            if (isVisible == false) {
                // We only attempt a retry if we are checking for the non-existance of an element. This is because there
                // is a rare race condition where we grab a web element to check if it exists or not (it does), but the
                // moment we try to query it, it doesn't (generates a stale webElement exception). Retrying the action
                // works as expected since now the web element doesn't exist at all anymore.
                if (numberOfAttemptsPreviouslyMade < numberOfRetryAttemptsAllowed) {
                    console.log("waitForElementsVisibilityStatus: An error occured while trying to wait for an element not to exist (Attempt " + numberOfAttemptsPreviouslyMade + ").");
                    console.log("waitForElementsVisibilityStatus: " + promiseRejectionValue);
                    browser.sleep(timeoutBetweenRetries).then(function() {
                        this.waitForElementsVisibilityStatus( webElement, isVisible, timeoutInMilliSeconds, isFailureAllowed, numberOfAttemptsPreviouslyMade + 1).then( function () {
                            deferred.fulfill(true);
                        }, function () {
                            resolveResult(promiseRejectionValue);
                        });
                    }.bind(this));
                } else {
                    console.log("waitForElementsVisibilityStatus: Giving up waiting for element not to exist.");
                    console.log("waitForElementsVisibilityStatus: " + promiseRejectionValue);
                    resolveResult(promiseRejectionValue);
                }
            } else {
                resolveResult(promiseRejectionValue);
            }
        }.bind(this));
        return deferred;
    },

    /*
    * This method is used to navigate the UI to the element in question to view
    * @params: {webElement}: webElement to bring the element into view.*/
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