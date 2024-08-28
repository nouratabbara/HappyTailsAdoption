function displayDate(){
    const now = new Date();
    const currentDateTime = now.toLocaleString();
    document.getElementById("date").innerHTML = currentDateTime;
    setInterval(displayDate, 1000); //call every 1000 milliseconds 

    
}