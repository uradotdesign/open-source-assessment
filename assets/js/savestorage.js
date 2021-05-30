/**
 * javaScript saveStorage - 11.03.2020
 * Version: 1.0.0
 * Website: https://github.com/sarkhanrajabov/saveStorage-js
 * Author: Sarkhan Rajabov
 **/

function saveStorage(selector, options) {
  "use strict";

  if (typeof Storage !== "undefined") {
    let forms = document.querySelectorAll(selector);

    let initApp = function (key, excludeInputType) {
      if (localStorage.getItem(key) !== null) {
        let data = JSON.parse(localStorage.getItem(key));

        data.forEach(function (v) {
          forms.forEach((form) => {
            if (v.type !== "radio" && v.type !== "checkbox") {
              if (form.querySelector("[name=" + v.name + "]")) {
                let input = form.querySelector(
                  "[name=" + v.name + "]" + excludeInputType()
                );

                if (input !== null) {
                  input.value = v.value;
                }
              }
            } else {
              let input = form.querySelectorAll("[name=" + v.name + "]");

              input.forEach(function (el) {
                if (el.name === v.name && el.value === v.value) {
                  el.checked = true;
                }
              });
            }
          });
        });
      }
    };

    forms.forEach((form) => {
      let key = form.getAttribute("data-storage-name") + "_saveStorage",
        elements = form.querySelectorAll("input, textarea, select"),
        defaults = {
          exclude: [],
        };

      let extend = function (out) {
        out = out || {};

        for (let i = 1; i < arguments.length; i++) {
          if (!arguments[i]) continue;

          for (let key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
          }
        }

        return out;
      };

      let opts = extend({}, defaults, options);

      let excludeInputType = function () {
        let inputType = "";

        opts.exclude.forEach(function (type) {
          inputType += ":not([type=" + type + "])";
        });

        return inputType;
      };

      let serializeArray = function () {
        let serializeData = [];

        elements.forEach(function (el) {
          if (el.type !== "radio" && el.type !== "checkbox") {
            serializeData.push({
              name: el.name,
              value: el.value,
              type: el.type,
            });
          } else if (el.checked) {
            serializeData.push({
              name: el.name,
              value: el.value,
              type: el.type,
            });
          }
        });

        return serializeData;
      };

      let setLocalStorage = function () {
        let formData = JSON.stringify(serializeArray());
        localStorage.setItem(key, formData);
        initApp(key, excludeInputType);
      };

      form.addEventListener("change", function () {
        setLocalStorage();
      });

      elements.forEach(function (el) {
        el.addEventListener("keyup", function () {
          setLocalStorage();
        });
      });

      form.addEventListener("submit", function () {
        localStorage.removeItem(key);
      });

      initApp(key, excludeInputType);
    });
  } else {
    console.error("Sorry! No web storage support.");
  }
}
