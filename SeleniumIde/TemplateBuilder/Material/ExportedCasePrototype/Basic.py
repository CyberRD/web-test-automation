# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from argparse import RawTextHelpFormatter
import unittest, time, re, inspect, os, os.path, json, argparse


TEST_SUITE_CLASS_NAME = "__template_className__"


class __template_className__(unittest.TestCase):
    def __init__(self, driver, opts):
        super(__template_className__, self).__init__("__template_methodName__")

        self.driver_name = driver
        self.profile = TestProfile(opts['profile'], self.__class__.__name__ + '_Profile.json')
        self.wait_time = opts['wait_time']

    def setUp(self):
        self.driver = self._get_web_driver(self.driver_name)
        self.driver.implicitly_wait(30)
        self.base_url = self.profile.param("base_url", "__template_baseURL__")
        self.verificationErrors = []
        self.accept_next_alert = True

    def tearDown(self):
        self.driver.save_screenshot(self._build_screenshot_name())
        self.driver.quit()
        if self._is_successful() and not self.profile.is_profile_specified():
            self.profile.save_default_profile()

        self.assertEqual([], self.verificationErrors)

    def __template_methodName__(self):
        __template_param_getter__ = self.profile.param
        __template_receiver__ = self.driver

    # Footer

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True

    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True

    @staticmethod
    def _get_web_driver(driver_name):
        if driver_name == 'chrome':
            return webdriver.Chrome()
        elif driver_name == 'firefox':
            return webdriver.Firefox()
        elif driver_name == 'ie':
            return webdriver.Ie()
        elif driver_name == 'edge':
            return webdriver.Edge()
        elif driver_name == 'safari':
            return webdriver.Safari()
        else:
            raise ValueError

    def _is_successful(self):
        result = self._resultForDoCleanups
        return len(result.failures) == 0 and len(result.errors) == 0

    def _build_screenshot_name(self):
        png_root = os.getcwd() + os.sep
        local_time = time.strftime('%Y%m%d%H%M%S', time.localtime())
        screenshot_id = '_'.join((self.__class__.__name__,
                                  self.driver_name,
                                  self._get_profile_name(),
                                  local_time))

        return png_root + screenshot_id + '.png'

    def _get_profile_name(self):
        profile = self.profile
        fullpath = profile.profile_filename if profile.is_profile_specified() else profile.default_profile_filename
        return os.path.split(fullpath)[1]


class TestProfile:
    def __init__(self, profile_filename, default_profile_filename):
        self.profile_dict = {}
        self.profile_filename = profile_filename

        if type(default_profile_filename) is not str:
            raise TypeError
        if len(default_profile_filename) == 0:
            raise ValueError

        self.default_profile_filename = default_profile_filename

        if self.is_profile_specified():
            self.load_profile()

    def param(self, param, default_value):
        if not self.is_profile_specified():
            self.profile_dict[param] = default_value
        return self.profile_dict[param]

    def is_profile_specified(self):
        return self.profile_filename is not None

    @staticmethod
    def profile_exists_with(filename):
        return os.path.isfile(filename)

    def profile_exists(self):
        return self.profile_exists_with(filename=self.profile_filename)

    def save_profile_with(self, filename):
        with open(filename, 'w') as profile:
            json.dump(self.profile_dict, profile)

    def save_profile(self):
        self.save_profile_with(filename=self.profile_filename)

    def save_default_profile(self):
        self.save_profile_with(filename=self.default_profile_filename)

    def load_profile_with(self, filename):
        with open(filename) as profile:
            self.profile_dict = json.load(profile)

    def load_profile(self):
        self.load_profile_with(filename=self.profile_filename)


if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description='Python-Based Selenium Web Test Case for ' + TEST_SUITE_CLASS_NAME,
        formatter_class=RawTextHelpFormatter)

    group = parser.add_argument_group('options')
    group.add_argument('-p', '--profile',
                       dest='profile',
                       type=str,
                       nargs='+',
                       help='''determine file paths of test profiles;
a default profile will be generated after execution
if this option is not specified''')

    group.add_argument('-d', '--driver',
                       dest='web_driver',
                       type=str,
                       required=True,
                       help='''specify a webdriver you would like to test with,
including:
 - chrome:  Google Chrome
 - firefox: Mozilla Firefox
 - ie:      Microsoft Internet Explorer
 - edge:    Microsoft Edge (not tested yet)
 - safari:  Apple Safari (not tested yet)''')

    group.add_argument('-t', '--time-wait',
                       dest='time_in_sec',
                       type=float,
                       default=0,
                       help='''determine the waiting time in seconds (decimal)
between two steps (default: 0)''')

    args = parser.parse_args()

    test_suite_class = eval(TEST_SUITE_CLASS_NAME)
    suite = unittest.TestSuite()

    profile_list = args.profile if args.profile is not None else [None]
    for profile in profile_list:
        opts = {
            'profile': profile,
            'wait_time': args.time_in_sec
        }
        suite.addTest(test_suite_class(args.web_driver, opts))

    unittest.TextTestRunner().run(suite)
