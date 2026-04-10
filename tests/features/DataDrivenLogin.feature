Feature: Test Data Driven Login Functionality
    @Test
     Scenario Outline: Enter Invalid Login details 5 timees and validate Error Message
        Given user navigates to login page
        When user enter email and password with excel row "<row_index>"
        And user click on login button
        Then validate the Error Message
        
        Examples:
            |row_index|
            |    1    |
            |    2    |
            |    3    |
            |    4    |
            |    5    |