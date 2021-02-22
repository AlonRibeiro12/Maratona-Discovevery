const Modal = {
    open(){
      // Abrir modal
      document.querySelector('.modal-overlay')
      .classList
      .add('active')
    // adicionar a class active ao modal
    },
    closer(){
      //fechar o modal
      document.querySelector('.modal-overlay')
      .classList
      .remove('active')
      // remover a class active do modal
    },
    

    
  }


  const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
};

//Este array foi utilizado nos testes!



const Transaction = {
  all: Storage.get(),
  add(transaction){
      Transaction.all.push(transaction);        
      App.reload();
  },
  
  remove(index){
      Transaction.all.splice(index, 1);
      App.reload();
  },

      incomes() {
          let income = 0;
        //Somar as entradas
        //pegar todas as transações 
         //para cada transação se ela for maio que zero
        Transaction.all.forEach(transaction =>{
          if (transaction.amount > 0 ) {
             //somar a uma variavel e retornar a variavel
            // income = income + transaction.amount;
             income +=transaction.amount;
          }
        })
       
       
        return income;
      },
      expenses() {
        //somar as saídas
        let expense = 0;
        //Somar as entradas
        //pegar todas as transações 
         //para cada transação se ela for maior que zero
         Transaction.all.forEach(transaction =>{
          if (transaction.amount < 0 ) {
             //somar a uma variavel e retornar a variavel
            // income = income + transaction.amount;
             expense +=transaction.amount;
          }
        })
        return expense;
      },
      total() {
       
        return Transaction.incomes() + Transaction.expenses();
      }

  }
  //Substituir os dados do HTML com os dados do js
  
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
      const tr = document.createElement('tr')
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
      tr.dataset.index = index

     DOM.transactionsContainer.appendChild(tr)
  
    },


    innerHTMLTransaction(transaction, index) {
        const Cssclass= transaction.amount > 0 ? "income": 
        "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        
          <td class="descripcition">${transaction.description}</td>
          <td class="${Cssclass}">${amount}</td>
          <td class="date">${transaction.date}</td>
          <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover trasação">
          </td>
        `
        return html
    },


    updateBalace() {
      document.getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())

      document.getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())

      document.getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
  }  

const Utils = {
    formatAmount(value){
       value = Number(value) *100
     
       return  Math.round(value)
    },

    formatDate(date) {
        const splitteDate = date.split("-")
        return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`
    },


    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-": ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR",{
          style: "currency",
          currency: "BRL",
        })
        
        return signal + value
    }

}

const Form = {

      description: document.querySelector('input#description'),
      amount: document.querySelector('input#amount'),
      date: document.querySelector('input#date'),

      getValues() {
        return {
          description: Form.description.value,
          amount: Form.amount.value,
          date: Form.date.value
        }
      },

   validateFields(){
     const { description, amount, date} = Form.getValues()
      
     if( description.trim() === "" || 
      amount.trim() === "" ||
     date.trim() === "" ){
        throw new Error("Por favor preencha todos os campos")
     }
    },

    formatValues(){
      let {description , amount, date} = Form.getValues()

      amount = Utils.formatAmount(amount)

      date  = Utils.formatDate(date)

      return{
        description,
        amount,
        date
      }
    },

      clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
      },
    

  submit(event) {
     event.preventDefault()
     //verificar se todas as informações foram preenchidas
     try {
          
     Form.validateFields()
     
     //formatar os dados para salvar 
     const transaction = Form.formatValues()
     //salvar
     Transaction.add(transaction)
     //apagar os dados do formulário
     Form.clearFields()
     //modal feche
     Modal.closer()
     //atualizar a aplicação
     } catch (error) {
       alert(error.message)
     }   
  
  }
}
 

const App = {
  init() {
    
    Transaction.all.forEach(DOM.addTransaction);
    /*(transaction => {
    DOM.addTransaction(transaction)
  })*atalho :(DOM.addTransaction);*/
  Storage.set(Transaction.all)
  
  DOM.updateBalace()
 
 
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}
App.init()

