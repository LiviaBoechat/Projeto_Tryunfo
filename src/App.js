import React from 'react';
import Form from './components/Form';
import Card from './components/Card';

class App extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.validateButton = this.validateButton.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.cleanInputs = this.cleanInputs.bind(this);
    this.validateCheckbox = this.validateCheckbox.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.filterName = this.filterName.bind(this);

    this.state = {
      cardName: '',
      cardDescription: '',
      cardAttr1: '0',
      cardAttr2: '0',
      cardAttr3: '0',
      cardImage: '',
      cardRare: 'normal',
      cardTrunfo: false,
      hasTrunfo: false,
      isSaveButtonDisabled: true,
      cardList: [],
      nameFilter: '',
    };
  }

  handleChange({ target }) {
    this.validateCheckbox();
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (name === 'nameFilter') {
      this.filterName();
    }

    this.setState((previousState) => ({
      ...previousState,
      [name]: value,
    }), () => this.validateButton());
  }

  onSaveButtonClick(event) {
    // pag. não atualizar qd o botão(tipo submit) for clicado
    event.preventDefault();
    const { cardName, cardDescription,
      cardAttr1, cardAttr2,
      cardAttr3, cardImage,
      cardRare, cardList, cardTrunfo } = this.state;

    const cardObject = {
      cardName,
      cardDescription,
      cardAttr1,
      cardAttr2,
      cardAttr3,
      cardImage,
      cardRare,
      cardTrunfo,
    };

    // espalhei dentro do array o que já tem salvo no estado cardList e insiro novo objeto a cada clique no botão salvar
    const createDeck = [...cardList, cardObject];

    this.setState({
      cardList: createDeck,
    }, () => this.cleanInputs());
  }

  deleteButton(event) {
    event.preventDefault();
    const { cardList } = this.state;
    const newCardList = cardList;

    const deletedCard = newCardList.find((card) => event.target.id === card.cardName);

    if (deletedCard.cardTrunfo === true) {
      this.setState({
        hasTrunfo: false,
      });
    }

    const findIndex = newCardList.indexOf(deletedCard);
    newCardList.splice(findIndex, 1);

    this.setState({
      cardList: newCardList,
    });
  }

  filterName() {
    const { cardList } = this.state;

    const foundCardObject = cardList
      .find((cardObject) => cardObject.cardname === nameFilter);

    this.setState({
      cardList: [foundCardObject],
    });
  }

  validateCheckbox() {
    const { cardList } = this.state;

    const hasTrunfoValue = cardList.some((cardObject) => cardObject.cardTrunfo === true);

    this.setState({
      hasTrunfo: hasTrunfoValue,
    });
  }

  cleanInputs() {
    this.setState((previousState) => ({
      ...previousState,
      cardName: '',
      cardDescription: '',
      cardAttr1: '0',
      cardAttr2: '0',
      cardAttr3: '0',
      cardImage: '',
      cardRare: 'normal',
      cardTrunfo: false,
      hasTrunfo: this.validateCheckbox(),
    }));
  }

  validateButton() {
    const { cardName, cardDescription,
      cardAttr1, cardAttr2,
      cardAttr3, cardImage,
      cardRare } = this.state;

    const attrSum = 210;
    const eachAttr = 90;
    let res = false;
    if (cardName.length === 0
      || cardDescription.length === 0
      || cardImage.length === 0
      || cardRare.length === 0) {
      res = true;
      // console.log('if1');
    }
    if (Number(cardAttr1) + Number(cardAttr2) + Number(cardAttr3) > attrSum) {
      res = true;
      // console.log('if2');
    }
    if (Number(cardAttr1) > eachAttr
    || Number(cardAttr2) > eachAttr
    || Number(cardAttr3) > eachAttr) {
      res = true;
      // console.log('if3');
    }
    if (Number(cardAttr1) < 0
    || Number(cardAttr2) < 0
    || Number(cardAttr3) < 0) {
      res = true;
      // console.log('if4');
    }

    this.setState({
      isSaveButtonDisabled: res,
    });
  }

  render() {
    const { cardName, cardDescription,
      cardAttr1, cardAttr2,
      cardAttr3, cardImage,
      cardRare, hasTrunfo, cardTrunfo, isSaveButtonDisabled, cardList } = this.state;
    return (
      <>
        <div>
          <h1>Tryunfo</h1>
        </div>
        <Form
          cardName={ cardName }
          cardDescription={ cardDescription }
          cardAttr1={ cardAttr1 }
          cardAttr2={ cardAttr2 }
          cardAttr3={ cardAttr3 }
          cardImage={ cardImage }
          cardRare={ cardRare }
          cardTrunfo={ cardTrunfo }
          hasTrunfo={ hasTrunfo }
          isSaveButtonDisabled={ isSaveButtonDisabled }
          onInputChange={ this.handleChange }
          onSaveButtonClick={ this.onSaveButtonClick }
        />
        <Card
          key={ cardName }
          cardName={ cardName }
          cardDescription={ cardDescription }
          cardAttr1={ cardAttr1 }
          cardAttr2={ cardAttr2 }
          cardAttr3={ cardAttr3 }
          cardImage={ cardImage }
          cardRare={ cardRare }
          cardTrunfo={ cardTrunfo }
        />
        <div>
          <p>
            Filtro de busca
          </p>
          <input
            data-testid="name-filter"
            type="text"
            placeholder="Nome da carta"
            name="nameFilter"
            onChange={ this.handleChange }
          />
          <select
            data-testid="rare-filter"
          >
            <option value="todas">todas</option>
            <option value="normal">normal</option>
            <option value="raro">raro</option>
            <option value="muito raro">muito raro</option>
          </select>
        </div>
        { cardList.map((eachCard) => (
          <div
            key={ eachCard.cardName }
          >
            <Card
              cardName={ eachCard.cardName }
              cardDescription={ eachCard.cardDescription }
              cardAttr1={ eachCard.cardAttr1 }
              cardAttr2={ eachCard.cardAttr2 }
              cardAttr3={ eachCard.cardAttr3 }
              cardImage={ eachCard.cardImage }
              cardRare={ eachCard.cardRare }
              cardTrunfo={ eachCard.cardTrunfo }
            />
            <button
              id={ eachCard.cardName }
              data-testid="delete-button"
              type="button"
              name="deleteButton"
              onClick={ this.deleteButton }
            >
              Excluir
            </button>
          </div>
        ))}
      </>
    );
  }
}

export default App;
