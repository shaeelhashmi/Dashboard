

let data;
let data2 = [];
const MaleButton = document.getElementById('MaleBtn');
let functionCalled = false;
const FemaleButton = document.getElementById('FemaleBtn');
let functionCalledFemale = false;

const checkIfLists = (data) => {
    return typeof data === 'object' && !Array.isArray(data) && data !== null;
}
//Hovering
// const hoverEffectWithList = (element,list,prev,gender) => {
//     if (document.getElementById('hoverDiv'+element.id))
//     {
//         return;
//     }
//     const div = document.createElement('div');
//     div.classList.add('hoverDiv');
//     div.id = 'hoverDiv'+element.id;
//     list.forEach(async(item) => {
//         let innerDiv = document.createElement('div');
//         innerDiv.classList.add('grid')
//          let button = document.createElement('a');
//         const p = document.createElement('p');
//         p.classList.add('mar');
//         p.textContent = item;
//         innerDiv.appendChild(p);
//         button.textContent = 'View more';
//         button.id = `submitButton${element.id}${sanitizeKeys(item)}`;
//         try
//         {
//             const data={
//                 sub_item:sanitizeKeys(prev),
//                 item:sanitizeKeys(item),
//                 gender:sanitizeKeys(gender)
//             }
//             const response= await fetch('products/exists',{
//                 method:'POST',
//                 headers:{
//                     'Content-Type':'application/json'
//                 },
//                 body:JSON.stringify(data)
//             });
//             const result=await response.json();
//            if (!result.exists)
//            {
//                button.classList.add('disabledButton');
//                button.textContent='Not Available';
//            }
//         }
//         catch(e){
//             console.error('Error fetching product existence:',e);

//         }
//         button.href = `/data/?sub_item=${sanitizeKeys(prev)}&item=${sanitizeKeys(item)}&gender=${gender}`;
//         innerDiv.appendChild(button);
//         innerDiv.classList.add('my-4')
//         div.appendChild(innerDiv);
//     });
//     element.appendChild(div);
// }
// const HoverEffectWithoutList = (element, data, gender) => {
//     // Avoid duplicating hover div
//     if (document.getElementById('hoverDiv' + element.id)) {
//         return;
//     }

//     const divForInside = document.createElement('div');
//     divForInside.classList.add('hoverDiv'); 
//     divForInside.id = 'hoverDiv' + element.id;

//     Object.keys(data).forEach((keyInside) => {
//         let sanitizedKeyInside = sanitizeKeys(keyInside);

//         let innerDiv = document.createElement('div');
//         innerDiv.classList.add('grid', 'mar');
//         innerDiv.id = `${gender}hoverInside${sanitizedKeyInside}`;

//         let paragraph = document.createElement('p');
//         paragraph.textContent = keyInside.trim();
//         paragraph.id = `${gender}${sanitizedKeyInside}`;
//         innerDiv.classList.add('my-4')
//         innerDiv.appendChild(paragraph);
//         let button = document.createElement('button');
//         button.innerHTML = `
//            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
//                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down">
//                 <path d="m6 9 6 6 6-6"/>
//               </svg>
//         `;
//         // If next level is a list
//         if (!checkIfLists(data[keyInside])) {
//             innerDiv.addEventListener('mouseover', () => {
//                 hoverEffectWithList(innerDiv, data[keyInside], keyInside, gender);
//             });
//             innerDiv.addEventListener('mouseout', () => {
//                 let hoverDiv = document.getElementById('hoverDiv' + innerDiv.id);
//                 if (hoverDiv && !innerDiv.matches(':hover')) {
//                     hoverDiv.remove();
//                 }
//             });
//         } else {
//             // Recursive hover for deeper objects
//             innerDiv.addEventListener('mouseover', () => {
//                 HoverEffectWithoutList(innerDiv, data[keyInside], gender);
//             });
//             innerDiv.addEventListener('mouseout', () => {
//                 let hoverDiv = document.getElementById('hoverDiv' + innerDiv.id);
//                 if (hoverDiv && !innerDiv.matches(':hover')) {
//                     hoverDiv.remove();
//                 }
//             });
//         }
//         innerDiv.appendChild(button);
//         divForInside.appendChild(innerDiv);
//     });

//     element.appendChild(divForInside);
// };


