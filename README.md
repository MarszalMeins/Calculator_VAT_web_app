# Clicktrans task app


## Introduction
Web page with inputs and select fields that calculate input netto value to brutto value with selected Vat percentage. Brutto value field is dynamically calculating when user enters different Netto value or changing Vat percentage. After enter everything to fields user can Submit form and send POST request to Own Nodejs server where all data is redirect to web page with seccess status.


Nodejs server: https://github.com/MarszalMeins/Clicktrans_server_task_app


## How it works
User need to enter all necessary data to send POST request to server. All input fields have own dependencies about what data is entered. All field are required and have validation messages. Validation messages appears when data is incorrect or when user click field to enter data and leaves empty. Input Netto value is disabled before user will choose value Vat percentage. Submit button will send all data if the entered data by the user are entered correctly and form dont show any validation messages.


# Prerequisites

Software used and how to install.
* npm
  ```sh
  npm install npm@latest -g
  ```



## Stay up to date with new projects
New major projects coming soon !
