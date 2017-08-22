function BasicCard(question,answer){
	this.front = question;
	this.back = answer;
}

var card = new BasicCard("Who was the first president of the United States?", "George Washington");
//console.log(card.front);
//console.log(card.back);

module.exports = BasicCard;