# Web-Test-Automation

## Introduction

Through _Selenium IDE_ you are able to record web test cases and export them to _Python_ test cases.

With this script you can additionally specify different _WebDriver_,
for example, _Chrome_, _Firefox_, by passing arguments.

You can also specify a _JSON_ file as your test profile and then feed to test scripts.
By this approach, you are allowed to assign values which are necessary of the test case.

Furthermore, you could also make your test code to take screenshot(or other wrapper behaviors) after execution.
_You could refer to "Customize a template"_ for more information.


## Prerequisite

1. Selenium IDE (with Firefox of course)
2. Python 2.7
3. WebDriver executable files of interest
    - Please make sure the PATH environment variable contains your WebDriver executables paths

## Constraints

1. Currently only support _Chrome_, _Firefox_, _Internet Explorer_;
    - _Edge_ and _Safari_ have not been tested yet
2. For now you can not specify a path to store screenshots
3. _Test Suite_ is not supported yet

## Usage

1. Open _Selenium IDE_ > _Options_ > _Options_ > _Formats_
2. Click _Add_ and name it (e.g. Python: WebDriver-Configurable / Screenshot)
3. Paste template code under `selenium_ide_template\<select-a-template>` and click _Save_
    - e.g. `selenium_ide_template\selenium-python-source.js`
4. Click _OK_ (You may need to expand the window to get the button visible)
5. Export your test cases as what you just created (e.g. Python: WebDriver-Configurable / Screenshot)
6. Open your shell or command line
7. Enter `python <YOUR_TEST_CASE.py> -h` to read the usage and run tests 
8. After finishing the test cases, you will find one or more PNG files under your current directory
9. If the test data file doesn't exist, test code will generate one with values you typed when recording this test case

## Customize a Template
1. _TBD_...