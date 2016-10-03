var subScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
subScriptLoader.loadSubScript('chrome://selenium-ide/content/formats/remoteControl.js', this);
subScriptLoader.loadSubScript('chrome://selenium-ide/content/formats/webdriver.js', this);

/*
 * Formatter for Selenium 2 / WebDriver Python client.
 */

function testClassName(testName) {
  return testName.split(/[^0-9A-Za-z]+/).map(
      function(x) {
        return capitalize(x);
      }).join('');
}

function testMethodName(testName) {
  return "test_" + testName.split(/[^0-9A-Za-z]+/).map(
      function(x) {
        return underscore(x);
      }).join('');
  //return "test_" + underscore(testName);
}

function nonBreakingSpace() {
  return "u\"\\u00a0\"";
}

function string(value) {
  value = value.replace(/\\/g, '\\\\');
  value = value.replace(/\"/g, '\\"');
  value = value.replace(/\r/g, '\\r');
  value = value.replace(/\n/g, '\\n');
  var unicode = false;
  for (var i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) >= 128) {
      unicode = true;
    }
  }
  return (unicode ? 'u' : '') + '"' + value + '"';
}

function array(value) {
  var str = '[';
  for (var i = 0; i < value.length; i++) {
    str += string(value[i]);
    if (i < value.length - 1) str += ", ";
  }
  str += ']';
  return str;
}

notOperator = function() {
  return "not ";
};

Equals.prototype.toString = function() {
  return this.e1.toString() + " == " + this.e2.toString();
};

Equals.prototype.assert = function() {
  return "self.assertEqual(u" + this.e1.toString() + ", " + this.e2.toString() + ")";
};

Equals.prototype.verify = function() {
  return verify(this.assert());
};

NotEquals.prototype.toString = function() {
  return this.e1.toString() + " != " + this.e2.toString();
};

NotEquals.prototype.assert = function() {
  return "self.assertNotEqual(u" + this.e1.toString() + ", " + this.e2.toString() + ")";
};

NotEquals.prototype.verify = function() {
  return verify(this.assert());
};

function joinExpression(expression) {
  return "','.join(" + expression.toString() + ")";
}

function statement(expression) {
  return expression.toString();
}

function assignToVariable(type, variable, expression) {
  return variable + " = " + expression.toString();
}

function ifCondition(expression, callback) {
  var blk = callback().replace(/\n$/m,'');
  return "if " + expression.toString() + ":\n" + blk;
}

function assertTrue(expression) {
  return "self.assertTrue(" + expression.toString() + ")";
}

function assertFalse(expression) {
  return "self.assertFalse(" + expression.toString() + ")";
}

function verify(statement) {
  return "try: " + statement + "\n" +
      "except AssertionError as e: self.verificationErrors.append(str(e))";
}

function verifyTrue(expression) {
  return verify(assertTrue(expression));
}

function verifyFalse(expression) {
  return verify(assertFalse(expression));
}

RegexpMatch.patternAsRawString = function(pattern) {
  var str = pattern;
  if (str.match(/\"/) || str.match(/\n/)) {
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\n/g, '\\n');
    return '"' + str + '"';
  } else {
    return str = 'ur"' + str + '"';
  }
};

RegexpMatch.prototype.patternAsRawString = function() {
  return RegexpMatch.patternAsRawString(this.pattern);
};

RegexpMatch.prototype.toString = function() {
  var str = this.pattern;
  if (str.match(/\"/) || str.match(/\n/)) {
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\n/g, '\\n');
    return '"' + str + '"';
  } else {
    str = 'ur"' + str + '"';
  }
  return "re.search(" + str + ", " + this.expression + ")";
};

RegexpMatch.prototype.assert = function() {
  return 'self.assertRegexpMatches(' + this.expression + ", " + this.patternAsRawString() + ")";
};

RegexpMatch.prototype.verify = function() {
  return verify(this.assert());
};

RegexpNotMatch.prototype.patternAsRawString = function() {
  return RegexpMatch.patternAsRawString(this.pattern);
};

