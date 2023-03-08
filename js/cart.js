window.onload = () => {

	let productsArr = [];
	let productContainer = document.querySelector(".products");
	let productPage = document.querySelector(".product");
	cartCheck();

	$("#sort").change(reset);	

	function reset() {
		let carts = document.querySelectorAll('.add-bt');
		for(let i = 0; i < carts.length; i++) {
			carts[i].addEventListener('click', () => {
				$.ajax({
					url: "./data/products.json",
					method: "GET",
					dataType: "json",
					success: function(products){
						products = sort(products);
						productsArr = products;
						cartNumber(products[i]);
						totalCost(products[i]);
					},
					error: function(err){
						console.log(err);
					}
				});
			});
		}
	}

	reset();

			function sort(data){
				const sortType = document.getElementById("sort").value;
				if(sortType == 'asc'){
					return data.sort((a,b) => parseInt(a.price.currentPrice) > parseInt(b.price.currentPrice) ? 1 : -1);
				}
				else{
					return data.sort((a,b) => parseInt(a.price.currentPrice) < parseInt(b.price.currentPrice) ? 1 : -1);
				}
			}

	displayCart();
    
}

function cartNumber(product) {
	const span = document.querySelector('#cart-span');
	let productNumber = localStorage.getItem('cartNumber');
	productNumber = parseInt(productNumber);

	if( productNumber ) {
		localStorage.setItem('cartNumber', productNumber + 1);
		span.textContent = productNumber + 1;
		span.style.visibility = "visible";
	}
	else {
		localStorage.setItem('cartNumber', 1);
		span.textContent = 1;
		span.style.visibility = "visible";
	}

	setItem(product);

}

function setItem(product) {
	let cartItems = localStorage.getItem("productInCart");
	cartItems = JSON.parse(cartItems);

	if(cartItems != null) {

		if(cartItems[product.id] == undefined) {
			cartItems = {
				...cartItems,
				[product.id]: product
			}
		}
		cartItems[product.id].inCart += 1;

	}
	else {

		product.inCart = 1;
		cartItems = {
			[product.id]: product
		}

	}
	
	localStorage.setItem("productInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
	let cartCost = localStorage.getItem("totalPrice");

	if(cartCost != null) {
		cartCost = parseFloat(cartCost);
		localStorage.setItem("totalPrice", parseFloat(cartCost + parseFloat(product.price.currentPrice)).toFixed( 2 ));
	}
	else {
		localStorage.setItem("totalPrice", product.price.currentPrice);
	}
}

function cartCheck(){
	let productNumber = localStorage.getItem('cartNumber');
	const span = document.querySelector('#cart-span');
	if(productNumber == 0) {
		emptyCart();
		localStorage.removeItem('cartNumber');
		console.log(productNumber);
	}
	if(productNumber && span) {
		span.textContent = productNumber;
		span.style.visibility = "visible";
	}
}

function displayCart() {
	let cartItems = localStorage.getItem("productInCart");
	cartItems = JSON.parse(cartItems);
	let productContainer = document.querySelector(".products");
	let cartCost = localStorage.getItem("totalPrice");

	if(cartItems && productContainer) {
		productContainer.innerHTML = '';
		Object.values(cartItems).map(item => {
			productContainer.innerHTML += `
				<div class="product-wrap" data-id="${item.id}">
					<div class="cart-product">
					<span class="del-product"><ion-icon name="close-circle"></ion-icon></span>
						<img src="${item.picture.src}">
						<span>${item.desc}</span>
					</div>
					<div class="price">
						$${item.price.currentPrice}
					</div>
					<div class="quantity">
						<span class="decrease"><ion-icon name="caret-back-circle"></ion-icon></span>
						<span>${item.inCart}</span>
						<span class="increase"><ion-icon name="caret-forward-circle"></ion-icon></span>
					</div>
					<div class="total">
						$${item.inCart * item.price.currentPrice}
					</div>
				</div>
			`
		});
		

		productContainer.innerHTML += `
			<div class="basket-total-container">
				<h4 class="basket-total-title">Basket Total</h4>
				<h4 class="basket-total">$${cartCost}</h4>
			</div>
			<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <button class="send">Checkout</button>
            </div>
		`
	}
	$(".decrease").click(changeInCartNumber);
	$(".increase").click(changeInCartNumber);
	$(".del-product").click(deleteCart);
}

function changeInCartNumber(){
	const product = $(this).parent().parent().data("id");
	let storage = localStorage.getItem("productInCart");
	let productNumber = localStorage.getItem('cartNumber');
	let cartCost = localStorage.getItem("totalPrice");
	cartCost = JSON.parse(cartCost);
	cartCost = parseFloat(cartCost);
	productNumber = JSON.parse(productNumber);
	storage = JSON.parse(storage);
	let storageArr = Object.values(storage);
	let className = $(this).attr("class");

	if(className == "decrease") {
		storageArr.forEach(el => {
			if(product == el.id) {
				el.inCart--;
				localStorage.setItem('cartNumber', productNumber - 1);
				localStorage.setItem('totalPrice', parseFloat(cartCost - parseFloat(el.price.currentPrice)).toFixed( 2 ));
			}
		});
	}

	if(className == "increase") {
		storageArr.forEach(el => {
			if(product == el.id) {
				el.inCart++;
				localStorage.setItem('cartNumber', productNumber + 1);
				localStorage.setItem('totalPrice', parseFloat(cartCost + parseFloat(el.price.currentPrice)).toFixed( 2 ));
			}
		});
	}
	
	localStorage.setItem("productInCart", JSON.stringify(storageArr));
	displayCart();
	cartCheck();
}

function deleteCart(){
	const product = $(this).parent().parent().data("id");
	let storage = localStorage.getItem("productInCart");
	let productNumber = 0;
	let cartCost = 0;
	cartCost = JSON.parse(cartCost);
	cartCost = parseFloat(cartCost);
	productNumber = JSON.parse(productNumber);
	storage = JSON.parse(storage);
	let storageArr = Object.values(storage);
	storageArr = storageArr.filter(el => el.id != product);
	storageArr.forEach(el => {
		productNumber += el.inCart;
		cartCost += parseFloat(el.price.currentPrice);
		parseFloat(cartCost).toFixed( 2 );
	});
	console.log(storageArr);
	localStorage.setItem("productInCart", JSON.stringify(storageArr));
	localStorage.setItem("cartNumber", productNumber);
	localStorage.setItem('totalPrice', cartCost);
	displayCart();
	cartCheck();
}

function emptyCart(){
	let productContainer = document.querySelector(".products");
	productContainer.innerHTML = `<p class="emptyCart">Your shopping cart is empty. If you want to order something <a href="product.html">click here</a>.</p>`;
	console.log("Entered");
}