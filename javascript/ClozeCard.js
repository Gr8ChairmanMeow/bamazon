function ClozeCard(full,answer){
	this.fullText = full;
	this.cloze = answer;
	this.partial = function(){
		var check = this.fullText.indexOf(this.cloze);
		if(check === -1){
			return(this.cloze + " is not a valid answer for this question!");
		}	
		else{
			return this.fullText.replace(this.cloze,"...");
		}
	}
}
//var card = new ClozeCard("George Washington was the first president of the United States.", "test");
//var card = new ClozeCard("George Washington was the first president of the United States.", "George Washington");
//console.log(card.fullText);
//console.log(card.partial());
//console.log(card.cloze);

module.exports = ClozeCard;