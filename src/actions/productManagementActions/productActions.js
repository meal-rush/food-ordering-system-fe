import {
	PRODUCTS_LIST_FOR_VENDOR_REQUEST,
	PRODUCTS_LIST_FOR_VENDOR_SUCCESS,
	PRODUCTS_LIST_FOR_VENDOR_FAIL,
	PRODUCTS_LIST_FOR_ADMIN_REQUEST,
	PRODUCTS_LIST_FOR_ADMIN_SUCCESS,
	PRODUCTS_LIST_FOR_ADMIN_FAIL,
	PRODUCTS_CREATE_REQUEST,
	PRODUCTS_CREATE_SUCCESS,
	PRODUCTS_CREATE_FAIL,
	PRODUCTS_UPDATE_BY_VENDOR_REQUEST,
	PRODUCTS_UPDATE_BY_VENDOR_SUCCESS,
	PRODUCTS_UPDATE_BY_VENDOR_FAIL,
	PRODUCTS_DELETE_BY_VENDOR_REQUEST,
	PRODUCTS_DELETE_BY_VENDOR_SUCCESS,
	PRODUCTS_DELETE_BY_VENDOR_FAIL,
	PRODUCTS_UPDATE_BY_ADMIN_REQUEST,
	PRODUCTS_UPDATE_BY_ADMIN_SUCCESS,
	PRODUCTS_UPDATE_BY_ADMIN_FAIL,
	PRODUCTS_DELETE_BY_ADMIN_REQUEST,
	PRODUCTS_DELETE_BY_ADMIN_SUCCESS,
	PRODUCTS_DELETE_BY_ADMIN_FAIL,
} from "../../constants/productManagementConstants/productConstants";
import axios from "axios";
import { API_ENDPOINT } from "../../config";
import swal from "sweetalert";

//adding auth header for vendor
export function authHeaderForVendor() {
	let vendor = JSON.parse(localStorage.getItem("vendorInfo"));

	if (vendor && vendor.token) {
		return { Authorization: `Bearer ${vendor.token}` };
	} else {
		return {};
	}
}

// adding auth header for admin
export function authHeaderForAdmin() {
	let admin = JSON.parse(localStorage.getItem("adminInfo"));

	if (admin && admin.token) {
		return { Authorization: `Bearer ${admin.token}` };
	} else {
		return {};
	}
}

// get product list for vendor action
export const productsListForVendor = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCTS_LIST_FOR_VENDOR_REQUEST,
		});

		const {
			vendor_Login: { vendorInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${vendorInfo.token}`,
			},
		};

		//call the backend route
		const { data } = await axios.get(`${API_ENDPOINT}/items/products/vendor/product/get`, config);

		dispatch({
			type: PRODUCTS_LIST_FOR_VENDOR_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		dispatch({
			type: PRODUCTS_LIST_FOR_VENDOR_FAIL,
			payload: message,
		});
	}
};

// get product list for admin action
export const productsListForAdmin = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCTS_LIST_FOR_ADMIN_REQUEST,
		});

		const {
			admin_Login: { adminInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${adminInfo.token}`,
			},
		};

		//call the backend route
		const { data } = await axios.get(`${API_ENDPOINT}/items/products/admin/product/get`, config);

		dispatch({
			type: PRODUCTS_LIST_FOR_ADMIN_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		dispatch({
			type: PRODUCTS_LIST_FOR_ADMIN_FAIL,
			payload: message,
		});
	}
};

// create a product action
// export const createProduct =
// 	(
// 		vendorEmail,
// 		title,
// 		category,
// 		productBrand,
// 		productCode,
// 		description,
// 		picURL,
// 		price,
// 		ingredients,
// 		usage,
// 		warnings,
// 		discountNote,
// 		discountPrice,
// 		quantity
// 	) =>
// 	async (dispatch, getState) => {
// 		try {
// 			dispatch({
// 				type: PRODUCTS_CREATE_REQUEST,
// 			});

// 			const {
// 				vendor_Login: { vendorInfo },
// 			} = getState();

