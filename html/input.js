let formInputs = {};

const OpenMenu = (data) => {
    if (data == null || data == "") {
        console.log("No data detected");
        return null;
    }

    $(`.main-wrapper`).fadeIn(0);

    let form = ["<form id='qb-input-form'>", `<div class="heading">${data.header != null ? data.header : "Form Title"}</div>`];

    data.inputs.forEach((item, index) => {
        switch (item.type) {
            case "text":
                form.push(renderTextInput(item));
                break;
            case "password":
                form.push(renderPasswordInput(item));
                break;
            case "number":
                form.push(renderNumberInput(item));
                break;
            case "radio":
                form.push(renderRadioInput(item));
                break;
            case "select":
                form.push(renderSelectInput(item));
                break;
            case "checkbox":
                form.push(renderCheckboxInput(item));
                break;
            case "color":
                form.push(renderColorInput(item));
                break;
            case "slider":
                form.push(renderSliderInput(item));
                break;
            default:
                form.push(`<div class="label">${item.text}</div>`);
        }
    });
    form.push(`<div class="footer"><button type="submit" class="btn btn-success" id="submit">${data.submitText ? data.submitText : "Submit"}</button></div>`);

    form.push("</form>");

    $(".main-wrapper").html(form.join(" "));

    $("#qb-input-form").on("change", function (event) {
        if ($(event.target).attr("type") == "checkbox") {
            const value = $(event.target).is(":checked") ? "true" : "false";
            formInputs[$(event.target).attr("value")] = value;
        } else {
            formInputs[$(event.target).attr("name")] = $(event.target).val();
        }
    });

    $("#qb-input-form").on("submit", async function (event) {
        if (event != null) {
            event.preventDefault();
        }
        await $.post(`https://${GetParentResourceName()}/buttonSubmit`, JSON.stringify({ data: formInputs }));
        CloseMenu();
    });
};

const renderTextInput = (item) => {
    const { text, name } = item;
    formInputs[name] = item.default ? item.default : "";
    const isRequired = item.isRequired == "true" || item.isRequired ? "required" : "";
    const defaultValue = item.default ? `value="${item.default}"` : "";

    return ` <input placeholder="${text}" type="text" class="form-control" name="${name}" ${defaultValue} ${isRequired}/>`;
};
const renderPasswordInput = (item) => {
    const { text, name } = item;
    formInputs[name] = item.default ? item.default : "";
    const isRequired = item.isRequired == "true" || item.isRequired ? "required" : "";
    const defaultValue = item.default ? `value="${item.default}"` : "";

    return ` <input placeholder="${text}" type="password" class="form-control" name="${name}" ${defaultValue} ${isRequired}/>`;
};
const renderNumberInput = (item) => {
    try {
        const { text, name } = item;
        formInputs[name] = item.default ? item.default : "";
        const isRequired = item.isRequired == "true" || item.isRequired ? "required" : "";
        const defaultValue = item.default ? `value="${item.default}"` : "";

        return `<input placeholder="${text}" type="number" class="form-control" name="${name}" ${defaultValue} ${isRequired}/>`;
    } catch (err) {
        console.log(err);
        return "";
    }
};

const renderRadioInput = (item) => {
    const { options, name, text } = item;
    formInputs[name] = options[0].value;

    let div = `<div class="form-input-group"> <div class="form-group-title">${text}</div>`;
    div += '<div class="input-group">';
    options.forEach((option, index) => {
        div += `<label for="radio_${name}_${index}"> <input type="radio" id="radio_${name}_${index}" name="${name}" value="${option.value}"
                ${(item.default ? item.default == option.value : index == 0) ? "checked" : ""}> ${option.text}</label>`;
    });

    div += "</div>";
    div += "</div>";
    return div;
};

const renderCheckboxInput = (item) => {
    const { options, name, text } = item;

    let div = `<div class="form-input-group"> <div class="form-group-title">${text}</div>`;
    div += '<div class="input-group-chk">';

    options.forEach((option, index) => {
        div += `<label for="chk_${name}_${index}">${option.text} <input type="checkbox" id="chk_${name}_${index}" name="${name}" value="${option.value}" ${option.checked ? "checked" : ""}></label>`;
        formInputs[option.value] = option.checked ? "true" : "false";
    });

    div += "</div>";
    div += "</div>";
    return div;
};

const renderSelectInput = (item) => {
    const { options, name, text } = item;
    let div = `<div class="select-title">${text}</div>`;

    div += `<select class="form-select" name="${name}" title="${text}">`;
    formInputs[name] = options[0].value;

    options.forEach((option, index) => {
        const isDefaultValue = item.default == option.value;
        div += `<option value="${option.value}" ${isDefaultValue ? "selected" : ""}>${option.text}</option>`;
        if (isDefaultValue) {
            formInputs[name] = option.value;
        }
    });
    div += "</select>";
    return div;
};

const renderColorInput = (item) => {
    const { text, name } = item;
    formInputs[name] = item.default ? item.default : "#ffffff";
    const isRequired = item.isRequired == "true" || item.isRequired ? "required" : "";
    const defaultValue = item.default ? `value="${item.default}"` : "";
    return ` <input placeholder="${text}" type="color" class="form-control" name="${name}" ${defaultValue} ${isRequired}/>`;
};

const renderSliderInput = (item) => {
    const { text, name, min, max, step } = item;
    const minVal = min ?? 0;
    const maxVal = max ?? 100;
    const stepVal = step ?? 1;
    const defaultVal = item.default ?? minVal;
    formInputs[name] = defaultVal;
    const isRequired = item.isRequired == "true" || item.isRequired ? "required" : "";
    return `<label class="slider-group">${text}<input type="range" class="form-slider" name="${name}" min="${minVal}" max="${maxVal}" step="${stepVal}" value="${defaultVal}" ${isRequired}></label>`;
};

const CloseMenu = () => {
    $(`.main-wrapper`).fadeOut(0);
    $("#qb-input-form").remove();
    formInputs = {};
};

const SetStyle = (style) => {
    var stylesheet = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: `./styles/${style}.css`,
    });
    stylesheet.appendTo("head");
};

const CancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return CloseMenu();
};

window.addEventListener("message", (event) => {
    const data = event.data;
    const info = data.data;
    const action = data.action;
    switch (action) {
        case "SET_STYLE":
            return SetStyle(info);
        case "OPEN_INPUT":
            return OpenMenu(info);
        case "CLOSE_INPUT":
            return CloseMenu();
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        CancelMenu();
    } else if (charCode == "Enter") {
        SubmitData();
    }
};

$(document).click(function (event) {
    var $target = $(event.target);
    if (!$target.closest(".main-wrapper").length && $(".main-wrapper").is(":visible")) {
        CancelMenu();
    }
});
