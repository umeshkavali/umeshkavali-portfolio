const token = "YOUR_SALESFORCE_TOKEN_HERE";

fetch("https://umeshkavalishop-dev-ed.develop.my.salesforce.com/services/apexrest/products", {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
.then(data => {
    console.log(data);
});