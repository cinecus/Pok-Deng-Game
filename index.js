const inquirer = require('inquirer')

class Deck {
    constructor() {
        this.deck = [];
        this.reset(); //Add 52 cards to the deck
        this.shuffle(); //Suffle the deck
    } //End of constructor

    reset() {
        this.deck = [];
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

        for (let suit in suits) {
            for (let value in values) {
                this.deck.push(suits[suit] + "-" + values[value]);
            }
        }
    } //End of reset()


    shuffle() {
        let numberOfCards = this.deck.length;
        for (var i = 0; i < numberOfCards; i++) {
            let j = Math.floor(Math.random() * numberOfCards);
            let tmp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = tmp;
        }
    } //End of shuffle()

    deal() {
        return this.deck.pop();
    } //End of deal()

    isEmpty() {
        return (this.deck.length == 0);
    } //End of isEmpty()

    length() {
        return this.deck.length;
    }

} //End of Deck Class

let wallet = 0 //เก็บเงินทั้งหมด

//รับ input เป็น array แล้วมาคำนวณแต้ม
const countPoint = (card) => {
    const obj = {
        Ace: 1,
        Jack: 10,
        Queen: 10,
        King: 10
    }
    const alphabet_val = ['Ace', 'Jack', 'Queen', 'King']

    let result = card.reduce((prev, cur) => {
        const [suit, values] = cur.split('-')
        if (alphabet_val.includes(values)) {
            prev.value += obj[values]
        } else {
            prev.value += +values
        }
        prev.suit.push(suit)
        return prev
    }, {
        suit: [],
        value: 0
    })

    const point = {
        value: result.value % 10,
        type: [...new Set(result.suit)].length > 1 ? "normal" : "multi"
    }
    return point
}

//รับไพ่บนมือของคุณและเจ้ามือมานับเป็นแต้ม
const CheckScore = (player_hand) => {
    //const your = countPoint(your_hand)
    //const dealer = countPoint(dealer_hand)
    const score = player_hand.map(el => countPoint(el))
    //console.log(`You got ${your_hand[0]}, ${your_hand[1]}`) //แสดงบน cmd
    //console.log(`The dealer got ${dealer_hand[0]}, ${dealer_hand[1]}`) //แสดงบน cmd

    // console.log('your_hand', your_hand)
    // console.log('dealer_hand', dealer_hand)
    // console.log('your', your)
    // console.log('dealer', dealer)
    return score
}

//ทำการแจกไพ่ให้ เจ้ามือ กับ คุณ แล้วเทียบแต้มกัน ถ้าเสมอ ไม่เกิดอะไรขึ้น ถ้าชนะ wallet จะบวกเงินตามที่ bet ถ้าแพ้ เสีย bet
const Turn = (bet, player) => {
    let your_hand = []
    let dealer_hand = []

    let player_hand = []
    const new_deck = new Deck()

    for (let i = 0; i < player; i++) {
        const deal_1 = new_deck.deal()
        const deal_2 = new_deck.deal()
        player_hand.push([deal_1, deal_2])
        // if (i % 2 === 0) {
        //     your_hand.push(deal)
        // } else {
        //     dealer_hand.push(deal)
        // }
    }
    //console.log('new_deck.length', new_deck.deck.length)

    const player_score = CheckScore(player_hand)

    for (let i = 0; i < player_score.length; i++) {
        console.log(`player ${i} score : ${player_score[i].value}`)

    }


    // if (your.value > dealer.value) {
    //     wallet += +bet
    //     console.log(`You won!!!, received ${bet} chips`) //แสดงบน cmd
    // } else if (your.value < dealer.value) {
    //     wallet -= +bet
    //     console.log(`You lose!!!, lost ${bet} chips`) //แสดงบน cmd
    // } else {
    //     console.log(`You tie!!!`) //แสดงบน cmd
    // }
}


const Start = async () => {
    let start = true
    while (start) {
        const { bet } = await inquirer.prompt({
            type: 'input',
            name: 'bet',
            message: 'Please put your bet?'
        })
        const { player } = await inquirer.prompt({
            type: 'input',
            name: 'player',
            message: 'How many player?'
        })
        console.log(bet)
        await Turn(bet, player)
        const { confirm } = await inquirer.prompt({
            type: 'list',
            name: 'confirm',
            choices: ['Yes', 'No'],
            message: 'Wanna play more (Yes/No)?'
        })
        start = confirm == 'Yes'
    }
    console.log(`You got total ${wallet} chips`)
}

Start()

// setInterval(() => {
//     console.log('Turn()', Turn(5))
//     console.log('wallet', wallet)
// }, 500)

