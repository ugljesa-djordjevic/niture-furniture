$(function () {

	let productArr = []

	"use strict";

	setTimeout(function () {
		$('.loader_bg').fadeToggle();
	}, 500);


	$("#sidebar").mCustomScrollbar({
		theme: "minimal"
	});

	$('#dismiss, .overlay').on('click', function () {
		$('#sidebar').removeClass('active');
		$('.overlay').removeClass('active');
	});

	$('#sidebarCollapse').on('click', function () {
		if($('#sidebar').hasClass('active')){
			$('#sidebar').removeClass('active');
			$('.overlay').removeClass('active');
		}
		else{
			$('#sidebar').addClass('active');
			$('.overlay').addClass('active');
		}
		$('.collapse.in').toggleClass('in');
		$('a[aria-expanded=true]').attr('aria-expanded', 'false');
	});

	const slider = document.querySelector('#priceSlider');
	if(slider){
		$('#priceSlider').slider({max: 800, rande: true, values: [0, 800], 
			slide:function(event, ui){
				getDetails(ui.values[0], ui.values[1]);
				printProducts(productArr);console.log(productArr);
			}
		});
	}
	

	$(".fancybox").fancybox({
	 	openEffect: "none",
		closeEffect: "none"
	});
	 
	$(".zoom").hover(function(){
	$(this).addClass('transition');
	}, function(){
	$(this).removeClass('transition');
	});

	$('.send').click(formValidate);  

	/****** Login form ******/
	$('#loginBtn').click(()=>{
		$('.wrapper-log').toggleClass("hidden");
	});

	const loginText = document.querySelector(".title-text .login");
    const loginForm = document.querySelector("form.login");
    const loginBtn = document.querySelector("label.login");
    const signupBtn = document.querySelector("label.signup");
    const signupLink = document.querySelector("form .signup-link a");
    signupBtn.onclick = (()=>{
    	loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
    });
    loginBtn.onclick = (()=>{
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
    });
    signupLink.onclick = (()=>{
        signupBtn.click();
        return false;
    });

	/****** Print callers ******/
	callAjax("products", printProducts);
	callAjax("products", printBrands);
	callAjax("brands", printBrandsList);
	callAjax("categories", printCategoriesList);
	callAjax("categories", printCategoriesHome);
	$("#sort").change(resetPrinting);	
	pushToLS();

	/****** Validation functions ******/

	function formValidate(e){
		e.preventDefault();
		var name, email, number, isValid;

		name = document.querySelector("#name").value.trim();
		email = document.querySelector("#email").value.trim();
		number = document.querySelector("#phone").value.trim();

		var rename, reemail, renumber;

		rename = /^[A-Z]\w{2,14}(\s[A-Z]\w{2,14})*$/;
		reemail = /^\w+([\.\-]\w+)*@\w+([\.\-]\w+)*(\.\w{2,4})+$/;
		renumber = /^06[01234569][\d]{6,8}$/;

		var nameError, emailError, phoneError;

		nameError = document.querySelector("#name-error");
		emailError = document.querySelector("#email-error");
		phoneError = document.querySelector("#phone-error");
		noError = document.querySelector("#good");

		

		if(name == ""){
			nameError.innerHTML = "Name field is empty";
			$(nameError).addClass("alert alert-danger");
			$("#name").addClass("error");
			isValid = false;
		}
		else{
			if(!rename.test(name)){
				nameError.innerHTML = "This is not a good format";
				$(nameError).addClass("alert alert-danger");
				$("#name").addClass("error");
				isValid = false;
			}else{
				nameError.innerHTML = "";
				$(nameError).removeClass("alert alert-danger");
				$("#name").removeClass("error");
			}
		}

		if(email == ""){
			emailError.innerHTML = "Email field is empty";
			$(emailError).addClass("alert alert-danger");
			$("#email").addClass("error");
			isValid = false;
		}
		else{
			if(!reemail.test(email)){
				emailError.innerHTML = "This is not a good format";
				$(emailError).addClass("alert alert-danger");
				$("#email").addClass("error");
				isValid = false;
			}else{
				emailError.innerHTML = "";
				$(emailError).removeClass("alert alert-danger");
				$("#email").removeClass("error");
			}
		}

		if(number == ""){
			phoneError.innerHTML = "Number field is empty";
			$(phoneError).addClass("alert alert-danger");
			$("#phone").addClass("error");
			isValid = false;
		}
		else{
			if(!renumber.test(number)){
				phoneError.innerHTML = "This is not a good format";
				$(phoneError).addClass("alert alert-danger");
				$("#phone").addClass("error");
				isValid = false;
			}else{
				phoneError.innerHTML = "";
				$(phoneError).removeClass("alert alert-danger");
				$("#phone").removeClass("error");
			}
		}

		if(isValid == false){
			e.preventDefault();
		}
		else{
			noError.innerHTML = "Form submited successfully!";
			$(noError).addClass("alert alert-success");
			$('.main_form').submit();
		}
	}

	/****** Ajax call function ******/

	function callAjax(file, callback){
			$.ajax({
				url: "./data/" + file + ".json",
				method: "GET",
				dataType: "json",
				success: function(data){
					callback(data);
				},
				error: function(err){
					console.log(err);
				}
			});
	}

	/****** Print functions ******/

	function printProducts(data){
		const slider = document.querySelector('#priceSlider');
		let currentValue;
		if(slider){
			currentValue = $('#priceSlider').slider("option", "values");
			getDetails(currentValue[0], currentValue[1]);
		}
		data = categoryFilter(data);
		data = brandFilter(data);
		data = sort(data);
		html = "";
		data.forEach(el => {
			if(el.price.currentPrice >= currentValue[0] && el.price.currentPrice <= currentValue[1]){
				html += `
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
				<div class="full product border1 mb-1">
				  <div class="product_img">
					<div class="center"> <img src="${el.picture.src}" alt="${el.picture.alt}"/>
						  <div class="overlay_hover"> 
							  <a class="add-bt" data-id="${el.id}">+ Add to cart</a>
						</div>
					</div>
				  </div>
				  <div class="product_detail text_align_center">
					${displayPrice(el.price)}
					<p class="product_descr">${el.desc}</p>
				  </div>
				</div>
			  </div>
			  
				`;
			}
		});
		productArr = data;
		document.getElementById("product").innerHTML = html;
	}

	function printCategoriesHome(data){
		let div = document.getElementById("categories-home");
		if(div) {
			let html = "";
			data = data.slice(0, 3);
			data.forEach(el => {
				html += `
				<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 margitop">
				<a href="product.html">
					<div class="trending-box" data-id="${el.id}">
						<figure><img src="${el.picture.src}" alt="${el.picture.alt}" /></figure>
						<h3>${el.name}</h3>
					</div>
				</a>
				</div>
				`;
			});
			div.innerHTML = html;
			$('.trending-box').click(pushToLS);
		}
		
	}

	function printBrands(data){
		let div = document.getElementById("brands");
		if(div) {
			let html = "";
			data = data.slice(0, 4);
			data.forEach(el => {
				html += `
					<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 margintop">
					<a href="product.html">
						<div class="brand-box" data-id="${el.id}">
							<i><img src="${el.picture.src}" alt="${el.picture.alt}"/></i>
							<h3>${el.brand}</h3>
							<span>$${el.price.currentPrice}</span>
						</div>
					</a>
					</div>
				`;
			});
			div.innerHTML = html;
			$('.brand-box').click(pushToLS);
		}
		
	}

	function displayPrice(price){
        let html = "";
        if(price.hasOwnProperty("oldPrice")){
            html = 
            `<p class="product_price">$${price.currentPrice}
            <span class="old_price">$${price.oldPrice}</span></p>`;
        }
        else{
            html = 
            `<p class="product_price">$${price.currentPrice}</p>`;
        }
        return html;
    }

	function printBrandsList(data){
		html = "";
		data.forEach(el => {
			html += `
				<div class="checkbox-list">
					<input type="checkbox" class="cbBrand mr-1" name="brand" value="${el.id}"><label class="brandTrigger list-item">${(el.brand).toUpperCase()}</label>
				</div>
			`;
		});
		document.getElementById("brands-list").innerHTML = html;
		$(".cbBrand").change(resetPrinting);
		$(".brandTrigger").click(listItemChecker);
	}

	function printCategoriesList(data){
		html = "";
		data.forEach(el => {
			html += `
				<div class="checkbox-list">
					<input type="checkbox" class="cbCat mr-1" name="cat" value="${el.id}"><label class="ctTrigger list-item">${(el.name).toUpperCase()}</label>
				</div>
			`;
		});
		document.getElementById("category-list").innerHTML = html;
		$(".cbCat").change(resetPrinting);
		$(".ctTrigger").click(listItemChecker);
	}

	/****** Filter functions ******/

	function categoryFilter(data){
		let selectedCategory = [];
		$('.cbCat:checked').each(function(){
            selectedCategory.push(parseInt($(this).val()));
        });
		if(selectedCategory.length != 0){
            return data.filter(el => selectedCategory.includes(el.category));
        }
        return data;
	}

	function brandFilter(data){
		let selectedBrand = [];
		$('.cbBrand:checked').each(function(){
            selectedBrand.push(parseInt($(this).val()));
        });
		if(selectedBrand.length != 0){
            return data.filter(el => selectedBrand.includes(el.brandId));
        }
        return data;
	}

	function sort(data){
		const sortType = document.getElementById("sort").value;
        if(sortType == 'asc'){
            return data.sort((a,b) => parseInt(a.price.currentPrice) > parseInt(b.price.currentPrice) ? 1 : -1);
        }
		else{
			return data.sort((a,b) => parseInt(a.price.currentPrice) < parseInt(b.price.currentPrice) ? 1 : -1);
		}
	}

	function listItemChecker(){
		if($(this).prev()[0].checked){
			$(this).prev()[0].checked = false;
			resetPrinting();
		} 
		else{
			$(this).prev()[0].checked = true;
			resetPrinting();
		}
	}

	/****** jQuery UI price slider ******/

	function getDetails(min, max){
		$("#minRange").text("$" + min);
		$("#maxRange").text("$" + max);
	}

	function resetPrinting(){
		callAjax("products", printProducts);
	}

	/****** Local storage for home page ******/

	function pushToLS(){
		const div = $(this);
		const id = $(this).data("id");
		if(div[0].classList == "trending-box") {
			console.log("Category was clicked", id);
			localStorage.setItem("CategoryID", id);
		}
		else if(div[0].classList == "brand-box") {
			console.log("Brand was clicked", id);
			localStorage.setItem("BrandID", id);
		}
		callAjax("products", pageChecking);
	}

	function pageChecking(data){
		const div = document.querySelector('#product');
		let categoryID = localStorage.getItem("CategoryID");
		let brandID = localStorage.getItem("BrandID");
		if(div) {
			let filtered;
			if(categoryID) {
				filtered = data.filter(el => categoryID == el.category);
				$(`input[type=checkbox][name=cat][value=${categoryID}]`).prop('checked', true);
			}
			else if(!categoryID) {
				$(`input[type=checkbox][name=cat][value=${categoryID}]`).prop('checked', false);
			}
			if(brandID) {
				filtered = data.filter(el => brandID == el.brandId);
				$(`input[type=checkbox][name=brand][value=${brandID}]`).prop('checked', true);
			}
			else if(!brandID){
				$(`input[type=checkbox][name=brand][value=${brandID}]`).prop('checked', false);
			}
			console.log(brandID);
			console.log(categoryID);
			printProducts(filtered);
			localStorage.removeItem('CategoryID');
			localStorage.removeItem('BrandID');
		}
	}
});



	
	