//Clicking
const DisplayList = (list, key, gender, prev) => {
    const element = document.getElementById("outergrid");
    let divForList = document.createElement('div');
    divForList.classList.add('removeDiv');
    divForList.id = `divForList${gender}${key}`;
    element.appendChild(divForList);

    list.forEach(async (item) => {
        let div = document.createElement('div');
        let button = document.createElement('a');
        let paragraph = document.createElement('p');
        div.classList.add('mar', 'grid','my-4');
        button.textContent = 'View more';
        button.id = `submitButton${gender}List${sanitizeKeys(item)}`;
        try
        {
            const data={
                sub_item:sanitizeKeys(prev),
                item:sanitizeKeys(item),
                gender:sanitizeKeys(gender)
            }
            const response= await fetch('products/exists',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            });
            const result=await response.json();
           if (!result.exists)
           {
               button.classList.add('disabledButton');
               button.textContent='Not Available';
           }
        }
        catch(e){
            console.error('Error fetching product existence:',e);

        }

        button.href = `/data/?sub_item=${sanitizeKeys(prev)}&item=${sanitizeKeys(item)}&gender=${gender}`;
        paragraph.textContent = item;
        paragraph.id = `${gender}${sanitizeKeys(item)}`;
        div.appendChild(paragraph);
        div.appendChild(button);
        divForList.appendChild(div);
    });
}

