## Usage
Run `python Builder.py <exported_case_prototype> <js_for_py_container> <output_selenium_js_template>` or just execute `build_selenium_ide_template.bat`.

## Scripts

1. Builder.py

    This script puts the content of `<exported_case_prototype>` into `<js_for_py_container>` 
    and then compile it and save as `<build_selenium_ide_template>`, that is, Selenium IDE template.

    - *exported_case_prototype*: It's a prototype which will used for selenium ide to export as python unitest file.
                                 You can choose a prototype sample from `./Material/ExportedCasePrototype`,  ex: `./Material/ExportedCasePrototype/Basic.py`
    - *js_for_py_container*: A javascript for composing <exported_case_prototype>, called *container*
                             ex: `./Material/py-prototype-container.js`
    - *output_selenium_js_template*: template for selenium ide usage, ex: `../Template/selenium-python-source.js`
    
2. build_selenium_ide_template.bat
   
    This script simply executes `Builder.py` as above argument. 
