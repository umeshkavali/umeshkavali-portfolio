const token = "";
fetch(
    "https://umeshkavalishop-dev-ed.develop.my.salesforce.com/services/apexrest/products",
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
)
.then(response => response.json())
.then(data => {

    let html = '';

    data.forEach(product => {

        html += `
            <div class="product-card">
                <h3>${product.Name}</h3>
            </div>
        `;

    });

    document.getElementById('products').innerHTML = html;

})
.catch(error => console.error(error));