RegexpNotMatch.prototype.assert = function() {
  return 'self.assertNotRegexpMatches(' + this.expression + ", " + this.patternAsRawString() + ")";
};

RegexpNotMatch.prototype.verify = function() {
  return verify(this.assert());
};

function waitFor(expression) {
  return "for i in range(60):\n" +
      indents(1) + "try:\n" +
      indents(2) + "if " + expression.toString() + ": break\n" +
      indents(1) + "except: pass\n" +
      indents(1) + 'time.sleep(1)\n' +
      'else: self.fail("time out")';
}

function assertOrVerifyFailure(line, isAssert) {
  return "try: " + line + "\n" +
      "except: pass\n" +
      'else: self.fail("expected failure")';
}

function pause(milliseconds) {
  return "time.sleep(" + (parseInt(milliseconds, 10) / 1000) + ")";
}

function echo(message) {
  return "print(" + xlateArgument(message) + ")";
}

function formatComment(comment) {
  return comment.comment.replace(/.+/mg, function(str) {
    return "# " + str;
  });
}

function keyVariable(key) {
  return "Keys." + key;
}

this.sendKeysMaping = {
  BKSP: "BACK_SPACE",
  BACKSPACE: "BACK_SPACE",
  TAB: "TAB",
  ENTER: "ENTER",
  SHIFT: "SHIFT",
  CONTROL: "CONTROL",
  CTRL: "CONTROL",
  ALT: "ALT",
  PAUSE: "PAUSE",
  ESCAPE: "ESCAPE",
  ESC: "ESCAPE",
  SPACE: "SPACE",
  PAGE_UP: "PAGE_UP",
  PGUP: "PAGE_UP",
  PAGE_DOWN: "PAGE_DOWN",
  PGDN: "PAGE_DOWN",
  END: "END",
  HOME: "HOME",
  LEFT: "LEFT",
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  INSERT: "INSERT",
  INS: "INSERT",
  DELETE: "DELETE",
  DEL: "DELETE",
  SEMICOLON: "SEMICOLON",
  EQUALS: "EQUALS",

  NUMPAD0: "NUMPAD0",
  N0: "NUMPAD0",
  NUMPAD1: "NUMPAD1",
  N1: "NUMPAD1",
  NUMPAD2: "NUMPAD2",
  N2: "NUMPAD2",
  NUMPAD3: "NUMPAD3",
  N3: "NUMPAD3",
  NUMPAD4: "NUMPAD4",
  N4: "NUMPAD4",
  NUMPAD5: "NUMPAD5",
  N5: "NUMPAD5",
  NUMPAD6: "NUMPAD6",
  N6: "NUMPAD6",
  NUMPAD7: "NUMPAD7",
  N7: "NUMPAD7",
  NUMPAD8: "NUMPAD8",
  N8: "NUMPAD8",
  NUMPAD9: "NUMPAD9",
  N9: "NUMPAD9",
  MULTIPLY: "MULTIPLY",
  MUL: "MULTIPLY",
  ADD: "ADD",
  PLUS: "ADD",
  SEPARATOR: "SEPARATOR",
  SEP: "SEPARATOR",
  SUBTRACT: "SUBTRACT",
  MINUS: "SUBTRACT",
  DECIMAL: "DECIMAL",
  PERIOD: "DECIMAL",
  DIVIDE: "DIVIDE",
  DIV: "DIVIDE",

  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",

  META: "META",
  COMMAND: "COMMAND"
};

function defaultExtension() {
  return this.options.defaultExtension;
}

