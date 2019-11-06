import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import firebase from "../../firebase";

// Estilos
import "./new.css";

class New extends Component {
  constructor(props) {
    super(props);

    this.state = {
      titulo: "",
      imagem: null,
      url: "",
      descricao: "",
      alert: "",
      progress: 0
    };

    this.cadastrar = this.cadastrar.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    if (!firebase.getCurrent()) {
      this.props.history.replace("/login");
      return null;
    }
  }

  cadastrar = async e => {
    const { titulo, imagem, descricao, url } = this.state;

    if (titulo !== "" && imagem !== null && descricao !== "" && url !== "") {
      let posts = firebase.app.ref("posts");

      let chave = posts.push().key;

      await posts.child(chave).set({
        titulo: titulo,
        image: url,
        descricao: descricao,
        autor: localStorage.nome
      });

      this.props.history.replace("/dashboard");
    } else {
      this.setState({ alert: "Preencha todos os campos!" });
    }

    e.preventDefault();
  };

  handleFile = async e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/png" || image.type === "image/jpeg") {
        await this.setState({ imagem: image });
        this.handleUpload();
      } else {
        alert("Envie uma imagem do tipo PNG ou JPEG");
        this.setState({ imagem: null });
        return null;
      }
    }
  };

  handleUpload = async () => {
    const { imagem } = this.state;
    const currentUid = firebase.getCurrentUid();
    const uploadTask = firebase.storage
      .ref(`images/${currentUid}/${imagem.name}`)
      .put(imagem);

    await uploadTask.on(
      "state_changed",
      snapshot => {
        // Progresso
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // Erro
        console.log("Erro imagem: " + error);
      },
      () => {
        // Sucesso
        firebase.storage
          .ref(`images/${currentUid}`)
          .child(imagem.name)
          .getDownloadURL()
          .then(url => {
            this.setState({ url: url });
          });
      }
    );
  };

  render() {
    return (
      <div>
        <header id="new">
          <Link to="/dashboard">Voltar</Link>
        </header>
        <form onSubmit={this.cadastrar} id="new-post">
          <span>{this.state.alert}</span>

          <label>Capa do post: </label>
          <input type="file" onChange={this.handleFile} />

          {this.state.url !== "" ? (
            <img src={this.state.url} alt="Capa do post" />
          ) : (
            <progress value={this.state.progress} max="100" />
          )}

          <label>Titulo: </label>
          <input
            type="text"
            placeholder="Titulo do post"
            autoFocus
            value={this.state.titulo}
            onChange={e => this.setState({ titulo: e.target.value })}
          />

          <label>Descição: </label>
          <textarea
            type="text"
            placeholder="Conteúdo do post"
            value={this.state.descricao}
            rows="10"
            onChange={e => this.setState({ descricao: e.target.value })}
          />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
  }
}

export default withRouter(New);
