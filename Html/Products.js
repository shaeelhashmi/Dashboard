console.log("New.js loaded");
const urlParams = new URLSearchParams(window.location.search);
const queryValue = urlParams.get('sub_item'); // Replace 'parameterName' with your actual parameter name
const secondQueryValue = urlParams.get('item'); // Example of getting another parameter
const gender = urlParams.get('gender');
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
            const div=document.createElement('div');
            const image=document.createElement('img');
            image.src=row; 
            div.appendChild(image);

            topDiv.appendChild(div);
            
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
SendData();