# @sanity @textBox @2113158

# There will be changes to this test after LUI-536 is completed

Feature: LUI TextBox Basic component

  Background:
    Given I launch the LUI app
    And I navigate to 'TextBox' 'Basic' with 'Base' theme

  Scenario: Verify that TextBox Basic is displayed
    Then I verify that the 'TextBox' 'Basic' component is displayed

  Scenario: Verify the dimensions of the TextBox Basic Element
    Then I verify that the 'TextBox' 'BasicText' component is displayed
    And I verify that the 'width' of 'TextBox' 'BasicText' component is '564px'
    And I verify that the 'height' of 'TextBox' 'BasicText' component is '120px'

  Scenario: Verify the TextBox Basic content control
    When I set the 'content' to 'LUI Test' for 'TextBox' component
    Then I verify that the 'TextBox' 'BasicText' component is displayed
    And I verify that 'TextBox' 'Basic' 'Text' has text 'LUI Test'

  Scenario Outline: Verify the TextBox Basic maxLines control
    When I set the 'maxLines' to '<maxLines>' for 'TextBox' component
    Then I verify that the 'TextBox' 'BasicText' component is displayed
    And I verify that the 'height' of 'TextBox' 'BasicText' component is '<textBoxheight>px'
    Examples:
      | maxLines | textBoxheight |
      |     1    |      40.5     |
      |     2    |      81       |
      |     3    |     120       |
      |     4    |     160.5     |
      |    11    |     441       |

  Scenario Outline: Verify the TextBox Basic textColor control
    When I set the 'textColor' to '<hexValue>' for 'TextBox' component
    Then I verify that the 'TextBox' 'BasicText' component is displayed
    And I verify that 'TextBox' 'Basic' 'Text' has textColor '<color>'
    Examples:
      |   hexValue   |    color     |
      | !hex(ffff00) |  4294967040  |
      | !hex(ff0f0f) |  4294905615  |
      | !hex(0f0fff) |  4279177215  |

  # Scenario: Verify the Textbox Basic textStyle control
  # 	When I set the 'Textbox Basic' 'textStyle' control to 'display1'
  #   Then I verify that the text style of 'Textbox Basic' is 'display1'

  Scenario Outline: Verify the TextBox Basic verticalAlign control
    When I set the 'verticalAlign' to '<position>' for 'TextBox' component
    Then I verify that the 'TextBox' 'BasicText' component is displayed
    And I verify that 'TextBox' 'Basic' 'Text' has property:value 'verticalAlign:<position>'
    Examples:
      |  position  |
      |   bottom   |
      |   middle   |
      # |    top     |

  Scenario Outline: Verify the TextBox Basic wordWrap control
    When I set the 'wordWrap' to '<wordWrap>' for 'TextBox' component
    Then I verify that the 'TextBox' 'BasicText' component is displayed
    And I verify that the 'width' of 'TextBox' 'BasicText' component is '<width>px'
    And I verify that the 'height' of 'TextBox' 'BasicText' component is '<height>px'
    Examples:
      | wordWrap | width | height |
      |   true   | 564   |  120   |
      |  false   | 6081  |   40.5 |

  Scenario Outline: Verify the TextBox Basic wordWrapWidth control
    When I set the 'wordWrapWidth' to '<wordWrapWidth>' for 'TextBox' component
    Then I verify that the 'TextBox' 'BasicText' component is displayed
    And I verify that the 'width' of 'TextBox' 'BasicText' component is '<width>px'
    And I verify that the 'height' of 'TextBox' 'BasicText' component is '120px'
    Examples:
      | wordWrapWidth | width |
      |      300      |  240  |
      |      900      | 883.5 |
      |      100      |   72  |
