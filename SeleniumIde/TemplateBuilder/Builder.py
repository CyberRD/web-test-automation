# -*- coding: utf-8 -*-
import sys

PYTHON_TEMPLATE_MAP = {
    '__template_className__': '${className}',
    '__template_methodName__': '${methodName}',
    '__template_baseURL__': '${baseURL}',
    '__template_receiver__': '${receiver}',
    '__template_param_getter__': 'param'
}

TEMPLATE_PLACEHOLDER = '\n    # Footer\n'

if len(sys.argv) != 4:

    print '''Run `python Builder.py <exported_case_prototype> <js_for_py_container> <output_selenium_js_template>` or just execute `build_selenium_ide_template.bat`.

    This script puts the content of `<exported_case_prototype>` into `<js_for_py_container>`
    and then compile it and save as `<build_selenium_ide_template>`, that is, Selenium IDE template.

    - <exported_case_prototype>: It's a prototype which will used for selenium ide to export as python unitest file.
                                 You can choose a prototype sample from `./Material/ExportedCasePrototype`,  ex: `./Material/ExportedCasePrototype/Basic.py`
    - <js_for_py_container>: A javascript for composing <exported_case_prototype>, called *container*
                             ex: `./Material/py-prototype-container.js`
    - <output_selenium_js_template>: template for selenium ide usage, ex: `../Template/selenium-python-source.js`'''
    exit(0)

python_template_filename = sys.argv[1]
js_template_filename = sys.argv[2]
js_output_filename = sys.argv[3]

with open(python_template_filename) as python_template_file:
    python_template = python_template_file.read()

for attr in PYTHON_TEMPLATE_MAP.keys():
    print attr + ': ' + PYTHON_TEMPLATE_MAP[attr]
    python_template = python_template.replace(attr, PYTHON_TEMPLATE_MAP[attr])

header, footer = python_template.split(TEMPLATE_PLACEHOLDER)

print header, '\n---'
print footer


JS_TEMPLATE_MAP = {
    '${python_header}': '\n\t\'' + header.replace('\'', '\\\'').replace('\n', '\\n\' + \n\t\'') + '\'',
    '${python_footer}': '\n\t\'' + footer.replace('\'', '\\\'').replace('\n', '\\n\' + \n\t\'') + '\'',
    '${param_getter}': PYTHON_TEMPLATE_MAP['__template_param_getter__'],
    '${pause_sec}': 'self.wait_time'
}

with open(js_template_filename) as js_template_file:
    js_template = js_template_file.read()

for attr in JS_TEMPLATE_MAP.keys():
    js_template = js_template.replace(attr, JS_TEMPLATE_MAP[attr])

print js_template

with open(js_output_filename, 'w') as js_output_file:
    js_output_file.write(js_template)
