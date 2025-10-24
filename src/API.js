import axios from "axios"

const baseURL = 'http://localhost:4001/api/'

let apiObj = {
     userSignUp : (data, headers) => {
        return axios.post(`${baseURL}user/signUp`, data , {headers})
     },
     userLogin : (data,headers,withCredentials) => {
      return axios.post(`${baseURL}user/login`, data ,{headers},{withCredentials})
     },
     userLogOut : () => {
      return axios.post(`${baseURL}user/logOut`)
     },
     addNewPost : (formData) => {
      return axios.post(`${baseURL}post/addNewPost`, formData )
     },
//    searchText : (data) => {
//    return axios.get(`${baseURL}map/searchText`, data)
//    },
}

export default apiObj