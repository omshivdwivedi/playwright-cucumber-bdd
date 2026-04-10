Feature: Test Login Functionality
    @TestLogin
    Scenario: Test Login Functionality
        Given user navigates to login page
        When user fill login details and click submit button
        Then user land on Dashboard page


    @Smoke
     Scenario: Test Login E2E login logout Functionality
        Given user navigates to login page
        When user fill login details and click submit button
        Then user land on Dashboard page
        And user click on user dropdown
        Then user click on logout link


        