import * as yup from 'yup';
import { useState } from "react"
import {useDispatch, useSelector} from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from "react-bootstrap"
import { useCreateReviewMutation} from "redux/slices/productsApiSlice"
import useForm from "utils/hooks/useForm"

//ACTIONS
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";

//SELECTORS
import * as AUTH_SELECTORS from "redux/selectors/authSelector";
import Message from 'components/Message';

const REVIEW_DEFAULT = {
	rating: "",
	comment: ""
}

const FormReview = ({selectedProduct, refetchProduct}) => {
    const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [errors, setErrors]= useState({});

    const userInfo = useSelector(AUTH_SELECTORS.selectUserInfo);
    const isLogged = useSelector(AUTH_SELECTORS.selectIsLogged);

    const [createReview, {isError: isErrorReview, isLoading: isLoadingReview, isSuccess: isSuccessReview, data: dataReview, error: errorReview}] = useCreateReviewMutation();


    const {rating: ratingReview, comment: commentReview, form: review, setForm, handleChange} = useForm(REVIEW_DEFAULT);

    let reviewSchema = yup.object().shape({
		rating: yup.string().required("La valoración es requerido"),
		comment: yup.string().required("El comentario es requerido")
	})    

    const handleSubmit = async (e, review) => {
		e.preventDefault();
		try{
			//HACEMOS LA REDIRECCION DE FORMA MANUAL, YA QUE ANTERIOEMNTE LO HICIMOS CON EL HOC PROTECTEDROUTEPRIVATE
			if(!isLogged){
				dispatch(AUTH_ACTIONS.saveRedirectTo(location.pathname));
				navigate("/auth/login");
			}

            const token = JSON.parse(localStorage.getItem("token"));
			//validData es simplemente  el objeto con sus valores
			await reviewSchema.validate(review, { abortEarly: false });
			const newReview = {
				...review,
				productId: selectedProduct.id,
				userId: userInfo.id
			}
			await createReview({token, idProduct: selectedProduct.id, newReview});
			setForm(REVIEW_DEFAULT)
			setErrors({})
			refetchProduct();
		}catch(err){
			//Si es un error de yup lo validamos con err.inner
			if(err.inner){
				let errors = {}
				err.inner.forEach(error => {
					errors[error.path] = error.errors[0]
				})
				setErrors({...errors})
			}
			//Error global
            if(err.status === 401 || err.status === 403){
                dispatch(ERROR_ACTIONS.saveMessage(err?.data?.message || err?.error || err.message))
                dispatch(AUTH_ACTIONS.logout());
            }

		}
	}
  return (
    <>

        <h2>Write a Customer Review</h2>
        {isErrorReview && <Message variant="danger">{errorReview?.data.message || errorReview.error}</Message>}
        {isSuccessReview && <Message variant="success">{dataReview?.message}</Message>}
        <Form onSubmit={(e) => handleSubmit(e, review)}>
            <Form.Group controlId="rating" className="my-2">
                <Form.Label>Rating</Form.Label>
                <Form.Control as="select" value={ratingReview} name="rating" onChange={handleChange}>
                    <option value="" disabled>--Select--</option>
                    <option value={1}>1 - Poor</option>
                    <option value={2}>2 - Fair</option>
                    <option value={3}>3 - Good</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={5}>5 - Excellent</option>
                </Form.Control>
                {errors["rating"] && (
                    <Form.Text className="text-danger">
                        {errors["rating"]}
                    </Form.Text>
                )}
            </Form.Group>
            <Form.Group controlId="comment" className="my-2">
                <Form.Label>Comment</Form.Label>
                <Form.Control name="comment" as="textarea" row="3" value={commentReview} onChange={handleChange}></Form.Control>
                {errors["comment"] && (
                    <Form.Text className="text-danger">
                        {errors["comment"]}
                    </Form.Text>
                )}
                
            </Form.Group>
            <Button type="submit" variant="primary" disabled={isLoadingReview}>Submit</Button>
        </Form>
    </>
  )
}

export default FormReview