this.options = {
  receiver: "driver",
  showSelenese: 'false',
  rcHost: "localhost",
  rcPort: "4444",
  environment: "*chrome",
  header: 
	'# -*- coding: utf-8 -*-\n' + 
	'from selenium import webdriver\n' + 
	'from selenium.webdriver.common.by import By\n' + 
	'from selenium.webdriver.common.keys import Keys\n' + 
	'from selenium.webdriver.support.ui import Select\n' + 
	'from selenium.common.exceptions import NoSuchElementException\n' + 
	'from selenium.common.exceptions import NoAlertPresentException\n' + 
	'from argparse import RawTextHelpFormatter\n' + 
	'import unittest, time, re, inspect, os, os.path, json, argparse\n' + 
	'\n' + 
	'\n' + 
	'TEST_SUITE_CLASS_NAME = "${className}"\n' + 
	'\n' + 
	'\n' + 
	'class ${className}(unittest.TestCase):\n' + 
	'    def __init__(self, driver, opts):\n' + 
	'        super(${className}, self).__init__("${methodName}")\n' + 
	'\n' + 
	'        self.driver_name = driver\n' + 
	'        self.profile = TestProfile(opts[\'profile\'], self.__class__.__name__ + \'_Profile.json\')\n' + 
	'        self.wait_time = opts[\'wait_time\']\n' + 
	'\n' + 
	'    def setUp(self):\n' + 
	'        self.driver = self._get_web_driver(self.driver_name)\n' + 
	'        self.driver.implicitly_wait(30)\n' + 
	'        self.base_url = self.profile.param("base_url", "${baseURL}")\n' + 
	'        self.verificationErrors = []\n' + 
	'        self.accept_next_alert = True\n' + 
	'\n' + 
	'    def tearDown(self):\n' + 
	'        self.driver.save_screenshot(self._build_screenshot_name())\n' + 
	'        self.driver.quit()\n' + 
	'        if self._is_successful() and not self.profile.is_profile_specified():\n' + 
	'            self.profile.save_default_profile()\n' + 
	'\n' + 
	'        self.assertEqual([], self.verificationErrors)\n' + 
	'\n' + 
	'    def ${methodName}(self):\n' + 
	'        param = self.profile.param\n' + 
	'        ${receiver} = self.driver\n' + 
	'',
  footer: 
	'\n' + 
	'    def is_element_present(self, how, what):\n' + 
	'        try: self.driver.find_element(by=how, value=what)\n' + 
	'        except NoSuchElementException as e: return False\n' + 
	'        return True\n' + 
	'\n' + 
	'    def is_alert_present(self):\n' + 
	'        try: self.driver.switch_to_alert()\n' + 
	'        except NoAlertPresentException as e: return False\n' + 
	'        return True\n' + 
	'\n' + 
	'    def close_alert_and_get_its_text(self):\n' + 
	'        try:\n' + 
	'            alert = self.driver.switch_to_alert()\n' + 
	'            alert_text = alert.text\n' + 
	'            if self.accept_next_alert:\n' + 
	'                alert.accept()\n' + 
	'            else:\n' + 
	'                alert.dismiss()\n' + 
	'            return alert_text\n' + 
	'        finally: self.accept_next_alert = True\n' + 
	'\n' + 
	'    @staticmethod\n' + 
	'    def _get_web_driver(driver_name):\n' + 
	'        if driver_name == \'chrome\':\n' + 
	'            return webdriver.Chrome()\n' + 
	'        elif driver_name == \'firefox\':\n' + 
	'            return webdriver.Firefox()\n' + 
	'        elif driver_name == \'ie\':\n' + 
	'            return webdriver.Ie()\n' + 
	'        elif driver_name == \'edge\':\n' + 
	'            return webdriver.Edge()\n' + 
	'        elif driver_name == \'safari\':\n' + 
	'            return webdriver.Safari()\n' + 
	'        else:\n' + 
	'            raise ValueError\n' + 
	'\n' + 
	'    def _is_successful(self):\n' + 
	'        result = self._resultForDoCleanups\n' + 
	'        return len(result.failures) == 0 and len(result.errors) == 0\n' + 
	'\n' + 
	'    def _build_screenshot_name(self):\n' + 
	'        png_root = os.getcwd() + os.sep\n' + 
	'        local_time = time.strftime(\'%Y%m%d%H%M%S\', time.localtime())\n' + 
	'        screenshot_id = \'_\'.join((self.__class__.__name__,\n' + 
	'                                  self.driver_name,\n' + 
	'                                  self._get_profile_name(),\n' + 
	'                                  local_time))\n' + 
	'\n' + 
	'        return png_root + screenshot_id + \'.png\'\n' + 
	'\n' + 
	'    def _get_profile_name(self):\n' + 
	'        profile = self.profile\n' + 
	'        fullpath = profile.profile_filename if profile.is_profile_specified() else profile.default_profile_filename\n' + 
	'        return os.path.split(fullpath)[1]\n' + 
	'\n' + 
	'\n' + 
	'class TestProfile:\n' + 
	'    def __init__(self, profile_filename, default_profile_filename):\n' + 
	'        self.profile_dict = {}\n' + 
	'        self.profile_filename = profile_filename\n' + 
	'\n' + 
	'        if type(default_profile_filename) is not str:\n' + 
	'            raise TypeError\n' + 
	'        if len(default_profile_filename) == 0:\n' + 
	'            raise ValueError\n' + 
	'\n' + 
	'        self.default_profile_filename = default_profile_filename\n' + 
	'\n' + 
	'        if self.is_profile_specified():\n' + 
	'            self.load_profile()\n' + 
	'\n' + 
	'    def param(self, param, default_value):\n' + 
	'        if not self.is_profile_specified():\n' + 
	'            self.profile_dict[param] = default_value\n' + 
	'        return self.profile_dict[param]\n' + 
	'\n' + 
	'    def is_profile_specified(self):\n' + 
	'        return self.profile_filename is not None\n' + 
	'\n' + 
	'    @staticmethod\n' + 
	'    def profile_exists_with(filename):\n' + 
	'        return os.path.isfile(filename)\n' + 
	'\n' + 
	'    def profile_exists(self):\n' + 
	'        return self.profile_exists_with(filename=self.profile_filename)\n' + 
	'\n' + 
	'    def save_profile_with(self, filename):\n' + 
	'        with open(filename, \'w\') as profile:\n' + 
	'            json.dump(self.profile_dict, profile)\n' + 
	'\n' + 
	'    def save_profile(self):\n' + 
	'        self.save_profile_with(filename=self.profile_filename)\n' + 
	'\n' + 
	'    def save_default_profile(self):\n' + 
	'        self.save_profile_with(filename=self.default_profile_filename)\n' + 
	'\n' + 
	'    def load_profile_with(self, filename):\n' + 
	'        with open(filename) as profile:\n' + 
	'            self.profile_dict = json.load(profile)\n' + 
	'\n' + 
	'    def load_profile(self):\n' + 
	'        self.load_profile_with(filename=self.profile_filename)\n' + 
	'\n' + 
	'\n' + 
	'if __name__ == "__main__":\n' + 
	'\n' + 
	'    parser = argparse.ArgumentParser(\n' + 
	'        description=\'Python-Based Selenium Web Test Case for \' + TEST_SUITE_CLASS_NAME,\n' + 
	'        formatter_class=RawTextHelpFormatter)\n' + 
	'\n' + 
	'    group = parser.add_argument_group(\'options\')\n' + 
	'    group.add_argument(\'-p\', \'--profile\',\n' + 
	'                       dest=\'profile\',\n' + 
	'                       type=str,\n' + 
	'                       nargs=\'+\',\n' + 
	'                       help=\'\'\'determine file paths of test profiles;\n' + 
	'a default profile will be generated after execution\n' + 
	'if this option is not specified\'\'\')\n' + 
	'\n' + 
	'    group.add_argument(\'-d\', \'--driver\',\n' + 
	'                       dest=\'web_driver\',\n' + 
	'                       type=str,\n' + 
	'                       required=True,\n' + 
	'                       help=\'\'\'specify a webdriver you would like to test with,\n' + 
	'including:\n' + 
	' - chrome:  Google Chrome\n' + 
	' - firefox: Mozilla Firefox\n' + 
	' - ie:      Microsoft Internet Explorer\n' + 
	' - edge:    Microsoft Edge (not tested yet)\n' + 
	' - safari:  Apple Safari (not tested yet)\'\'\')\n' + 
	'\n' + 
	'    group.add_argument(\'-t\', \'--time-wait\',\n' + 
	'                       dest=\'time_in_sec\',\n' + 
	'                       type=float,\n' + 
	'                       default=0,\n' + 
	'                       help=\'\'\'determine the waiting time in seconds (decimal)\n' + 
	'between two steps (default: 0)\'\'\')\n' + 
	'\n' + 
	'    args = parser.parse_args()\n' + 
	'\n' + 
	'    test_suite_class = eval(TEST_SUITE_CLASS_NAME)\n' + 
	'    suite = unittest.TestSuite()\n' + 
	'\n' + 
	'    profile_list = args.profile if args.profile is not None else [None]\n' + 
	'    for profile in profile_list:\n' + 
	'        opts = {\n' + 
	'            \'profile\': profile,\n' + 
	'            \'wait_time\': args.time_in_sec\n' + 
	'        }\n' + 
	'        suite.addTest(test_suite_class(args.web_driver, opts))\n' + 
	'\n' + 
	'    unittest.TextTestRunner().run(suite)\n' + 
	'',
  indent:  '4',
  initialIndents: '2',
  defaultExtension: "py"
};

