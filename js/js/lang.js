function redirectValue(event) {
        
    let loc = location;
    let value = event.target.value;
        
    if(loc.search !== '')
        value += loc.search;
        
    if(loc.hash !== '')
        value += loc.hash;
        
    // location.href = 'https://oecusoundserver.github.io/Cadence/special/bosyu.html' + value;

    //URLの場合はこちら
    location.href = value;
}
    
let selectbox = document.getElementById('selectbox');
selectbox.addEventListener('change',redirectValue, false);