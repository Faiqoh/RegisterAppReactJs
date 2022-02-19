import axios from "axios";
const API_URL = "http://localhost:8080/api/auth/";
class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + `signin`, {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password) {
    return axios.post(API_URL + `signup`, {
      username,
      email,
      password
    });
  }
  changePass(id, password){
    return axios.post(API_URL + `changePass/${id}`, {
      password
    });
  }
  forgotPass(email){
    return axios.post(API_URL + `password-reset`, {
      email
    });
  }
  resetPass(id, password){
    return axios.post(API_URL + `password-reset/reset/${id}`, {
      password
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}
export default new AuthService();