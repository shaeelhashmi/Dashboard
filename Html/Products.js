console.log("New.js loaded");
const urlParams = new URLSearchParams(window.location.search);
const queryValue = urlParams.get('sub_item'); // Replace 'parameterName' with your actual parameter name
const secondQueryValue = urlParams.get('item'); // Example of getting another parameter
const gender = urlParams.get('gender');
let checkedItems = [];
console.log("Query Value:", queryValue);
console.log("Second Query Value:", secondQueryValue);
console.log("Gender:", gender);
// Create JSON object with all URL parameters
const paramsData = {
    sub_item: queryValue,
    item: secondQueryValue,
    gender: gender
};
const topDiv=document.getElementById('topDiv');

const SendData = async() => {
    try {
        const response = await fetch('/get/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paramsData)
        });
        const csvText = await response.text();

        // parse into rows
        const rows = csvText.split('\n').map(row => row.split(','));
        rows.forEach(row => {
            console.log('Processing row:', row[0].trim());
           if(!row[0] || row[0].trim() === 'urls' || row[0].trim() === '') {
        console.log('Skipping:', row[0]);
        return;
    }
        // Remove quotes from the beginning and end of the URL if present
        const cleanUrl = row[0] ? row[0].replace(/^["']/, '').replace(/["']$/, '') : '';
            const div=document.createElement('div');
            const image=document.createElement('img');
            let continueFlag=false;
            image.onerror = function() {
            console.log('Failed to load image:', cleanUrl);
            continueFlag=true;
            };
            if(continueFlag){
                return;}
            
            image.src=cleanUrl; 
            const checkBox=document.createElement('input');
            checkBox.type='checkbox';
            checkBox.name='item';
            checkBox.value=cleanUrl;
            checkBox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    checkedItems.push(event.target.value);
                }
                else {
                    checkedItems = checkedItems.filter(item => item !== event.target.value);
                }
                console.log('Checked items:', checkedItems);
            });
            div.appendChild(checkBox);

            div.appendChild(image);

            topDiv.appendChild(div);
            
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
SendData();
 document.getElementById("downloadBtn").addEventListener("click", () => {
    if (checkedItems.length <= 100) {
        alert("Select at least 100 items to download!");
        return;
    }
    const cleanedItems = checkedItems.map(url => url.trim()); 
    const sendData={items:cleanedItems,sub_item:queryValue,item:secondQueryValue,gender:gender};
    console.log(cleanedItems)
    const stringiFied=JSON.stringify(sendData);
    console.log(stringiFied);
    try{
       fetch('/save/image',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
       body: JSON.stringify(sendData)
    })
    }
    catch(error){
        console.error('Error:', error);
        alert("Error in downloading images");
    }
    
});