function retrieveIdOrName(ref) {
    if (ref.indexOf('find_element_by_id') != -1
        || ref.indexOf('find_element_by_name') != -1) {
        return ref.substring(ref.indexOf('\"') + 1, ref.lastIndexOf('\"'));
    }

    throw "Cannot find id or name from: " + ref;
}


this.configForm =
    '<description>Variable for Selenium instance</description>' +
        '<textbox id="options_receiver" />' +
        '<description>Selenium RC host</description>' +
        '<textbox id="options_rcHost" />' +
        '<description>Selenium RC port</description>' +
        '<textbox id="options_rcPort" />' +
        '<description>Environment</description>' +
        '<textbox id="options_environment" />' +
        '<description>Header</description>' +
        '<textbox id="options_header" multiline="true" flex="1" rows="4"/>' +
        '<description>Footer</description>' +
        '<textbox id="options_footer" multiline="true" flex="1" rows="4"/>' +
        '<description>Indent</description>' +
        '<menulist id="options_indent"><menupopup>' +
        '<menuitem label="Tab" value="tab"/>' +
        '<menuitem label="1 space" value="1"/>' +
        '<menuitem label="2 spaces" value="2"/>' +
        '<menuitem label="3 spaces" value="3"/>' +
        '<menuitem label="4 spaces" value="4"/>' +
        '<menuitem label="5 spaces" value="5"/>' +
        '<menuitem label="6 spaces" value="6"/>' +
        '<menuitem label="7 spaces" value="7"/>' +
        '<menuitem label="8 spaces" value="8"/>' +
        '</menupopup></menulist>' +
        '<checkbox id="options_showSelenese" label="Show Selenese"/>';

