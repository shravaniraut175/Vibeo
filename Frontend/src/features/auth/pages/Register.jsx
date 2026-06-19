import { Link } from "react-router";
import "../styles/form.scss";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e){
    e.preventDefault();


    axios.post("http://localhost:3000/auth/register", {
      username,
      email,
      password
    })
    .then(res => {      console.log(res.data);
    })
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="Enter username"
          />
          <input
            onInput={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Enter email"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Enter password"
          />

          <button onSubmit={handleSubmit} type="submit">Register</button>
        </form>
        <p>
          Already have an account?{" "}
          <Link className="toggleInForm" to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;