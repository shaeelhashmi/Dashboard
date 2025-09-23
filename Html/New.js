let data;
let data2 = [];
const MaleButton = document.getElementById('MaleBtn');
let functionCalled = false;
const FemaleButton = document.getElementById('FemaleBtn');
let functionCalledFemale = false;

const checkIfLists = (data) => {
    return typeof data === 'object' && !Array.isArray(data) && data !== null;
}

const DisplayList = (list, key, gender,prev) => {
    console.log(prev);
    const element = document.getElementById(key);
    let divForList = document.createElement('div');
    divForList.classList.add('colSpan2');
    divForList.id = `divForList${gender}` + key;
    element.appendChild(divForList);

    list.forEach((item) => {
        let div = document.createElement('div');
        let button = document.createElement('button');
        let paragraph = document.createElement('p');
        div.classList.add('mar');
        div.classList.add('grid');
        button.textContent = 'Submit';
        button.id = `submitButton${gender}List` + item;
        paragraph.textContent = item;
        paragraph.id = item;
        div.appendChild(paragraph);
        div.appendChild(button);
        divForList.appendChild(div);
    });
}

const readDataInsideInside = (data, key, gender) => {
    const element = document.getElementById(key);
    let divForInside = document.createElement('div');
    divForInside.classList.add('colSpan2');
    divForInside.id = `internalDiv${gender}Inside` + key;

    Object.keys(data).forEach((keyInside) => {
        let sanitizedKeyInside = sanitizeKeys(keyInside);

        let submitButton = document.createElement('button');
        submitButton.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-chevron-down-icon">
                <path d="m6 9 6 6 6-6"/>
           </svg>
        `;
        submitButton.id = `submitButton${gender}Inside` + sanitizedKeyInside;

        let div = document.createElement('div');
        div.classList.add('grid');
        div.classList.add('mar');
        div.id = `divInside${sanitizedKeyInside}`;

        let paragraph = document.createElement('p');
        paragraph.textContent = keyInside.trim();
        paragraph.id = sanitizedKeyInside;
        div.appendChild(paragraph);
        div.appendChild(submitButton);
        divForInside.appendChild(div);

        data2.push(data[keyInside]);

        if (!checkIfLists(data[keyInside])) {
            submitButton.addEventListener('click', () => {
                let existingDiv = document.getElementById(`divForList${gender}` + 'divInside' + sanitizedKeyInside);
                if (existingDiv) {
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
                DisplayList(data[keyInside], 'divInside' + sanitizedKeyInside, gender, keyInside);
            });
        } else {
            submitButton.addEventListener('click', () => {
                let existingDiv = document.getElementById(`internalDiv${gender}Inside` + 'divInside' + sanitizedKeyInside);
                if (existingDiv) {
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
                readDataInsideInside(data[keyInside], 'divInside' + sanitizedKeyInside, gender);
            });
        }
    });
    element.appendChild(divForInside);
}

const readDataInside = (data, gender) => {
    const element = document.getElementById(`internalDiv${gender}`);

    Object.keys(data).forEach((key) => {
        let sanitizedKey = sanitizeKeys(key);

        let div = document.createElement('div');
        div.classList.add('mar');
        div.classList.add('grid');
        div.id = 'div' + sanitizedKey;

        let paragraph = document.createElement('p');
        paragraph.textContent = key.trim();
        paragraph.id = sanitizedKey;

        let submitButton = document.createElement('button');
        submitButton.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-chevron-down-icon">
                <path d="m6 9 6 6 6-6"/>
           </svg>
        `;
        submitButton.id = `submitButton${gender}` + sanitizedKey;

        div.appendChild(paragraph);
        div.appendChild(submitButton);
        element.appendChild(div);

        if (!checkIfLists(data[key])) {
            submitButton.addEventListener('click', () => {
                let existingDiv = document.getElementById(`divForList${gender}` + 'div' + sanitizedKey);
                if (existingDiv) {
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
                DisplayList(data[key], 'div' + sanitizedKey, gender, key);
            });
        } else {
            submitButton.addEventListener('click', () => {
                let existingDiv = document.getElementById(`internalDiv${gender}Inside` + 'div' + sanitizedKey);
                if (existingDiv) {
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
                readDataInsideInside(data[key], 'div' + sanitizedKey, gender);
            });
        }

        data2.push(data[key]);
    });
}

const sanitizeKeys = (key) => {
    key=key.trim();
    return key.replace(/[^a-zA-Z0-9_-]+/g, '_');
}
const readData = async (gender) => {
    try {
        const response = await fetch(`categories/${gender.toLowerCase()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Response is not JSON:', text);
            return;
        }

        data = await response.json();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    readDataInside(data, gender);
}

// Male toggle
MaleButton.addEventListener('click', () => {
    let element = document.getElementById('internalDivMale');
    if (functionCalled) {
        element.innerHTML = '';
        functionCalled = false;
        return;
    }
    readData('Male');
    functionCalled = true;
});

// Female toggle
FemaleButton.addEventListener('click', () => {
    let element = document.getElementById('internalDivFemale');
    if (functionCalledFemale) {
        element.innerHTML = '';
        functionCalledFemale = false;
        return;
    }
    readData('Female');
    functionCalledFemale = true;
});
