import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types'; 
import axios from 'axios';

/**
 * Returning each const below to the REDUCER
 */
export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/items').then(res => dispatch({
        type: GET_ITEMS,
        payload: res.data
    }));

    // return {
    //     type: GET_ITEMS
    // };
};

export const addItem = item => dispatch => {
    axios.post('/api/items', item).then(res => dispatch({
        type: ADD_ITEM,
        payload: res.data
    }));

    // return {
    //     type: ADD_ITEM,
    //     payload: item
    // };
};

export const deleteItem = id => dispatch => {
    axios.delete(`/api/items/${id}`).then(res => dispatch({ //Deleting from the server, then dispatching to the reducer
        type: DELETE_ITEM,
        payload: id
    }));

    // return {
    //     type: DELETE_ITEM,
    //     payload: id
    // };
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};