this.name = "Python (WebDriver)";
this.testcaseExtension = ".py";
this.suiteExtension = ".py";
this.webdriver = true;

WDAPI.Driver = function() {
  this.ref = options.receiver;
};

WDAPI.Driver.searchContext = function(locatorType, locator) {
  var locatorString = xlateArgument(locator);
  switch (locatorType) {
    case 'xpath':
      return '_by_xpath(' + locatorString;
    case 'css':
      return '_by_css_selector(' + locatorString;
    case 'id':
      return '_by_id(' + locatorString;
    case 'link':
      return '_by_link_text(' + locatorString;
    case 'name':
      return '_by_name(' + locatorString;
    case 'tag_name':
      return '_by_tag_name(' + locatorString;
  }
  throw 'Error: unknown strategy [' + locatorType + '] for locator [' + locator + ']';
};

WDAPI.Driver.searchContextArgs = function(locatorType, locator) {
  var locatorString = xlateArgument(locator);
  switch (locatorType) {
    case 'xpath':
      return 'By.XPATH, ' + locatorString;
    case 'css':
      return 'By.CSS_SELECTOR, ' + locatorString;
    case 'id':
      return 'By.ID, ' + locatorString;
    case 'link':
      return 'By.LINK_TEXT, ' + locatorString;
    case 'name':
      return 'By.NAME, ' + locatorString;
    case 'tag_name':
      return 'By.TAG_NAME, ' + locatorString;
  }
  throw 'Error: unknown strategy [' + locatorType + '] for locator [' + locator + ']';
};

