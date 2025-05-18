import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listCart, updateCartAction, deleteCartAction } from "../../actions/cartManagementActions/cartAction";
import { createOrderAction } from "../../actions/orderManagementActions/orderAction";
import { API_ENDPOINT } from "../../config";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import { authHeader } from "../../actions/userManagementActions/customerActions";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

export default function CartView() {
  const [total, setTotal] = useState(0);
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const dispatch = useDispatch();
  const customer_Login = useSelector((state) => state.customer_Login);
  const { customerInfo } = customer_Login;

  const cartList = useSelector((state) => state.cartList);
  const { loading, carts, error } = cartList;

  const cartDelete = useSelector((state) => state.cartDelete);
  const { loading: loadingDelete, error: errorDelete } = cartDelete;

  const history = useHistory();

  function decreaseQuanity(id, quantity) {
    if (quantity > 1) dispatch(updateCartAction(id, quantity - 1));
  }

  function increaseQuanity(id, quantity) {
    dispatch(updateCartAction(id, quantity + 1));
  }

  const deleteHandler = (id) => {
    dispatch(deleteCartAction(id));
  };

  const checkout = () => {
    dispatch(createOrderAction(customerInfo._id, total));
  };

  const navigateToShop = () => {
    history.push("/");
  };

  useEffect(() => {
	const fetchingTotal = async () => {
	  if (!customerInfo) return;
	  
	  try {
		const { data } = await axios.get(`${API_ENDPOINT}/cart-items/cart/total/${customerInfo._id}`, {
		  headers: authHeader(),
		  "Access-Control-Allow-Origin": "*",
		  "Access-Control-Allow-Credentials": true,
		});
		setTotal(data.totalPrice);
		localStorage.setItem("total", data.totalPrice); // Move inside here
	  } catch (error) {
		console.error("Error fetching cart total:", error);
	  }
	};
  
	fetchingTotal();
	dispatch(listCart());
  }, [dispatch, history, customerInfo]);

  useEffect(() => {
    setIsCartEmpty(!carts || carts.length === 0);
  }, [carts]);

  const calculateItemTotal = (price, discountPrice, quantity) => {
	return (discountPrice * quantity).toFixed(2);
  };

  if (!customerInfo) {
    return (
      <div className="denied">
        <MainScreen />
        <br></br>
      </div>
    );
  }

  return (
    <Container style={{ minHeight: '80vh', paddingTop: '40px', paddingBottom: '80px' }}>
      <Row className="mb-4">
        <Col xs={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              variant="primary" 
              onClick={navigateToShop}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '8px',
                padding: '8px 16px',
                transition: 'all 0.2s',
                fontWeight: '500'
              }}
            >
              <FaArrowLeft /> Continue Shopping
            </Button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h1 style={{ fontWeight: "600", fontSize: "32px", margin: 0 }}>
			  <FaShoppingCart /> Cart
              </h1>
            </div>
            <div style={{ width: '150px' }}></div> {/* Balance the header */}
          </div>
        </Col>
      </Row>

      {errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
      {loadingDelete && <Loading />}
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {isCartEmpty ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div style={{ fontSize: '80px', color: '#ddd', marginBottom: '20px' }}>
            <FaShoppingCart />
          </div>
          <h3>Your cart is empty</h3>
          <p className="text-muted">Looks like you haven't added any items to your cart yet.</p>
          <Button 
            variant="success" 
            className="mt-3" 
            onClick={navigateToShop}
            style={{
              padding: '10px 25px',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <Row>
          <Col lg={8} className="mb-4">
            <div 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                padding: '15px 20px', 
                borderBottom: '1px solid #eee', 
                backgroundColor: '#f8f9fa',
                fontWeight: '600'
              }}>
                <Row>
                  <Col xs={6}>Product</Col>
                  <Col xs={2} className="text-center">Price</Col>
                  <Col xs={2} className="text-center">Quantity</Col>
                  <Col xs={2} className="text-center">Total</Col>
                </Row>
              </div>

              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {carts?.map((cart) => (
                  <div 
                    key={cart._id} 
                    style={{ 
                      padding: '20px', 
                      borderBottom: '1px solid #eee',
                      transition: 'all 0.2s',
                      ':hover': { backgroundColor: '#f9f9f9' }
                    }}
                  >
                    <Row className="align-items-center">
                      <Col xs={6}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            style={{
                              height: "80px",
                              width: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginRight: "15px"
                            }}
                            src={cart.picURL}
                            alt={cart.productName}
                          />
                          <div>
                            <h5 style={{ margin: 0, fontWeight: '500' }}>{cart.productName}</h5>
                            <small style={{ color: '#6c757d' }}>Code: {cart.productCode}</small>
                            <div>
                              <span 
                                style={{ 
                                  display: 'inline-block',
                                  fontSize: '12px',
                                  padding: '2px 8px',
                                  backgroundColor: '#e9f5e9',
                                  color: '#28a745',
                                  borderRadius: '12px',
                                  marginTop: '5px'
                                }}
                              >
                                {cart.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={2} className="text-center">
                        <div>
                          <span style={{ fontWeight: '500' }}>Rs {cart.price}</span>
                          {cart.discountNote && cart.discountNote.includes('%') && (
                            <div style={{ color: '#dc3545', fontSize: '12px' }}>{cart.discountNote}</div>
                          )}
                        </div>
                      </Col>

                      <Col xs={2}>
                        <div className="d-flex justify-content-center align-items-center">
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => decreaseQuanity(cart._id, cart.quantity)}
                            style={{
                              width: '32px',
                              height: '32px',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px'
                            }}
                          >
                            <FaMinus />
                          </Button>
                          <div style={{ 
                            margin: '0 10px', 
                            fontWeight: '500',
                            minWidth: '30px',
                            textAlign: 'center'
                          }}>
                            {cart.quantity}
                          </div>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => increaseQuanity(cart._id, cart.quantity)}
                            style={{
                              width: '32px',
                              height: '32px',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px'
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Col>

                      <Col xs={2} className="d-flex justify-content-between align-items-center">
                        <span style={{ fontWeight: '600', marginLeft: 'auto', marginRight: '10px' }}>
                          Rs {calculateItemTotal(cart.price, cart.discountPrice, cart.quantity)}
                        </span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteHandler(cart._id)}
                          style={{
                            width: '32px',
                            height: '32px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            backgroundColor: '#fee2e2',
                            borderColor: '#fee2e2',
                            color: '#dc3545'
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '25px'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '20px' }}>Order Summary</h4>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #eee',
                paddingBottom: '15px',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#6c757d' }}>Subtotal</span>
                <span style={{ fontWeight: '500' }}>Rs {total}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '15px',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#6c757d' }}>Shipping</span>
                <span style={{ fontWeight: '500' }}>Free</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #eee',
                paddingTop: '15px',
                marginBottom: '25px'
              }}>
                <span style={{ fontSize: '18px', fontWeight: '600' }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#20cf20' }}>Rs {total}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => checkout()}
                  style={{
                    backgroundColor: '#20cf20',
                    borderColor: '#20cf20',
                    borderRadius: '8px',
                    fontWeight: '600',
                    padding: '12px 30px',
                    transition: 'all 0.3s'
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

// import { useHistory } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "react-bootstrap";
// import Table from "react-bootstrap/Table";
// import { useDispatch, useSelector } from "react-redux";
// import { listCart, updateCartAction, deleteCartAction } from "../../actions/cartManagementActions/cartAction";
// import { createOrderAction } from "../../actions/orderManagementActions/orderAction";
// import { API_ENDPOINT } from "../../config";
// import Loading from "../../components/Loading";
// import ErrorMessage from "../../components/ErrorMessage";
// import MainScreen from "../../components/MainScreen";
// import { authHeader } from "../../actions/userManagementActions/customerActions";

// export default function CartView() {
// 	const [total, setTotal] = useState(0);
// 	const dispatch = useDispatch();
// 	const customer_Login = useSelector((state) => state.customer_Login);
// 	const { customerInfo } = customer_Login;

// 	const cartList = useSelector((state) => state.cartList);
// 	const { loading, carts, error } = cartList;

// 	const cartDelete = useSelector((state) => state.cartDelete);
// 	const { loading: loadingDelete, error: errorDelete } = cartDelete;

// 	const history = useHistory();

// 	function decreaseQuanity(id, quantity) {
// 		if (quantity > 1) dispatch(updateCartAction(id, quantity - 1));
// 	}

// 	function increaseQuanity(id, quantity) {
// 		dispatch(updateCartAction(id, quantity + 1));
// 	}

// 	const deleteHandler = (id) => {
// 		dispatch(deleteCartAction(id));
// 	};

// 	const checkout = () => {
// 		dispatch(createOrderAction(customerInfo._id, total));
// 	};

// 	useEffect(() => {
// 		const fetchingTotal = async () => {
// 			const { data } = await axios.get(`${API_ENDPOINT}/cart-items/cart/total/${customerInfo._id}`, {
// 				headers: authHeader(),
// 				"Access-Control-Allow-Origin": "*",
// 				"Access-Control-Allow-Credentials": true,
// 			});
// 			setTotal(data.totalPrice);
// 		};

// 		fetchingTotal();
// 		localStorage.setItem("total", total);
// 		dispatch(listCart());
// 	}, [dispatch, history, customerInfo._id, total]);

// 	if (customerInfo) {
// 		return (
// 			<div
// 				style={{
// 					minHeight: 700,
// 					marginLeft: "20%",
// 					marginRight: "20%",
// 					marginBottom: "100px",
// 				}}
// 			>
// 				<br></br>
// 				<br></br>
// 				<h1 style={{ fontWeight: "400", fontSize: "50px" }}>Total Price : Rs {total}</h1>
// 				<br></br>
// 				<br></br>
// 				{errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
// 				{loadingDelete && <Loading />}
// 				{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
// 				{loading && <Loading />}
// 				<Table style={{ background: "white" }}>
// 					<>
// 						<tbody>
// 							{carts?.reverse().map((cart) => (
// 								<tr
// 									key={cart._id}
// 									style={{
// 										boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
// 									}}
// 								>
// 									<td
// 										style={{
// 											fontSize: 20,
// 										}}
// 									>
// 										<img
// 											style={{
// 												height: "100px",
// 												width: "100px",
// 												borderColor: "black",
// 												borderWidth: "4px",
// 											}}
// 											src={cart.picURL}
// 											alt=""
// 										></img>
// 									</td>
// 									<td
// 										style={{
// 											fontSize: 20,
// 										}}
// 									>
// 										{cart.productName}
// 									</td>
// 									<td
// 										style={{
// 											fontSize: 20,
// 										}}
// 									>
// 										{cart.productCode}
// 									</td>
// 									<td
// 										style={{
// 											fontSize: 20,
// 										}}
// 									>
// 										Rs {cart.price}
// 									</td>

// 									<td
// 										style={{
// 											fontSize: 20,
// 										}}
// 									>
// 										<Button
// 											style={{
// 												fontSize: 15,
// 												backgroundColor: "black",
// 												borderRadius: 0,
// 												border: "3px solid white",
// 											}}
// 											onClick={() => decreaseQuanity(cart._id, cart.quantity)}
// 										>
// 											<i className="fa-solid fa-circle-minus"></i> {/* Changed class to className */}
// 										</Button>
// 										&emsp;
// 										{cart.quantity}
// 										&emsp;
// 										<Button
// 											style={{
// 												fontSize: 15,
// 												backgroundColor: "black",
// 												borderRadius: 0,
// 												border: "3px solid white",
// 											}}
// 											onClick={() => increaseQuanity(cart._id, cart.quantity)}
// 										>
// 											<i className="fa-solid fa-circle-plus"></i> {/* Changed class to className */}
// 										</Button>
// 									</td>
// 									<td>
// 										<Button
// 											style={{
// 												fontSize: 15,
// 												backgroundColor: "red",
// 												borderRadius: 0,
// 												border: "3px solid white",
// 											}}
// 											onClick={() => deleteHandler(cart._id)}
// 										>
// 											<i
// 												className="fa-solid fa-trash" 
// 												onClick={() => deleteHandler(cart._id)}
// 												style={{ cursor: "pointer" }}
// 											></i>
// 										</Button>
// 									</td>
// 								</tr>
// 							))}
// 						</tbody>
// 					</>
// 				</Table>

// 				<Button
// 					style={{
// 						paddingRight: "5px",
// 						paddingLeft: "5px",
// 						width: "130px",
// 						backgroundColor: "black",
// 						border: "3px solid white",
// 						fontSize: "18px",
// 						height: "50px",
// 						borderRadius: "0px",
// 						borderWidth: "5px white",
// 					}}
// 					onClick={() => checkout()}
// 				>
// 					Checkout
// 				</Button>

// 				<br></br>
// 			</div>
// 		);
// 	} else {
// 		return (
// 			<div className="denied">
// 				<MainScreen />
// 				<br></br>
// 			</div>
// 		);
// 	}
// }