// 			const config = {
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${vendorInfo.token}`,
// 				},
// 			};

// 			//call the backend route
// 			const { data } = await axios.post(
// 				`${API_ENDPOINT}/items/products/vendor/product/add`,
// 				{
// 					vendorEmail,
// 					title,
// 					category,
// 					productBrand,
// 					productCode,
// 					description,
// 					picURL,
// 					price,
// 					ingredients,
// 					usage,
// 					warnings,
// 					discountNote,
// 					discountPrice,
// 					quantity,
// 				},
// 				config
// 			);

// 			dispatch({
// 				type: PRODUCTS_CREATE_SUCCESS,
// 				payload: data,
// 			});
// 			swal({
// 				title: "Success !!!",
// 				text: "Product Creation Successful.",
// 				icon: "success",
// 				timer: 2000,
// 				button: false,
// 			});
// 			setTimeout(function () {
// 				window.location.href = "/vendor-products";
// 			}, 2000);
// 		} catch (error) {
// 			const message = error.response && error.response.data.message ? error.response.data.message : error.message;
// 			dispatch({
// 				type: PRODUCTS_CREATE_FAIL,
// 				payload: message,
// 			});
// 		}
// 	};

// Create a product action with support for both old and new fields
export const createProduct = (productData) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCTS_CREATE_REQUEST,
		});

		const {
			vendor_Login: { vendorInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${vendorInfo.token}`,
			},
		};

		// Handling both old and new field names
		const payload = {
			vendorEmail: productData.vendorEmail,
			title: productData.itemName || productData.title,
			category: productData.category,
			productBrand: productData.productBrand || "Restaurant Brand", // Default if using new UI
			productCode: productData.productCode || `ITEM-${Date.now()}`, // Generate code if using new UI
			description: productData.description,
			picURL: productData.picURL,
			price: productData.price,
			ingredients: productData.ingredients || productData.customizations || "Not specified", // Map customizations to ingredients
			usage: productData.usage || "Consume fresh", // Default if using new UI
			warnings: productData.warnings || "No specific warnings", // Default if using new UI
			discountNote: productData.discountNote || "No current discounts", // Default if using new UI
			discountPrice: productData.discountPrice || productData.price, // Default to regular price if no discount
			quantity: productData.quantity || 100, // Default quantity if using new UI
			// New fields
			preparationTime: productData.preparationTime,
			availability: productData.availability,
			customizations: productData.customizations,
		};

		//call the backend route
		const { data } = await axios.post(`${API_ENDPOINT}/items/products/vendor/product/add`, payload, config);

		dispatch({
			type: PRODUCTS_CREATE_SUCCESS,
			payload: data,
		});

		swal({
			title: "Success !!!",
			text: "Menu Item Creation Successful.",
			icon: "success",
			timer: 2000,
			button: false,
		});

		setTimeout(function () {
			window.location.href = "/vendor-products";
		}, 2000);
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		dispatch({
			type: PRODUCTS_CREATE_FAIL,
			payload: message,
		});
	}
};

// upadate product by vendor action
// export const updateProductByVendor =
// 	(
// 		id,
// 		vendorEmail,
// 		title,
// 		category,
// 		productBrand,
// 		productCode,
// 		description,
// 		picURL,
// 		price,
// 		ingredients,
// 		usage,
// 		warnings,
// 		discountNote,
// 		discountPrice,
// 		quantity
// 	) =>
// 	async (dispatch, getState) => {
// 		try {
// 			dispatch({
// 				type: PRODUCTS_UPDATE_BY_VENDOR_REQUEST,
// 			});

// 			const {
// 				vendor_Login: { vendorInfo },
// 			} = getState();

