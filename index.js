// Modulos Externos //
import chalk from "chalk";
import inquirer from "inquirer";
// Modulos Internos //
import fs from "fs";

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "select",
        name: "action",
        message: "O que voce deseja fazer",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      if (action === "Criar Conta") {
        CreateAccount();
      }
      if (action === "Consultar Saldo") {
        saldo();
      }
      if (action === "Depositar") {
        Depositar();
      }
      if (action === "Sacar") {
        sacar();
      }
      if(action ==="Sair"){
        sair();
      }
    })
    .catch((err) => console.log(err));
}

//Create Account//
function CreateAccount() {
  console.log(chalk.bgGreen.black("Parabens Por Escolher Nosso Banco"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));

  BuildAccount();
}

function BuildAccount() {
  inquirer
    .prompt([
      {
        name: "AccountName",
        message: "Digite um nome para sua conta",
      },
    ])
    .then((answer) => {
      const AccountName = answer["AccountName"];
      console.info(AccountName);
      if (!fs.existsSync("Accounts")) {
        fs.mkdirSync("accounts");
      }
      if (fs.existsSync(`accounts/${AccountName}.json`)) {
        (console.log(chalk.bgRed.black("Esta conta ja existe")),
          BuildAccount());
        return;
      }
      fs.writeFileSync(
        `accounts/${AccountName}.json`,
        '{"balance":0}',
        function (err) {
          console.log(err);
        },
      );
      console.log(chalk.green("Parabens, a sua conta foi criada"));
      operation();
    })
    .catch((err) => console.log(err));
}
//Create Account//

//consultar salto//
function saldo() {
  inquirer
    .prompt([
      {
        name: "Consultar",
        message: "Digite o nome da conta que deseja consultar o saldo:",
      },
    ])
    .then((answer) => {
      const consultar = answer["Consultar"];
      const accountPath = `accounts/${consultar}.json`;

      if (!fs.existsSync(accountPath)) {
        console.log(
          chalk.bgRed.black("Essa conta não existe por favor informe outra"),
        );
        saldo();
        return;
      }
      const accountFile = fs.readFileSync(accountPath, "utf8");
      const accountData = JSON.parse(accountFile);
      console.log(
        chalk.green(
          `O saldo da conta ${consultar} é R$ ${accountData.balance}`,
        ),
      );
      operation();
    })
    .catch((err) => console.log(err));
}
//consultar salto//

//depositar//
function Depositar() {
  inquirer
    .prompt([
      {
        name: "Depositar",
        message: "Digite o nome da conta que deseja fazer o deposito:",
      },
    ])
    .then((answer) => {
      const conta = answer["Depositar"];
      const accountPath = `accounts/${conta}.json`;

      if (!fs.existsSync(accountPath)) {
        console.log(
          chalk.bgRed.black("Essa conta não existe por favor informe outra"),
        );
        Depositar();
        return;
      }

      inquirer
        .prompt([
          {
            name: "Deposito",
            message: "Insira o valor que deseja depositar:",
          },
        ])
        .then((answer) => {
          const valor = Number(answer["Deposito"]);
          const accountFile = fs.readFileSync(accountPath, "utf8");
          const accountData = JSON.parse(accountFile);
          const ValorTotal = valor + accountData.balance;

          if (valor < 1) {
            console.log(
              chalk.bgRed.black(
                "Não é possível depositar um valor menor que R$1",
              ),
            );

            Depositar();
            return;
          }
          if (isNaN(valor)) {
            console.log(
              chalk.bgRed.black(
                "Por favor digite um número na hora do depósito",
              ),
            );

            Depositar();
            return;
          }
          fs.writeFileSync(
            `accounts/${conta}.json`,
            `{"balance":${ValorTotal}}`,
          );
          console.log(
            chalk.green(
              `Seu deposito de R$${valor} na conta ${conta} foi feito com sucesso`,
            ),
          );
          operation();
        });
    });
}
//depositar//

//sacar
function sacar() {
  inquirer
    .prompt([
      {
        name: "sacar",
        message: "Digite o nome da conta que deseja sacar o dinheiro:",
      },
    ])
    .then((answer) => {
      const NomeConta = answer["sacar"];
      const accountPath = `accounts/${NomeConta}.json`;

      if (!fs.existsSync(accountPath)) {
        console.log(
          chalk.bgRed.black("Essa conta não existe por favor informe outra"),
        );
        sacar();
        return;
      }
      inquirer
        .prompt([
          {
            name: "ValorSaque",
            message: "Digite o valor que deseja sacar dessa conta:",
          },
        ])
        .then((answer) => {
          const ValorSaque = Number(answer["ValorSaque"]);

          if (ValorSaque < 1) {
            console.log(
              chalk.bgRed.black("Não é possível sacar um valor menor que R$1"),
            );

            sacar();
            return;
          }
          if (isNaN(ValorSaque)) {
            console.log(
              chalk.bgRed.black("Por favor digite um número na hora do saque"),
            );

            sacar();
            return;
          }

          const accountFile = fs.readFileSync(accountPath, "utf8");
          const accountData = JSON.parse(accountFile);
          if (accountData.balance < ValorSaque) {
            console.log(
              chalk.bgRed.black("essa conta não possui saldo o suficiente"),
            );
            operation();
            return;
          }
          const ValorTotal = accountData.balance - ValorSaque;
          fs.writeFileSync(
            `accounts/${NomeConta}.json`,
            `{"balance":${ValorTotal}}`,
          );
          console.log(
            chalk.bgGreen.black(
              `Seu saque de R$${ValorSaque} da conta ${NomeConta} foi feito com sucesso`,
            ),
          );
          operation();
        });
    });
}
//sacar
function sair(){
console.log(chalk.bgGreen.black("Muito Obrigado Por Usar o nosso sistema, volte sempre"))
process.exit(0);
}