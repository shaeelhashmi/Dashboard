let data;
let data2=[];
const MaleButton=document.getElementById('MaleBtn');
let functionCalled=false;
const checkIfLists=(data)=>{
    return typeof data === 'object' && !Array.isArray(data) && data !== null;
}
const DisplayList=(list,key)=>{
    console.log(key);
    const element=document.getElementById(key);
    let divForList=document.createElement('div');
    divForList.classList.add('colSpan2');
    divForList.id='divForListMale'+key;
    element.appendChild(divForList);
    list.forEach((item)=>{
        let div=document.createElement('div');
        let button=document.createElement('button');
        let paragraph=document.createElement('p');
        div.classList.add('mar');
        div.classList.add('grid');
        button.textContent='Submit';
        button.id='submitButtonMaleList'+item;
        paragraph.textContent=item; 
        div.appendChild(paragraph);
    
        div.appendChild(button);
        divForList.appendChild(div);
        paragraph.id=item;
    });
}
const readDataInsideInside=(data,key)=>{
    const element=document.getElementById(key);
    let divForInside=document.createElement('div');
    divForInside.classList.add('colSpan2');
    key.trim();
    divForInside.id='internalDivMaleInside'+key;
    
    Object.keys(data).forEach((keyInside)=>{
        let submitButton=document.createElement('button');
        submitButton.innerHTML=`
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
        `;
        submitButton.id='submitButtonMaleInside'+keyInside;
        let div=document.createElement('div');
        div.classList.add('grid');
        let paragraph=document.createElement('p');
        paragraph.textContent=keyInside;
        paragraph.id=keyInside;
        div.appendChild(paragraph);

        div.id='divInside'+keyInside;
        div.classList.add('mar');
        div.appendChild(submitButton);
        divForInside.appendChild(div);
        data2.push(data[keyInside]);
        if(!checkIfLists(data[keyInside])){
            submitButton.addEventListener('click',()=>{
                let existingDiv = document.getElementById('divForListMale'+'divInside'+keyInside);
                if(existingDiv ){
                    if(existingDiv.classList.contains('scaledZero')){
                        existingDiv.classList.remove('scaledZero');
                        return;
                    }
                    existingDiv.classList.add('scaledZero')
                    return;
                }
                DisplayList(data[keyInside],'divInside'+keyInside)});
            // console.log(submitButton);
            // DisplayList(data[keyInside],'divInside'+keyInside);
        }
        else{
            submitButton.addEventListener('click',()=>{
                let existingDiv = document.getElementById('internalDivMaleInside'+'divInside'+keyInside);
                if(existingDiv ){
                    if(existingDiv.classList.contains('scaledZero')){
                        existingDiv.classList.remove('scaledZero');
                        return;
                    }
                    existingDiv.classList.add('scaledZero')
                    return;
                }
                readDataInsideInside(data[keyInside],'divInside'+keyInside)});
            // readDataInsideInside(data[keyInside], 'divInside'+keyInside);
        }
        
    });
    element.appendChild(divForInside);
}
const readDataInside=(data)=>{
    const element=document.getElementById('internalDivMale');
    
    Object.keys(data).forEach((key)=>{
        let div=document.createElement('div');
       let paragraph=document.createElement('p');
       paragraph.textContent=key;
       paragraph.id=key.trim();
       let submitButton=document.createElement('button');
        submitButton.innerHTML=`
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
        `;
        submitButton.id='submitButtonMale'+key;
        div.appendChild(paragraph);
        div.appendChild(submitButton);
        div.id='div'+key.trim();
        div.classList.add('mar');
        div.classList.add('grid')
        element.appendChild(div);
        if(!checkIfLists(data[key])){
            submitButton.addEventListener('click',()=>{
                let existingDiv = document.getElementById('divForListMale'+'div'+key.trim());
                if(existingDiv ){
                    if(existingDiv.classList.contains('scaledZero')){
                        existingDiv.classList.remove('scaledZero');
                        return;
                    }
                    existingDiv.classList.add('scaledZero')
                    return;
                }
                DisplayList(data[key],'div'+key.trim())});
        //   DisplayList(data[key],'div'+key);
        }
        else{
            submitButton.addEventListener('click',()=>{
                let existingDiv = document.getElementById('internalDivMaleInside'+'div'+key.trim());
                if(existingDiv ){
                    if(existingDiv.classList.contains('scaledZero')){
                        existingDiv.classList.remove('scaledZero');
                        return;
                    }
                    existingDiv.classList.add('scaledZero')
                    return;
                }
                readDataInsideInside(data[key],'div'+key.trim())});
            // readDataInsideInside(data[key], 'div'+key);
        }
        console.log(key)
        data2.push(data[key]);
   })
   
    element.appendChild(submitButton);
}
const readData=async()=>{
    try {
        const response=await fetch('categories/male');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Response is not JSON:', text);
            return;
        }
        
        data=await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    readDataInside(data);
}
MaleButton.addEventListener('click',()=>{
    if(functionCalled){
        let element=document.getElementById('internalDivMale');
        element.innerHTML='';
        functionCalled=false;
        return;
    }
    readData();
    if(!functionCalled){
        functionCalled=true;
    }
}

);