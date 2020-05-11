var xhr = new XMLHttpRequest();
var page = 1;
var perPage = 12;
var loader = document.getElementById('loader');
var itemDetails = document.getElementById('itemDetails');
var itemSpecs = document.getElementById('itemSpecs');
var allItems = [];

function getItems()
{
    loader.style.display ='block';

    xhr.open('GET', 'https://api.punkapi.com/v2/beers?page=' + page + '& per_page=' + perPage);

    xhr.responseType = 'json';
    xhr.send();
}

/**
 * Callback function for XHR load event. 
 */
function xhrComplete() 
{
    //console.log('XHR pyyntö complete');
    //console.log('readyState: ' + xhr.readyState);
    //console.log('status: ' + xhr.status);
    
    //Check for errors 
    if (xhr.status != 200)
    {
        console.error(xhr.status + ': ' + xhr.statusText);
    }
    else
    {
        //HTTP status is 200, everything ok 
        console.log(xhr.response);
        allItems = allItems.concat(xhr.response);
        createItems(xhr.response);
        loader.style.display = 'none';
    }
}

/** 
 * Callback function for XHR error event
*/
function xhrError()
{
    console.error('XHR error');
}

/**
 * Callback function for XHR readystatechange event.
 */

function xhrReadyStateChange()
{
    console.log('readyState: ' + xhr.readyState);
}


/**
 * Creates item HTML elements to DOM.
 * @param {array} items
 */
function createItems(items)
{
   //Loop through items
   for (var i = 0; i < items.length; i++)
   {
        //console.log(items[i].name);
        // Create item elements 
        var itemDiv = document.createElement('div');
        var itemH = document.createElement('h2');
        var itemP = document.createElement('p');
        var itemImg = document.createElement('img');
        var itemBtn = document.createElement('button');

        itemDiv.className = 'item';
        itemH.textContent = items[i].name;
        itemP.textContent = items[i].tagline;
        itemImg.src = items[i].image_url;
        itemImg.alt = items[i].name;
        itemBtn.textContent = 'Show details';
        itemBtn.dataset.id = items[i].id;

        // Show details button click event handler 
        itemBtn.onclick = function() {
            showDetails(this.dataset.id);
        };

        itemDiv.appendChild(itemImg);
        itemDiv.appendChild(itemH);
        itemDiv.appendChild(itemP);
        itemDiv.appendChild(itemBtn);

        // Add item to DOM inside #items 
        document.getElementById('items').appendChild(itemDiv);
   }
}

/**
 * Populates itemDetails section with item data and shows it. 
 * @param {number} itemId 
 */
function showDetails(itemId)
{
    var item;

    console.log('Pitäis näyttää item ' + itemId);

    // Loop through items and get the one with itemId
    // For modern browsers google "mdn array find" :D
    for(var i = 0; i < allItems.length; i++)
    {
        if(allItems[i].id == itemId)
        {
            //console.log(allItems[i]);
            item = allItems[i];
            break;
        }
    }

    console.log(item);

    document.getElementById('itemName').textContent = item.name;
    document.getElementById('itemDescription').textContent = item.description;
    document.getElementById('itemTips').textContent = item.brewers_tips;
    document.getElementById('itemImg').src = item.image_url;

    var specProps = [
        {
            name: 'first_brewed',
            label: 'First brewed'
        },
        {
            name: 'abv',
            label: 'ABV %'
        },
        {
            name: 'ibu',
            label: 'IBU'
        },
        {
            name: 'ph',
            label: 'Ph'
        }
    ];

    // Clear specs table 
    itemSpecs.innerHTML = '';

    // Loop through specProps and add data to the table 
    for(var i = 0; i < specProps.length; i++)
    {
        // Don't show if the prop is empty
        if(! item[specProps[i].name] || item[specProps[i].name] == null ||
        item[specProps[i].name] == '')
        {
            continue;
        }


        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var td = document.createElement('td');

        th.scope = 'row';
        th.textContent = specProps[i].label;
        td.textContent = item[specProps[i].name];

        tr.appendChild(th);
        tr.appendChild(td);
        itemSpecs.appendChild(tr);
    }

    itemDetails.classList.add('show');
}

xhr.addEventListener('load', xhrComplete);
xhr.addEventListener('error', xhrError);
xhr.addEventListener('readystatechange', xhrReadyStateChange);

getItems();

document.getElementById('loadMoreBtn').onclick = function() {
    //console.log('Pitäis ladata lisää kaljaa...');
    page++;
    getItems();

};

// Close details button click event handler 
document.getElementById('closeDetailsBtn').onclick = function() {
    itemDetails.classList.remove('show');
};

itemDetails.onclick = function(e) {
    //console.log('Klikkasit itemDetailsia');
    //console.log(e);
    if (e.target.id == 'itemDetails')
    {
        itemDetails.classList.remove('show');
    }
};