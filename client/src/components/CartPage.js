import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import './../components/css/cart.css';
import ConfigContext from './../contexts/ConfigContext';

export default function Cart() {
  const [products, setProducts] = useState([]); 
  const { getApiUrl } = useContext(ConfigContext); 
  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('${apiUrl}:3001/api/cart'); // Adjust the endpoint as needed
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard>
              <MDBCardBody className="p-4">
                <MDBRow>
                  <MDBCol lg="7">
                    <MDBTypography tag="h5">
                      <a href="#!" className="text-body">
                        <MDBIcon fas icon="long-arrow-alt-left me-2" /> Continue shopping
                      </a>
                    </MDBTypography>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <p className="mb-1">Shopping cart</p>
                        <p className="mb-0">You have {products.length} items in your cart</p>
                      </div>
                      <div>
                        <p>
                          <span className="text-muted">Sort by:</span>
                          <a href="#!" className="text-body">
                            price <MDBIcon fas icon="angle-down mt-1" />
                          </a>
                        </p>
                      </div>
                    </div>

                    {products.map(product => (
                      <MDBCard className="mb-3" key={product._id}>
                        <MDBCardBody>
                          <div className="d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                              <div>
                                <MDBCardImage
                                  src={product.imageUrl} // Adjust according to your product model
                                  fluid className="rounded-3" style={{ width: "65px" }}
                                  alt="Shopping item" />
                              </div>
                              <div className="ms-3">
                                <MDBTypography tag="h5">
                                  {product.name} {/* // Adjust according to your product model */}
                                </MDBTypography>
                                <p className="small mb-0">{product.description}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                              <div style={{ width: "50px" }}>
                                <MDBTypography tag="h5" className="fw-normal mb-0">
                                  {product.quantity} {/* // Adjust according to your product model */}
                                </MDBTypography>
                              </div>
                              <div style={{ width: "80px" }}>
                                <MDBTypography tag="h5" className="mb-0">
                                  {product.price}€ {/* // Adjust according to your product model */}
                                </MDBTypography>
                              </div>
                              <a href="#!" style={{ color: "#cecece" }}>
                                <MDBIcon fas icon="trash-alt" />
                              </a>
                            </div>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    ))}
                  </MDBCol>

                  {/* Checkout section omitted for brevity */}
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
