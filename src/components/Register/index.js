import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import firebase from "../../firebase";
import { auth } from "firebase";

// Estilos
import "./register.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: "",
      email: "",
      password: ""
    };

    this.register = this.register.bind(this);
    this.onRegister = this.onRegister.bind(this);
  }

  register(e) {
    this.onRegister();

    e.preventDefault();
  }

  onRegister = async () => {
    try {
      const { nome, email, password } = this.state;

      await firebase
        .register(nome, email, password)
        .then(res => {
          alert(res);
        })
        .catch(error => {
          alert(error.code);
        });

      this.props.history.replace("dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <div>
        <h1 className="register-h1">Novo usuário</h1>
        <form onSubmit={this.register} id="register">
          <label>Nome:</label>
          <input
            type="text"
            value={this.state.nome}
            onChange={e =>
              this.setState({
                nome: e.target.value
              })
            }
            autoFocus
            autoComplete="off"
            placeholder="Seu nome"
          />

          <label>Email:</label>
          <input
            type="email"
            value={this.state.email}
            onChange={e =>
              this.setState({
                email: e.target.value
              })
            }
            autoComplete="off"
            placeholder="Seu e-mail"
          />

          <label>Senha:</label>
          <input
            type="password"
            value={this.state.password}
            onChange={e =>
              this.setState({
                password: e.target.value
              })
            }
            autoComplete="off"
            placeholder="Sua senha"
          />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
  }
}

export default withRouter(Register);