WDAPI.Driver.prototype.back = function() {
  return this.ref + ".back()\n" + stepWait();
};

WDAPI.Driver.prototype.close = function() {
  return this.ref + ".close()";
};

WDAPI.Driver.prototype.findElement = function(locatorType, locator) {
  return new WDAPI.Element(this.ref + ".find_element" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.findElements = function(locatorType, locator) {
  return new WDAPI.ElementList(this.ref + ".find_elements" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.getCurrentUrl = function() {
  return this.ref + ".current_url";
};

WDAPI.Driver.prototype.get = function(url) {
  if (url.length > 1 && (url.substring(1,8) == "http://" || url.substring(1,9) == "https://")) { // url is quoted
    return this.ref + ".get(" + url + ")";
  } else {
    return this.ref + ".get(self.base_url + " + url + ")";
  }
};

WDAPI.Driver.prototype.getTitle = function() {
  return this.ref + ".title";
};

WDAPI.Driver.prototype.getAlert = function() {
  return "self.close_alert_and_get_its_text()";
};

WDAPI.Driver.prototype.chooseOkOnNextConfirmation = function() {
  return "self.accept_next_alert = True";
};

WDAPI.Driver.prototype.chooseCancelOnNextConfirmation = function() {
  return "self.accept_next_alert = False";
};

WDAPI.Driver.prototype.refresh = function() {
  return this.ref + ".refresh()";
};

WDAPI.Element = function(ref) {
  this.ref = ref;
};

WDAPI.Element.prototype.clear = function() {
  return this.ref + ".clear()";
};

WDAPI.Element.prototype.click = function() {
  return this.ref + ".click()\n" + stepWait();
};

WDAPI.Element.prototype.getAttribute = function(attributeName) {
  return this.ref + ".get_attribute(" + xlateArgument(attributeName) + ")";
};

WDAPI.Element.prototype.getText = function() {
  return this.ref + ".text";
};

WDAPI.Element.prototype.isDisplayed = function() {
  return this.ref + ".is_displayed()";
};

WDAPI.Element.prototype.isSelected = function() {
  return this.ref + ".is_selected()";
};

WDAPI.Element.prototype.sendKeys = function(text) {
  var key = retrieveIdOrName(this.ref);
  return this.ref + ".send_keys(param(\"" + key + "\", " + xlateArgument(text, 'args') + "))\n" + stepWait();
};

WDAPI.Element.prototype.submit = function() {
  return this.ref + ".submit()\n" + stepWait();
};

WDAPI.Element.prototype.select = function(selectLocator) {
  var key = retrieveIdOrName(this.ref);
  if (selectLocator.type == 'index') {
    return "Select(" + this.ref + ").select_by_index(param(\"" + key + "\", " + selectLocator.string + "))\n" + stepWait();
  }
  if (selectLocator.type == 'value') {
    return "Select(" + this.ref + ").select_by_value(param(\"" + key + "\", " + xlateArgument(selectLocator.string) + "))\n" + stepWait();
  }
  return "Select(" + this.ref + ").select_by_visible_text(param(\"" + key + "\", " + xlateArgument(selectLocator.string) + "))\n" + stepWait();
};

WDAPI.ElementList = function(ref) {
  this.ref = ref;
};

WDAPI.ElementList.prototype.getItem = function(index) {
  return this.ref + "[" + index + "]";
};

WDAPI.ElementList.prototype.getSize = function() {
  return 'len(' + this.ref + ")";
};

WDAPI.ElementList.prototype.isEmpty = function() {
  return 'len(' + this.ref + ") == 0";
};


WDAPI.Utils = function() {
};

WDAPI.Utils.isElementPresent = function(how, what) {
  return "self.is_element_present(" + WDAPI.Driver.searchContextArgs(how, what) + ")";
};

WDAPI.Utils.isAlertPresent = function() {
  return "self.is_alert_present()";
};

function stepWait() {
  return "time.sleep(self.wait_time)";
}