//Need to figure out how to handle embedded vs. dynamic data.

{
"name": "GMail Test",
"type": "HTTP" // |Crawler. Either we are communicating directly with server through HTTP, or we are manually interacting with the crawler
"instructions": [
    {
        "type": "set",
        "input": "radio",
        "querySelector": "Radios",
        ""
        "Radios": "Option A",
        "Checkboxes": "Checkbox C",
        "Dropdown": "DropDownA",
        "Textbox": "This is freeform text"
    },
    {
        "Radios": "Option A",
        "Checkboxes": "Checkbox C",
        "Dropdown": "DropDownA",
        "Textbox": "This is freeform text"
    }
]
}

    {
        "method": "POST",
        "url": "https://docs.google.com/forms/d/e/1FAIpQLSciNkcZl6T2Tt0ZuFRre-I0hThO5QX8RWAHvaeKC6-FUf67bQ/formResponse",
        "form": "some JS object here...not JSON!" //Should notify the user of the required data structure (eg. JSON/Object, etc.)
        "callback": "whatever callback function I want" //Interface should set the call back, or callback is universal to all?
    }

//For data, remember, chances are it will all be in CSV (maybe XML) because the users are Excel centric and JSON isn't really an option.

//The instructions exist for each record in the dataset.
//