// 			const config = {
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${vendorInfo.token}`,
// 				},
// 			};

// 			//call the backend route
// 			const { data } = await axios.put(
// 				`${API_ENDPOINT}/items/products/vendor/product/get/${id}`,
// 				{
// 					vendorEmail,
// 					title,
// 					category,
// 					productBrand,
// 					productCode,
// 					description,
// 					picURL,
// 					price,
// 					ingredients,
// 					usage,
// 					warnings,
// 					discountNote,
// 					discountPrice,
// 					quantity,
// 				},
// 				config
// 			);

// 			dispatch({
// 				type: PRODUCTS_UPDATE_BY_VENDOR_SUCCESS,
// 				payload: data,
// 			});
// 		} catch (error) {
// 			const message = error.response && error.response.data.message ? error.response.data.message : error.message;
// 			dispatch({
// 				type: PRODUCTS_UPDATE_BY_VENDOR_FAIL,
// 				payload: message,
// 			});
// 		}
// 	};

// upadate product by vendor action
export const updateProductByVendor =
	(
		id,
		vendorEmail,
		title,
		category,
		productBrand,
		productCode,
		description,
		picURL,
		price,
		ingredients,
		usage,
		warnings,
		discountNote,
		discountPrice,
		quantity,
		preparationTime,
		availability,
		customizations
	) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: PRODUCTS_UPDATE_BY_VENDOR_REQUEST,
			});

			const {
				vendor_Login: { vendorInfo },
			} = getState();

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${vendorInfo.token}`,
				},
			};

			//call the backend route
			const { data } = await axios.put(
				`${API_ENDPOINT}/items/products/vendor/product/get/${id}`,
				{
					vendorEmail,
					title,
					category,
					productBrand,
					productCode,
					description,
					picURL,
					price,
					ingredients,
					usage,
					warnings,
					discountNote,
					discountPrice,
					quantity,
					// Include the new fields
					preparationTime,
					availability,
					customizations,
				},
				config
			);

			dispatch({
				type: PRODUCTS_UPDATE_BY_VENDOR_SUCCESS,
				payload: data,
			});
		} catch (error) {
			const message = error.response && error.response.data.message ? error.response.data.message : error.message;
			dispatch({
				type: PRODUCTS_UPDATE_BY_VENDOR_FAIL,
				payload: message,
			});
		}
	};

// update the product by admin action
export const updateProductByAdmin =
	(
		id,
		vendorEmail,
		title,
		category,
		productBrand,
		productCode,
		description,
		picURL,
		price,
		ingredients,
		usage,
		warnings,
		discountNote,
		discountPrice,
		quantity
	) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: PRODUCTS_UPDATE_BY_ADMIN_REQUEST,
			});

			const {
				admin_Login: { adminInfo },
			} = getState();

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminInfo.token}`,
				},
			};

			//call the backend route
			const { data } = await axios.put(
				`${API_ENDPOINT}/items/products/vendor/product/get/${id}`,
				{
					vendorEmail,
					title,
					category,
					productBrand,
					productCode,
					description,
					picURL,
					price,
					ingredients,
					usage,
					warnings,
					discountNote,
					discountPrice,
					quantity,
				},
				config
			);

			dispatch({
				type: PRODUCTS_UPDATE_BY_ADMIN_SUCCESS,
				payload: data,
			});
		} catch (error) {
			const message = error.response && error.response.data.message ? error.response.data.message : error.message;
			dispatch({
				type: PRODUCTS_UPDATE_BY_ADMIN_FAIL,
				payload: message,
			});
		}
	};

// delete product by vendor action
export const deleteProductByVendor = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCTS_DELETE_BY_VENDOR_REQUEST,
		});

		const {
			vendor_Login: { vendorInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${vendorInfo.token}`,
			},
		};

		//call the backend route
		const { data } = await axios.delete(`${API_ENDPOINT}/items/products/vendor/product/get/${id}`, config);

		dispatch({
			type: PRODUCTS_DELETE_BY_VENDOR_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		dispatch({
			type: PRODUCTS_DELETE_BY_VENDOR_FAIL,
			payload: message,
		});
	}
};

// delete product by admin  action
export const deleteProductByAdmin = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCTS_DELETE_BY_ADMIN_REQUEST,
		});

		const {
			admin_Login: { adminInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${adminInfo.token}`,
			},
		};

		//call the backend route
		const { data } = await axios.delete(`${API_ENDPOINT}/items/products/admin/product/get/${id}`, config);

		dispatch({
			type: PRODUCTS_DELETE_BY_ADMIN_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		dispatch({
			type: PRODUCTS_DELETE_BY_ADMIN_FAIL,
			payload: message,
		});
	}
};