const readDataInsideInside = (data, key, gender) => {
    const element = document.getElementById("outergrid");
    let divForInside = document.createElement('div');
    divForInside.classList.add('removeDiv1');
    divForInside.id = `internalDiv${gender}Inside${key}`;

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
        submitButton.id = `submitButton${gender}Inside${sanitizedKeyInside}`;

        let div = document.createElement('div');
        div.classList.add('grid', 'mar');
        div.id = `${gender}divInside${sanitizedKeyInside}`;

        let paragraph = document.createElement('p');
        paragraph.textContent = keyInside.trim();
        paragraph.id = `${gender}${sanitizedKeyInside}`;
        div.appendChild(paragraph);
        div.appendChild(submitButton);
        divForInside.appendChild(div);
        div.classList.add('my-4')
        data2.push(data[keyInside]);

        if (!checkIfLists(data[keyInside])) {
            submitButton.addEventListener('click', () => {
                let existingDiv = document.getElementById(`divForList${gender}${gender}divInside${sanitizedKeyInside}`);
                let existingDivs = document.getElementsByClassName('removeDiv');
                let currentRow=document.getElementById(`internalDiv${gender}Inside${key}`);
                 let nextRow = currentRow.nextElementSibling;
    if (nextRow) {
        nextRow.remove();
    }
                RotateInternalSvg(`internalDiv${gender}Inside${key}`,`${gender}divInside${sanitizedKeyInside}`);
                let svg = div.querySelector('svg');
                svg.style.transform = 'rotate(90deg)';
                Array.from(existingDivs).forEach(div => div.remove());
                if (existingDiv) {
                    svg.style.transform = 'rotate(0deg)';
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
               
                DisplayList(data[keyInside], `${gender}divInside${sanitizedKeyInside}`, gender, keyInside);
            });
        } else {
            submitButton.addEventListener('click', () => {
                
                let existingDiv = document.getElementById(`internalDiv${gender}Inside${gender}divInside${sanitizedKeyInside}`);
                let existingDivs = document.getElementsByClassName('removeDiv');
                RotateInternalSvg(`internalDiv${gender}Inside${key}`,`${gender}divInside${sanitizedKeyInside}`);
                let svg = div.querySelector('svg');
                svg.style.transform = 'rotate(90deg)';
                let existingDivsInside = document.getElementsByClassName('removeDiv1');
                Array.from(existingDivsInside).forEach(div => {
                    if (div.id !== `internalDiv${gender}Inside${key}`) {
                        div.remove();
                    }
                });
                Array.from(existingDivs).forEach(div => div.remove());
                if (existingDiv) {
                     svg.style.transform = 'rotate(0deg)';
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
                readDataInsideInside(data[keyInside], `${gender}divInside${sanitizedKeyInside}`, gender);
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
        div.classList.add('mar', 'grid','relative');
        div.id = `${gender}div${sanitizedKey}`;


        let paragraph = document.createElement('p');
        paragraph.textContent = key.trim();
        paragraph.id = `${gender}${sanitizedKey}`;

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
        submitButton.id = `submitButton${gender}${sanitizedKey}`;

        div.appendChild(paragraph);
        div.appendChild(submitButton);
        div.classList.add('my-2')
        element.appendChild(div);
        //Hover effects
        
        //End hover effects
        if (!checkIfLists(data[key])) {
            div.addEventListener('mouseover', () => {
                hoverEffectWithList(div, data[key],key,gender);
        });
        div.addEventListener('mouseout', () => {
           let element=document.getElementById('hoverDiv'+div.id);
            if (element && !div.matches(':hover')) {
                element.remove();
            }    });
            submitButton.addEventListener('click', () => {
                let existingDiv = document.getElementById(`divForList${gender}${gender}div${sanitizedKey}`);
                let divs=document.getElementsByClassName('removeDiv1');
                let divs2=document.getElementsByClassName('removeDiv');
                RotateInternalSvg(`internalDiv${gender}`,`${gender}div${sanitizedKey}`)
                let svg = div.querySelector('svg');
                svg.style.transform = 'rotate(90deg)';
                Array.from(divs2).forEach(div=>div.remove());
                Array.from(divs).forEach(div=>div.remove());
                if (existingDiv) {
                     svg.style.transform = 'rotate(0deg)';
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
                DisplayList(data[key], `${gender}div${sanitizedKey}`, gender, key);
            });
        } else {
            div.addEventListener('mouseover', () => {
                HoverEffectWithoutList(div, data[key], gender);
            });
            div.addEventListener('mouseout', () => {
                let element=document.getElementById('hoverDiv'+div.id);
                if (element && !div.matches(':hover')) {
                    element.remove();
                }    });
                
            submitButton.addEventListener('click', () => {
                let existingDiv = document.getElementById(`internalDiv${gender}Inside${gender}div${sanitizedKey}`);
                 RotateInternalSvg(`internalDiv${gender}`,`${gender}div${sanitizedKey}`)
                let svg = div.querySelector('svg');
                svg.style.transform = 'rotate(90deg)';
                let divs=document.getElementsByClassName('removeDiv1');
                  let divs2=document.getElementsByClassName('removeDiv');
                Array.from(divs2).forEach(div=>div.remove());
                Array.from(divs).forEach(div=>div.remove());
                if (existingDiv) {
                    svg.style.transform = 'rotate(0deg)';
                    existingDiv.classList.toggle('scaledZero');
                    return;
                }
                readDataInsideInside(data[key], `${gender}div${sanitizedKey}`, gender);
            });
        }

        data2.push(data[key]);
    });
}
const RotateInternalSvg = (id,currentElement) =>{
    const outerElement=document.getElementById(id);
    let divs=outerElement.querySelectorAll("div");
    divs.forEach(div=>{
        if (div.id!==currentElement)
        {
            let svg=div.querySelector('svg');
            if (svg)
            {
                svg.style.transform='rotate(0deg)';
            }
        }
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
const RemoveDivs = () => {
    let existingDivs = document.getElementsByClassName('removeDiv');
    Array.from(existingDivs).forEach(div => div.remove());
    let existingDivs2 = document.getElementsByClassName('removeDiv1');
    Array.from(existingDivs2).forEach(div => div.remove());
}

// Male toggle
MaleButton.addEventListener('click', () => {
    let element = document.getElementById('internalDivMale');
    RemoveDivs();

    if (functionCalled) {
        element.innerHTML = '';
        functionCalled = false;
        MaleButton.querySelector('svg').style.transform = 'rotate(0deg)';
        return;
    }
    if (functionCalledFemale){
        FemaleButton.querySelector('svg').style.transform = 'rotate(0deg)';
        element.innerHTML = '';
        functionCalledFemale = false;
        document.getElementById('internalDivFemale').innerHTML = '';
    }
    MaleButton.querySelector('svg').style.transform = 'rotate(90deg)';
    readData('Male');
    functionCalled = true;
});

// Female toggle
FemaleButton.addEventListener('click', () => {
    let element = document.getElementById('internalDivFemale');
    RemoveDivs();
    if (functionCalledFemale) {
        element.innerHTML = '';
        functionCalledFemale = false;
        FemaleButton.querySelector('svg').style.transform = 'rotate(0deg)';
        return;
    }
    if (functionCalled){
        MaleButton.querySelector('svg').style.transform = 'rotate(0deg)';
        element.innerHTML = '';
        functionCalled = false;
        document.getElementById('internalDivMale').innerHTML = '';
    }
    FemaleButton.querySelector('svg').style.transform = 'rotate(90deg)';
    readData('Female');
    functionCalledFemale = true;
});