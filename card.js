window.addEventListener("load", async function() {
    // fetch languages
    const translations = await (await fetch("translations.json")).json();

    let preferredTranslation = "en";

    // get user's most preferred languages
    for (let i = 0; i < navigator.languages.length; i++) {
        if (navigator.languages[i] in Object.keys(translations)) {
            preferredTranslation = navigator.languages[i];
        }
    }



});