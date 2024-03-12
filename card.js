/**
 * translations loads translations from translations.json
 * @type {{hi: string, software_developer: string, machine_translation_used: string, country_flag: string, alt_text: string, flag_url: string, scan_me: string}}
 */
let translations = {};
let translationElements = {};
let jobTitle;
// Dropdown options
let selectDropdown;
// Current displayed value
let selectCurrent;
// Hidden input value
let selectInput;
// current value and flag
let currentDropdownValue;
let currentDropdownFlag;
let scanMe;
let isDropdownOpen = true;

window.addEventListener("load", async function() {
    translations = await (await fetch("translations.json")).json();

    jobTitle = document.querySelector("#job-title");

    selectDropdown = document.querySelector("#select-options");
    selectCurrent = document.querySelector("#select-current");
    selectInput = document.querySelector("#select-value");
    currentDropdownFlag = document.querySelector("#select-current>img.flag");
    currentDropdownValue = document.querySelector("#select-current>p.value");
    scanMe = document.querySelector("#scan-me");

    let preferredTranslation = "en";

    // get user's most preferred languages
    for (let i = 0; i < navigator.languages.length; i++) {
        if (navigator.languages[i] in Object.keys(translations)) {
            preferredTranslation = navigator.languages[i];
        }
    }

    renderDropdownList(preferredTranslation);

    // add event listeners
    selectDropdown.querySelectorAll(".option").forEach(
        option => option.addEventListener("click", function() {
            if (isDropdownOpen) {
                selectDropdown.classList.remove("open");
                isDropdownOpen = false;
            }

            onLanguageChange(this.dataset.lang);
        })
    );

    selectCurrent.addEventListener("click", function() {
        if (isDropdownOpen) {
            selectDropdown.classList.remove("open");
        } else {
            selectDropdown.classList.add("open");
        }

        isDropdownOpen = !isDropdownOpen;
    });
});

function renderDropdownList(defaultLang = "en") {
    for (let lang in translations) {
        let opt = document.createElement("div");
        opt.classList.add("option");
        opt.dataset.lang = lang;

        if (lang === defaultLang) {
            opt.classList.add("selected");
        }

        let img = document.createElement("img");
        img.classList.add("flag");
        img.alt = translations[lang].alt_text;
        img.src = translations[lang].flag_url;

        let p = document.createElement("p");
        p.classList.add("value");
        p.textContent = translations[lang].hi;

        opt.appendChild(img);
        opt.appendChild(p);

        selectDropdown.appendChild(opt);
    }

    onLanguageChange(defaultLang, true);
}

function onLanguageChange(lang, skipSelectedCheck = false) {
    if (!skipSelectedCheck) {
        let selected = document.querySelector(`#select-options>.option.selected`);

        if (selected) {
            selected.classList.remove("selected");
        }
    }

    const newElem = getLanguageElement(lang);

    if (newElem) {
        newElem.opt.classList.add("selected");
    }

    scanMe.textContent = translations[lang].scan_me;

    // update the input
    selectInput.value = lang;

    // update elements
    jobTitle.textContent = translations[lang].software_developer;

    // need to update the bottom element (#select-current)
    currentDropdownFlag.src = newElem.imgSrc;
    currentDropdownValue.textContent = newElem.text;
}

/**
 * Get the translation elements for a language
 * @param lang
 * @returns {{opt: Element, imgSrc: string, text: string}}
 */
function getLanguageElement(lang) {
    if (lang in translationElements) {
        return translationElements[lang];
    }

    console.log("Cache miss, creating new element.")

    let opt = document.querySelector(`.option[data-lang=${lang}]`);
    let imgSrc = opt.querySelector("img.flag").src;
    let text = opt.querySelector("p.value").textContent;

    translationElements[lang] = {
        opt,
        imgSrc,
        text
    }

    return translationElements[lang];
}